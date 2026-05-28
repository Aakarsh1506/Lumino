import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ── API KEYS ──
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const APIFY_TOKEN = import.meta.env.VITE_APIFY_TOKEN;
const APIFY_ACTOR_ID = import.meta.env.VITE_APIFY_ACTOR_ID;

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const categories = [
  { icon: "🎵", name: "Concerts" },
  { icon: "🎤", name: "Standup Comedy" },
  { icon: "🎬", name: "Movies" },
  { icon: "🎭", name: "Theatre & Plays" },
  { icon: "🎪", name: "Festivals" },
  { icon: "🎸", name: "Open Mic" },
  { icon: "🕺", name: "Club Nights" },
  { icon: "🎨", name: "Art & Exhibitions" },
  { icon: "🏟️", name: "Sports Events" },
  { icon: "🎧", name: "DJ Nights" },
];

function getGreeting(name) {
  const hour = new Date().getHours();
  let period = "Morning";
  if (hour >= 12 && hour < 17) period = "Afternoon";
  else if (hour >= 17) period = "Evening";
  return `Good ${period}, ${name}.`;
}

// ── MOVIE CARD (TMDB) ──
function MovieCard({ movie }) {
  const posterUrl = movie.poster_path ? `${TMDB_IMG}${movie.poster_path}` : null;
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : null;
  const votes = movie.vote_count
    ? movie.vote_count >= 1000
      ? `${(movie.vote_count / 1000).toFixed(1)}K+`
      : `${movie.vote_count}`
    : null;
  const genres = movie.genre_names?.join(" / ") || movie.original_language?.toUpperCase() || "";

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="poster-img" />
        ) : (
          <div className="poster-placeholder">🎬</div>
        )}
        <div className="movie-meta-overlay">
          {rating && votes && (
            <span className="movie-rating">⭐ {rating}/5 &nbsp; {votes} Votes</span>
          )}
        </div>
      </div>
      <div className="movie-info">
        <p className="movie-title">{movie.title}</p>
        <p className="movie-genre">{genres}</p>
      </div>
    </div>
  );
}

// ── EVENT CARD (EVENTBRITE) ──
function EventCard({ event }) {
  const imageUrl = event.logo?.url || null;
  const venue = event.venue?.name || "";
  const city = event.venue?.address?.city || "";
  const date = event.start?.local
    ? new Date(event.start.local).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "";
  const subLabel = [city, date].filter(Boolean).join(" · ");

  return (
    <div className="movie-card">
      <div className="movie-poster">
        {imageUrl ? (
          <img src={imageUrl} alt={event.name?.text} className="poster-img" />
        ) : (
          <div className="poster-placeholder">🎫</div>
        )}
        {date && <div className="event-date-badge">{date}</div>}
        {venue && (
          <div className="movie-meta-overlay">
            <span className="movie-rating">📍 {venue}</span>
          </div>
        )}
      </div>
      <div className="movie-info">
        <p className="movie-title">{event.name?.text}</p>
        <p className="movie-genre">{subLabel}</p>
      </div>
    </div>
  );
}

// ── SKELETON LOADER ──
function SkeletonRow() {
  return (
    <div className="movies-row">
      {[...Array(4)].map((_, i) => (
        <div className="movie-card" key={i}>
          <div className="skeleton-poster" />
          <div className="movie-info">
            <div className="skeleton-line long" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── ERROR STATE ──
function RowError({ message }) {
  return (
    <div className="row-error">
      <span>⚠ {message}</span>
    </div>
  );
}

// ── PAGINATED ROW ──
function PaginatedRow({ items, renderCard }) {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.ceil(items.length / perPage);
  const visible = items.slice(page * perPage, page * perPage + perPage);

  return (
    <div className="paginated-row-wrapper">
      <div className="movies-row">
        {visible.map((item, i) => renderCard(item, i))}
        {/* fill empty slots so layout doesn't jump */}
        {visible.length < perPage &&
          [...Array(perPage - visible.length)].map((_, i) => (
            <div className="movie-card invisible" key={`empty-${i}`} />
          ))}
      </div>
      {totalPages > 1 && (
        <div className="row-pagination">
          <button
            className="page-arrow"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label="Previous"
          >
            ‹
          </button>
          <span className="page-indicator">
            {page + 1} / {totalPages}
          </span>
          <button
            className="page-arrow"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            aria-label="Next"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState(null);

  const [standup, setStandup] = useState([]);
  const [standupLoading, setStandupLoading] = useState(true);
  const [standupError, setStandupError] = useState(null);

  const [concerts, setConcerts] = useState([]);
  const [concertsLoading, setConcertsLoading] = useState(true);
  const [concertsError, setConcertsError] = useState(null);

  const [theatre, setTheatre] = useState([]);
  const [theatreLoading, setTheatreLoading] = useState(true);
  const [theatreError, setTheatreError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.user || { username: "there" };
  const displayName = user.username.charAt(0).toUpperCase() + user.username.slice(1);
  const greeting = getGreeting(displayName);

  // ── SEARCH FILTER ──
  const q = searchQuery.toLowerCase().trim();

  const filteredMovies = movies.filter(
    (m) =>
      m.title?.toLowerCase().includes(q) ||
      m.genre_names?.some((g) => g.toLowerCase().includes(q))
  );

  const filteredStandup = standup.filter(
    (e) =>
      e.name?.text?.toLowerCase().includes(q) ||
      e.venue?.address?.city?.toLowerCase().includes(q)
  );

  const filteredConcerts = concerts.filter(
    (e) =>
      e.name?.text?.toLowerCase().includes(q) ||
      e.venue?.address?.city?.toLowerCase().includes(q)
  );

  const filteredTheatre = theatre.filter(
    (e) =>
      e.name?.text?.toLowerCase().includes(q) ||
      e.venue?.address?.city?.toLowerCase().includes(q)
  );

  // ── SMART NAVBAR SCROLL ──
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // blur background on scroll
      setScrolled(currentScrollY > 10);

      // always show navbar near top
      if (currentScrollY < 80) {
        setShowNavbar(true);
      }
      // scrolling down → hide navbar
      else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      }
      // scrolling up → show navbar
      else {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
  }, []);

  // ── FETCH MOVIES (TMDB) ──
  useEffect(() => {
    const genreMap = {
      28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
      80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror",
      10402: "Musical", 10749: "Romance", 878: "Sci-Fi",
      53: "Thriller", 10752: "War", 37: "Western",
      99: "Documentary", 9648: "Mystery", 36: "History",
    };

    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&region=IN&page=1`
    )
      .then((res) => {
        if (!res.ok) throw new Error("TMDB fetch failed");
        return res.json();
      })
      .then((data) => {
        const enriched = data.results.map((m) => ({
          ...m,
          genre_names: m.genre_ids.map((id) => genreMap[id]).filter(Boolean).slice(0, 3),
        }));
        setMovies(enriched);
        setMoviesLoading(false);
      })
      .catch(() => {
        setMoviesError("Couldn't load movies. Check your TMDB API key.");
        setMoviesLoading(false);
      });
  }, []);

 const fetchEBEvents = (keyword, setter, setLoading, setError) => {
  const url = `https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      search: keyword,
      location: "Mumbai",
      maxResults: 20,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Apify fetch failed");
      return res.json();
    })
    .then((data) => {
      setter(data || []);
      setLoading(false);
    })
    .catch(() => {
      setError("Couldn't load events. Check your Apify setup.");
      setLoading(false);
    });
};

  useEffect(() => {
    fetchEBEvents("standup comedy", setStandup, setStandupLoading, setStandupError);
  }, []);

  useEffect(() => {
    fetchEBEvents("concert music", setConcerts, setConcertsLoading, setConcertsError);
  }, []);

  useEffect(() => {
    fetchEBEvents("theatre acting play", setTheatre, setTheatreLoading, setTheatreError);
  }, []);

  return (
    <div className="dashboard-page">

      {/* ── NAVBAR ── */}
      <nav
        className={`dash-navbar ${scrolled ? "scrolled" : ""} ${
          showNavbar ? "nav-visible" : "nav-hidden"
        }`}
      >
        <span
          className="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ cursor: "pointer" }}
        >
          Lumino.
        </span>

        {/* ── SEARCH BAR ── */}
        <div className={`nav-search-wrapper ${searchFocused ? "focused" : ""}`}>
          <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search movies, shows, concerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>
          )}
        </div>

        <div className="nav-right-group">
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button className="nav-link">Categories ▾</button>
            <div className={`dropdown-menu ${categoryOpen ? "open" : ""}`}>
              <div className="dropdown-inner">
                <a href="#">🎵 Concerts</a>
                <a href="#">🎤 Standup Comedy</a>
                <a href="#">🎬 Movies</a>
                <a href="#">🎭 Theatre &amp; Plays</a>
                <a href="#">🎪 Festivals</a>
                <a href="#">🎸 Open Mic</a>
                <a href="#">🕺 Club Nights</a>
                <a href="#">🎨 Art &amp; Exhibitions</a>
                <a href="#">🏟️ Sports Events</a>
                <a href="#">🎧 DJ Nights</a>
              </div>
            </div>
          </div>

          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setCityOpen(true)}
            onMouseLeave={() => setCityOpen(false)}
          >
            <button className="nav-link">City ▾</button>
            <div className={`dropdown-menu ${cityOpen ? "open" : ""}`}>
              <div className="dropdown-inner">
                <a href="#">📍 Mumbai</a>
                <a href="#">📍 Delhi</a>
                <a href="#">📍 Bangalore</a>
                <a href="#">📍 Hyderabad</a>
                <a href="#">📍 Chennai</a>
                <a href="#">📍 Pune</a>
                <a href="#">📍 Kolkata</a>
                <a href="#">📍 Ahmedabad</a>
                <a href="#">📍 Jaipur</a>
                <a href="#">📍 Goa</a>
              </div>
            </div>
          </div>

          <div className="nav-divider" />
          <button className="btn btn-outline" onClick={() => navigate("/auth")}>
            Log Out
          </button>
        </div>
      </nav>

      {/* ── GREETING ── */}
      <section className="dash-greeting">
        <h1 className="greeting-text">{greeting}</h1>
        <p className="greeting-sub">
          Here&apos;s what&apos;s happening in your city tonight.
        </p>
      </section>

      {/* ── MOVIES ── */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Now Showing</h2>
          <button className="see-all-btn">See All ›</button>
        </div>
        {moviesLoading ? (
          <SkeletonRow />
        ) : moviesError ? (
          <RowError message={moviesError} />
        ) : filteredMovies.length === 0 ? (
          <RowError message="No movies match your search." />
        ) : (
          <PaginatedRow
            items={filteredMovies}
            renderCard={(movie) => <MovieCard key={movie.id} movie={movie} />}
          />
        )}
      </section>

      {/* ── STANDUP ── */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Standup Shows Near You</h2>
          <button className="see-all-btn">See All ›</button>
        </div>
        {standupLoading ? (
          <SkeletonRow />
        ) : standupError ? (
          <RowError message={standupError} />
        ) : filteredStandup.length === 0 ? (
          <RowError message="No standup shows match your search." />
        ) : (
          <PaginatedRow
            items={filteredStandup}
            renderCard={(event) => <EventCard key={event.id} event={event} />}
          />
        )}
      </section>

      {/* ── CONCERTS ── */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Concerts Happening</h2>
          <button className="see-all-btn">See All ›</button>
        </div>
        {concertsLoading ? (
          <SkeletonRow />
        ) : concertsError ? (
          <RowError message={concertsError} />
        ) : filteredConcerts.length === 0 ? (
          <RowError message="No concerts match your search." />
        ) : (
          <PaginatedRow
            items={filteredConcerts}
            renderCard={(event) => <EventCard key={event.id} event={event} />}
          />
        )}
      </section>

      {/* ── THEATRE ── */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Theatre &amp; Acting</h2>
          <button className="see-all-btn">See All ›</button>
        </div>
        {theatreLoading ? (
          <SkeletonRow />
        ) : theatreError ? (
          <RowError message={theatreError} />
        ) : filteredTheatre.length === 0 ? (
          <RowError message="No theatre shows match your search." />
        ) : (
          <PaginatedRow
            items={filteredTheatre}
            renderCard={(event) => <EventCard key={event.id} event={event} />}
          />
        )}
      </section>

      {/* ── BROWSE CATEGORIES ── */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="category-card"
              onClick={(e) => e.preventDefault()}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-left">
          <span className="footer-brand">Lumino.</span>
          <span className="footer-email">
            <a href="mailto:findurgigs.lumino@gmail.com">
              findurgigs.lumino@gmail.com
            </a>
          </span>
        </div>
        <div className="footer-socials">
          <span className="social-icon" title="Instagram (coming soon)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="social-icon" title="X (coming soon)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          </span>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Lumino. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
