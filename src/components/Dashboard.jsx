import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

// ── API KEYS ──
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
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

// ── MOVIE CARD ──
function MovieCard({ movie, user }) {
  const navigate = useNavigate();

  const posterUrl = movie.poster_path
    ? `${TMDB_IMG}${movie.poster_path}`
    : null;

  const rating = movie.vote_average
    ? (movie.vote_average / 2).toFixed(1)
    : null;

  const votes = movie.vote_count
    ? movie.vote_count >= 1000
      ? `${(movie.vote_count / 1000).toFixed(1)}K+`
      : `${movie.vote_count}`
    : null;

  const genres =
    movie.genre_names?.join(" / ") ||
    movie.original_language?.toUpperCase() ||
    "";

  return (
    <div
      className="movie-card"
      onClick={() =>
        navigate(`/movie/${movie.id}`, {
          state: { movie, user },
        })
      }
    >
      <div className="movie-poster">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="poster-img"
          />
        ) : (
          <div className="poster-placeholder">🎬</div>
        )}

        <div className="movie-meta-overlay">
          {rating && votes && (
            <span className="movie-rating">
              ⭐ {rating}/5 &nbsp; {votes} Votes
            </span>
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

// ── EVENT CARD ──
function EventCard({ event, user }) {
  const navigate = useNavigate();

  const date = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "";

  const subLabel = [event.city, date].filter(Boolean).join(" · ");

  // COMPLETE EVENT OBJECT
  const fullEvent = {
    ...event,
    title: event.name,
    rating: event.rating || "4.8",
    votes: event.votes || "12K+",
    category: event.category || "Live Event",
    language: event.language || "English",
    duration: event.duration || "2h",
    age: event.age || "16+",
    price: event.price || "₹999 onwards",
    description:
      event.description ||
      "Experience an unforgettable live event filled with entertainment, music, performances and amazing crowd energy.",
    tagline:
      event.tagline ||
      "One night. One stage. Unlimited memories.",
    venueDescription:
      event.venueDescription ||
      "This venue offers a premium live entertainment experience with excellent seating, sound, lighting and crowd facilities.",
    artists:
      event.artists || [
        {
          name: "Featured Artist",
          role: "Performer",
          image: event.image,
        },
      ],
  };

  return (
    <div
      className="movie-card"
      onClick={() =>
        navigate(`/event/${event.id}`, {
          state: {
            event: fullEvent,
            user,
          },
        })
      }
      style={{ cursor: "pointer" }}
    >
      <div className="movie-poster">
        {event.image ? (
          <img src={event.image} alt={event.name} className="poster-img" />
        ) : (
          <div className="poster-placeholder">🎫</div>
        )}

        {date && <div className="event-date-badge">{date}</div>}

        {event.venue && (
          <div className="movie-meta-overlay">
            <span className="movie-rating">
              📍 {event.venue}
            </span>
          </div>
        )}
      </div>

      <div className="movie-info">
        <p className="movie-title">{event.name}</p>
        <p className="movie-genre">{subLabel}</p>
      </div>
    </div>
  );
}

// ── SKELETON ──
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

// ── ERROR ──
function RowError({ message }) {
  return (
    <div className="row-error">
      <span>⚠ {message}</span>
    </div>
  );
}

// -─ PAGINATION ──
function PaginatedRow({ items, renderCard }) {
  const [page, setPage] = useState(0);

  const perPage = 4;

  const totalPages = Math.ceil(items.length / perPage);

  const start = page * perPage;

  const visibleItems = items.slice(start, start + perPage);

  return (
    <div className="paginated-row-wrapper">

      <div className="movies-row">

        {visibleItems.map((item, index) => (
          <div key={index}>
            {renderCard(item)}
          </div>
        ))}

      </div>

      {totalPages > 1 && (
        <div className="row-pagination">

          <button
            className="page-arrow"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            ‹
          </button>

          <span className="page-indicator">
            {page + 1} / {totalPages}
          </span>

          <button
            className="page-arrow"
            disabled={page === totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          >
            ›
          </button>

        </div>
      )}
    </div>
  );
}

// ── EVENT DATA ──
const STANDUP_EVENTS = [
  {
    id: 1,
    title: "Zakir Khan Live",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400&q=80",
    venue: "NCPA, Mumbai",
    city: "Mumbai",
    date: "2026-06-07",
    rating: "4.9",
    votes: "18K",
    category: "Standup Comedy",
    language: "Hindi",
    duration: "2h",
    age: "16+",
    price: "₹999 onwards",
    tagline: "Sakht Launda returns.",
    description: "An evening filled with relatable storytelling, humour and iconic Zakir Khan moments.",
    venueDescription: "NCPA Mumbai offers premium seating and a world-class live comedy experience.",
    artists: [
      {
        name: "Zakir Khan",
        role: "Comedian",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      },
    ],
  },

  {
    id: 2,
    title: "Comicstaan Auditions",
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&q=80",
    venue: "Canvas Laugh Club",
    city: "Mumbai",
    date: "2026-06-14",
    rating: "4.5",
    votes: "9K",
    category: "Standup Comedy",
    language: "English",
    duration: "3h",
    age: "18+",
    price: "₹499 onwards",
    tagline: "Find India's next comic star.",
    description: "Watch aspiring comedians perform their best material live on stage.",
    venueDescription: "Canvas Laugh Club is one of Mumbai's top comedy venues.",
    artists: [
      {
        name: "Various Comics",
        role: "Performers",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      },
    ],
  },
];

const CONCERT_EVENTS = [
  {
    id: 101,
    title: "Arijit Singh Live",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80",
    venue: "DY Patil Stadium",
    city: "Mumbai",
    date: "2026-06-08",
    rating: "4.9",
    votes: "52K",
    category: "Concert",
    language: "Hindi",
    duration: "4h",
    age: "All Ages",
    price: "₹2499 onwards",
    tagline: "An unforgettable musical night.",
    description: "Experience Arijit Singh performing his biggest hits live in Mumbai.",
    venueDescription: "DY Patil Stadium is one of India's largest concert venues.",
    artists: [
      {
        name: "Arijit Singh",
        role: "Singer",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
      },
    ],
  },
];

const THEATRE_EVENTS = [
  {
    id: 201,
    title: "Mughal-E-Azam: The Musical",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&q=80",
    venue: "NCPA",
    city: "Mumbai",
    date: "2026-06-09",
    rating: "4.8",
    votes: "11K",
    category: "Theatre",
    language: "Hindi",
    duration: "2h 30m",
    age: "10+",
    price: "₹1499 onwards",
    tagline: "The legendary story comes alive.",
    description: "A grand theatrical adaptation of the iconic Mughal-E-Azam.",
    venueDescription: "NCPA Theatre features immersive stage productions.",
    artists: [
      {
        name: "Theatre Ensemble",
        role: "Cast",
        image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80",
      },
    ],
  },
];

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

  const navigate = useNavigate();
  const location = useLocation();

  const user =
    location.state?.user || {
      username: "there",
    };

  const displayName =
    user.username.charAt(0).toUpperCase() +
    user.username.slice(1);

  const greeting = getGreeting(displayName);

  // ── SEARCH ──
  const q = searchQuery.toLowerCase().trim();

  const filteredMovies = movies.filter(
    (m) =>
      m.title?.toLowerCase().includes(q) ||
      m.genre_names?.some((g) =>
        g.toLowerCase().includes(q)
      )
  );

  const filteredStandup = STANDUP_EVENTS.filter(
    (e) =>
      e.title?.toLowerCase().includes(q) ||
      e.city?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q)
  );

  const filteredConcerts = CONCERT_EVENTS.filter(
    (e) =>
      e.title?.toLowerCase().includes(q) ||
      e.city?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q)
  );

  const filteredTheatre = THEATRE_EVENTS.filter(
    (e) =>
      e.title?.toLowerCase().includes(q) ||
      e.city?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q)
  );

  // ── NAVBAR SCROLL ──
  useEffect(() => {

    let lastScrollY = window.scrollY;

    const handleScroll = () => {

      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 10);

      if (currentScrollY < 80) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );

  }, []);

  // ── FETCH MOVIES ──
  useEffect(() => {

    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      18: "Drama",
      14: "Fantasy",
      27: "Horror",
      10402: "Musical",
      10749: "Romance",
      878: "Sci-Fi",
      53: "Thriller",
      10752: "War",
      37: "Western",
      99: "Documentary",
      9648: "Mystery",
      36: "History",
    };

    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&region=IN&page=1`
    )
      .then((res) => {
        if (!res.ok)
          throw new Error("TMDB fetch failed");

        return res.json();
      })

      .then((data) => {

        const enriched = data.results.map(
          (m) => ({
            ...m,
            genre_names: m.genre_ids
              .map((id) => genreMap[id])
              .filter(Boolean)
              .slice(0, 3),
          })
        );

        setMovies(enriched);
        setMoviesLoading(false);
      })

      .catch(() => {
        setMoviesError(
          "Couldn't load movies. Check your TMDB API key."
        );

        setMoviesLoading(false);
      });

  }, []);

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
      <nav
        className={`dash-navbar ${
          scrolled ? "scrolled" : ""
        } ${
          showNavbar
            ? "nav-visible"
            : "nav-hidden"
        }`}
      >

        <span
          className="nav-logo"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          style={{ cursor: "pointer" }}
        >
          Lumino.
        </span>

        {/* SEARCH */}
        <div
          className={`nav-search-wrapper ${
            searchFocused ? "focused" : ""
          }`}
        >

          <input
            type="text"
            className="nav-search-input"
            placeholder="Search movies, concerts, shows..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            onFocus={() =>
              setSearchFocused(true)
            }
            onBlur={() =>
              setSearchFocused(false)
            }
          />

          {searchQuery && (
            <button
              className="search-clear"
              onClick={() =>
                setSearchQuery("")
              }
            >
              ✕
            </button>
          )}
        </div>

        <div className="nav-right-group">

          <button
            className="btn btn-outline"
            onClick={() =>
              navigate("/auth")
            }
          >
            Log Out
          </button>

        </div>
      </nav>

      {/* GREETING */}
      <section className="dash-greeting">

        <h1 className="greeting-text">
          {greeting}
        </h1>

        <p className="greeting-sub">
          Here&apos;s what&apos;s happening
          in your city tonight.
        </p>

      </section>

      {/* MOVIES */}
      <section className="dash-section">

        <div className="section-header">
          <h2 className="section-title">
            Now Showing
          </h2>
        </div>

        {moviesLoading ? (
          <SkeletonRow />
        ) : moviesError ? (
          <RowError
            message={moviesError}
          />
        ) : (
          <PaginatedRow
            items={filteredMovies}
            renderCard={(movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                user={user}
              />
            )}
          />
        )}
      </section>

      {/* STANDUP */}
      <section className="dash-section">

        <div className="section-header">
          <h2 className="section-title">
            Standup Shows Near You
          </h2>
        </div>

        <PaginatedRow
          items={filteredStandup}
          renderCard={(event) => (
            <EventCard
              key={event.id}
              event={event}
              user={user}
            />
          )}
        />

      </section>

      {/* CONCERTS */}
      <section className="dash-section">

        <div className="section-header">
          <h2 className="section-title">
            Concerts Happening
          </h2>
        </div>

        <PaginatedRow
          items={filteredConcerts}
          renderCard={(event) => (
            <EventCard
              key={event.id}
              event={event}
              user={user}
            />
          )}
        />

      </section>

      {/* THEATRE */}
      <section className="dash-section">

        <div className="section-header">
          <h2 className="section-title">
            Theatre & Acting
          </h2>
        </div>

        <PaginatedRow
          items={filteredTheatre}
          renderCard={(event) => (
            <EventCard
              key={event.id}
              event={event}
              user={user}
            />
          )}
        />

      </section>

      {/* CATEGORIES */}
      <section className="dash-section">

        <div className="section-header">
          <h2 className="section-title">
            Browse by Category
          </h2>
        </div>

        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className="category-card"
            >
              <span className="category-icon">
                {cat.icon}
              </span>

              <span className="category-name">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

      </section>

      {/* FOOTER */}
      <footer>

        <div className="footer-left">

          <span className="footer-brand">
            Lumino.
          </span>

          <span className="footer-email">
            findurgigs.lumino@gmail.com
          </span>

        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} Lumino.
          All rights reserved.
        </p>

      </footer>
    </div>
  );
}