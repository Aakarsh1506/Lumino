import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { STANDUP_EVENTS, CONCERT_EVENTS, THEATRE_EVENTS } from "./Dashboard";
import "./CategoryPage.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const CATEGORY_META = {
  movies: { label: "Movies", icon: "🎬" },
  "standup-comedy": { label: "Standup Comedy", icon: "🎤" },
  concerts: { label: "Concerts", icon: "🎵" },
  theatre: { label: "Theatre & Acting", icon: "🎭" },
};

// ── CARD COMPONENTS ──
function MovieCard({ movie, user }) {
  const navigate = useNavigate();
  const posterUrl = movie.poster_path
    ? `${TMDB_IMG}${movie.poster_path}`
    : null;

  return (
    <div
      className="cp-card"
      onClick={() =>
        navigate(`/movie/${movie.id}`, { state: { movie, user } })
      }
    >
      <div className="cp-poster">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="cp-poster-img" />
        ) : (
          <div className="cp-placeholder">🎬</div>
        )}
      </div>

      <div className="cp-info">
        <p className="cp-title">{movie.title}</p>
      </div>
    </div>
  );
}

function EventCard({ event, user }) {
  const navigate = useNavigate();
  const displayName = event.title || event.name || "";

  return (
    <div
      className="cp-card"
      onClick={() =>
        navigate(`/event/${event.id}`, { state: { event, user } })
      }
    >
      <div className="cp-poster">
        {event.image ? (
          <img src={event.image} alt={displayName} className="cp-poster-img" />
        ) : (
          <div className="cp-placeholder">🎫</div>
        )}
      </div>

      <div className="cp-info">
        <p className="cp-title">{displayName}</p>
      </div>
    </div>
  );
}

// ── MAIN PAGE ──
export default function CategoryPage() {
  const { slug } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state?.user || { username: "there" };

  const meta = CATEGORY_META[slug] || {
    label: "Events",
    icon: "🎫",
  };

  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);

  // ── FETCH MOVIES ──
  useEffect(() => {
    if (slug !== "movies") return;

    setMoviesLoading(true);

    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&region=IN&page=1`
    )
      .then((r) => r.json())
      .then((data) => {
        setMovies(data.results || []);
        setMoviesLoading(false);
      });
  }, [slug]);

  let items = [];
  if (slug === "movies") items = movies;
  else if (slug === "standup-comedy") items = STANDUP_EVENTS;
  else if (slug === "concerts") items = CONCERT_EVENTS;
  else if (slug === "theatre") items = THEATRE_EVENTS;

  // ── SEARCH FILTER ──
  const filteredItems = items.filter((item) =>
    (item.title || item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="cp-page">

      {/* NAVBAR */}
      <nav className="cp-navbar">

        {/* LEFT: LOGO */}
        <span
          className="cp-nav-logo"
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate("/dashboard", { state: { user } })
          }
        >
          Lumino.
        </span>

        {/* CENTER: SEARCH */}
        <div className="cp-nav-center">
          <input
            className="cp-search"
            type="text"
            placeholder={`Search ${meta.label.toLowerCase()}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* RIGHT: BUTTON */}
        <div className="cp-nav-right">
          <button
            className="cp-nav-btn"
            onClick={() =>
              navigate("/dashboard", { state: { user } })
            }
          >
            ← Dashboard
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <div className="cp-header">
        <span className="cp-header-icon">{meta.icon}</span>
        <h1 className="cp-header-title">{meta.label}</h1>
      </div>

      {/* GRID */}
      <div className="cp-body">
        <div className="cp-grid">
          {filteredItems.map((item, i) =>
            slug === "movies" ? (
              <MovieCard key={i} movie={item} user={user} />
            ) : (
              <EventCard key={i} event={item} user={user} />
            )
          )}
        </div>
      </div>

      {/* BOTTOM BUTTON */}
      <div className="cp-bottom">
        <button
          className="cp-bottom-btn"
          onClick={() =>
            navigate("/dashboard", { state: { user } })
          }
        >
          ← Back to Dashboard
        </button>
      </div>

    </div>
  );
}