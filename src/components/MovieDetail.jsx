import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";
const TMDB_IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

function StarRating({ value }) {
  const stars = Math.round(value);
  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`star ${s <= stars ? "filled" : ""}`}>★</span>
      ))}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="review-card skeleton-review">
      <div className="skeleton-line long" style={{ marginBottom: "10px" }} />
      <div className="skeleton-line short" />
      <div className="skeleton-line long" style={{ marginTop: "10px" }} />
      <div className="skeleton-line" style={{ width: "70%", marginTop: "6px" }} />
    </div>
  );
}

export default function MovieDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const movie = state?.movie;
  const user = state?.user;

  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [showTrailer, setShowTrailer] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!movie?.id) return;

    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${TMDB_API_KEY}&language=en-US`).then(r => r.json()),
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`).then(r => r.json()),
    ])
      .then(([det, credits, vids]) => {
        setDetails(det);
        setCast(credits.cast?.slice(0, 8) || []);

        const ytTrailer =
          vids.results?.find(v => v.type === "Trailer" && v.site === "YouTube") ||
          vids.results?.find(v => v.site === "YouTube");
        if (ytTrailer) setTrailer(ytTrailer.key);

        setDetailsLoading(false);
      })
      .catch(() => setDetailsLoading(false));

    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/reviews?api_key=${TMDB_API_KEY}&language=en-US&page=1`)
      .then(r => r.json())
      .then(data => {
        setReviews(data.results?.slice(0, 6) || []);
        setReviewsLoading(false);
      })
      .catch(() => setReviewsLoading(false));
  }, [movie?.id]);

  if (!movie) {
    return (
      <div className="movie-detail-page">
        <div className="detail-error">
          <p>Movie not found.</p>
          <button className="book-btn" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  const backdropUrl = details?.backdrop_path
    ? `${TMDB_IMG_ORIGINAL}${details.backdrop_path}`
    : movie.backdrop_path
    ? `${TMDB_IMG_ORIGINAL}${movie.backdrop_path}`
    : null;

  const posterUrl = !imgError && (details?.poster_path || movie.poster_path)
    ? `${TMDB_IMG}${details?.poster_path || movie.poster_path}`
    : null;

  const rating = (details?.vote_average ?? movie.vote_average)
    ? ((details?.vote_average ?? movie.vote_average) / 2).toFixed(1)
    : null;

  const voteCount = details?.vote_count ?? movie.vote_count;
  const formattedVotes = voteCount >= 1000
    ? `${(voteCount / 1000).toFixed(1)}K+`
    : voteCount?.toString();

  const genres = details?.genres?.map(g => g.name) || movie.genre_names || [];

  const releaseDate = details?.release_date || movie.release_date
    ? new Date(details?.release_date || movie.release_date).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric"
      })
    : "";

  const runtime = details?.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : "";

  const language = details?.original_language?.toUpperCase() || "EN";
  const overview = details?.overview || movie.overview || "";

  return (
    <div className="movie-detail-page">

      {/* ── NAVBAR ── */}
      <nav className="detail-navbar">
        <button className="back-btn" onClick={() => navigate("/dashboard", { state: { user } })}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
        <span className="nav-logo" onClick={() => navigate("/dashboard", { state: { user } })} style={{ cursor: "pointer" }}>
          Lumino.
        </span>
      </nav>

      {/* ── HERO ── */}
      <div className="detail-hero">
        {backdropUrl && (
          <div className="detail-backdrop" style={{ backgroundImage: `url(${backdropUrl})` }} />
        )}
        <div className="detail-backdrop-overlay" />

        <div className="detail-hero-content">
          <div className="detail-poster-wrap">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie.title}
                className="detail-poster"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="detail-poster-placeholder">🎬</div>
            )}
            {trailer && (
              <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Watch Trailer
              </button>
            )}
          </div>

          <div className="detail-hero-info">
            <h1 className="detail-title">{movie.title}</h1>

            {rating && (
              <div className="detail-rating-badge">
                <StarRating value={parseFloat(rating)} />
                <span className="rating-number">{rating} / 5</span>
                {formattedVotes && <span className="rating-votes">{formattedVotes} votes</span>}
              </div>
            )}

            <div className="detail-meta-row">
              {genres.length > 0 && (
                <span className="detail-meta-item genres">{genres.join(", ")}</span>
              )}
              {genres.length > 0 && releaseDate && <span className="meta-dot">·</span>}
              {releaseDate && <span className="detail-meta-item">{releaseDate}</span>}
            </div>

            <div className="detail-tags">
              <span className="detail-tag">2D</span>
              <span className="detail-tag">{language}</span>
              {runtime && <span className="detail-tag">{runtime}</span>}
            </div>

            <button className="book-btn">Book Tickets</button>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="detail-tabs-bar">
        {["about", "cast", "reviews"].map((tab) => (
          <button
            key={tab}
            className={`detail-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "about" ? "About" : tab === "cast" ? "Cast & Crew" : "Reviews"}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="detail-body">

        {/* ABOUT */}
        {activeTab === "about" && (
          <div className="tab-panel about-panel">
            <div className="about-grid">
              <div className="about-main">
                <h2 className="panel-heading">About the movie</h2>
                <p className="about-overview">
                  {detailsLoading ? "Loading…" : overview || "No description available."}
                </p>
                {details?.tagline && (
                  <blockquote className="movie-tagline">"{details.tagline}"</blockquote>
                )}
              </div>

              <div className="about-sidebar">
                {detailsLoading ? (
                  <div className="sidebar-skeleton">
                    {[...Array(4)].map((_, i) => (
                      <div key={i}>
                        <div className="skeleton-line short" style={{ marginBottom: "6px" }} />
                        <div className="skeleton-line long" style={{ marginBottom: "16px" }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {details?.status && (
                      <div className="sidebar-row">
                        <span className="sidebar-label">Status</span>
                        <span className="sidebar-value">{details.status}</span>
                      </div>
                    )}
                    {releaseDate && (
                      <div className="sidebar-row">
                        <span className="sidebar-label">Release Date</span>
                        <span className="sidebar-value">{releaseDate}</span>
                      </div>
                    )}
                    {runtime && (
                      <div className="sidebar-row">
                        <span className="sidebar-label">Runtime</span>
                        <span className="sidebar-value">{runtime}</span>
                      </div>
                    )}
                    {details?.budget > 0 && (
                      <div className="sidebar-row">
                        <span className="sidebar-label">Budget</span>
                        <span className="sidebar-value">${(details.budget / 1_000_000).toFixed(1)}M</span>
                      </div>
                    )}
                    {details?.production_companies?.length > 0 && (
                      <div className="sidebar-row">
                        <span className="sidebar-label">Studio</span>
                        <span className="sidebar-value">
                          {details.production_companies.slice(0, 2).map(c => c.name).join(", ")}
                        </span>
                      </div>
                    )}
                    {genres.length > 0 && (
                      <div className="sidebar-row">
                        <span className="sidebar-label">Genres</span>
                        <div className="sidebar-tags">
                          {genres.map(g => <span key={g} className="sidebar-genre-tag">{g}</span>)}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CAST */}
        {activeTab === "cast" && (
          <div className="tab-panel cast-panel">
            <h2 className="panel-heading">Cast</h2>
            {detailsLoading ? (
              <div className="cast-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="cast-card">
                    <div className="cast-avatar-wrap skeleton-avatar" />
                    <div className="skeleton-line long" style={{ marginTop: "10px" }} />
                    <div className="skeleton-line short" style={{ marginTop: "6px" }} />
                  </div>
                ))}
              </div>
            ) : cast.length === 0 ? (
              <p className="no-data">No cast information available.</p>
            ) : (
              <div className="cast-grid">
                {cast.map((member) => (
                  <div key={member.id} className="cast-card">
                    <div className="cast-avatar-wrap">
                      {member.profile_path ? (
                        <img
                          src={`${TMDB_IMG}${member.profile_path}`}
                          alt={member.name}
                          className="cast-avatar"
                        />
                      ) : (
                        <div className="cast-avatar-placeholder">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <p className="cast-name">{member.name}</p>
                    <p className="cast-role">as {member.character}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === "reviews" && (
          <div className="tab-panel reviews-panel">
            <div className="reviews-header-row">
              <h2 className="panel-heading">Reviews</h2>
              {rating && (
                <div className="reviews-aggregate">
                  <span className="aggregate-score">{rating}</span>
                  <div>
                    <StarRating value={parseFloat(rating)} />
                    <span className="aggregate-count">{formattedVotes} ratings</span>
                  </div>
                </div>
              )}
            </div>

            {reviewsLoading ? (
              <div className="reviews-grid">
                {[...Array(4)].map((_, i) => <ReviewSkeleton key={i} />)}
              </div>
            ) : reviews.length === 0 ? (
              <div className="no-reviews">
                <span>📝</span>
                <p>No reviews yet. Be the first to review this movie!</p>
              </div>
            ) : (
              <div className="reviews-grid">
                {reviews.map((review) => {
                  const reviewRating = review.author_details?.rating;
                  const avatar = review.author_details?.avatar_path;
                  const avatarUrl = avatar
                    ? avatar.startsWith("/http") ? avatar.slice(1) : `${TMDB_IMG}${avatar}`
                    : null;
                  const date = review.created_at
                    ? new Date(review.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      })
                    : "";
                  const content = review.content?.length > 400
                    ? review.content.slice(0, 400) + "…"
                    : review.content;

                  return (
                    <div key={review.id} className="review-card">
                      <div className="review-top">
                        <div className="reviewer-info">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={review.author} className="reviewer-avatar" onError={e => e.target.style.display = 'none'} />
                          ) : (
                            <div className="reviewer-avatar-placeholder">
                              {review.author?.charAt(0)?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="reviewer-name">{review.author}</p>
                            <p className="review-date">{date}</p>
                          </div>
                        </div>
                        {reviewRating && (
                          <div className="review-rating-chip">⭐ {(reviewRating / 2).toFixed(1)}</div>
                        )}
                      </div>
                      <p className="review-content">{content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── TRAILER MODAL ── */}
      {showTrailer && trailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-left">
          <span className="footer-brand">Lumino.</span>
          <span className="footer-email">
            <a href="mailto:findurgigs.lumino@gmail.com">findurgigs.lumino@gmail.com</a>
          </span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Lumino. All rights reserved.</p>
      </footer>
    </div>
  );
}