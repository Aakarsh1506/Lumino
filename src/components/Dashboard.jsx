import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const categories = [
  { icon: "🎬", name: "Movies",           slug: "movies"          },
  { icon: "🎤", name: "Standup Comedy",   slug: "standup-comedy"  },
  { icon: "🎵", name: "Concerts",         slug: "concerts"        },
  { icon: "🎭", name: "Theatre & Acting", slug: "theatre"         },
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
        navigate(`/movie/${movie.id}`, { state: { movie, user } })
      }
    >
      <div className="movie-poster">
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className="poster-img" />
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

  const displayName = event.title || event.name || "";
  const subLabel = [event.city, date].filter(Boolean).join(" · ");

  const fullEvent = {
    ...event,
    title: displayName,
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
    tagline: event.tagline || "One night. One stage. Unlimited memories.",
    venueDescription:
      event.venueDescription ||
      "This venue offers a premium live entertainment experience with excellent seating, sound, lighting and crowd facilities.",
    artists:
      event.artists || [
        { name: "Featured Artist", role: "Performer", image: event.image },
      ],
  };

  return (
    <div
      className="movie-card"
      onClick={() =>
        navigate(`/event/${event.id}`, { state: { event: fullEvent, user } })
      }
      style={{ cursor: "pointer" }}
    >
      <div className="movie-poster">
        {event.image ? (
          <img src={event.image} alt={displayName} className="poster-img" />
        ) : (
          <div className="poster-placeholder">🎫</div>
        )}
        {date && <div className="event-date-badge">{date}</div>}
        {event.venue && (
          <div className="movie-meta-overlay">
            <span className="movie-rating">📍 {event.venue}</span>
          </div>
        )}
      </div>
      <div className="movie-info">
        <p className="movie-title">{displayName}</p>
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

// ── PAGINATION ──
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
          <div key={index}>{renderCard(item)}</div>
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
export const STANDUP_EVENTS = [
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
    artists: [{ name: "Zakir Khan", role: "Comedian", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" }],
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
    artists: [{ name: "Various Comics", role: "Performers", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" }],
  },
  {
    id: 3,
    title: "Biswa Kalyan Rath: Sushi",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80",
    venue: "Laugh Club, Andheri",
    city: "Mumbai",
    date: "2026-06-21",
    rating: "4.7",
    votes: "11K",
    category: "Standup Comedy",
    language: "English",
    duration: "1h 30m",
    age: "18+",
    price: "₹699 onwards",
    tagline: "Overthinking never looked this funny.",
    description: "Biswa Kalyan Rath brings his brand of intellectual comedy in a brand-new set.",
    venueDescription: "Laugh Club Andheri is a cozy venue perfect for intimate stand-up nights.",
    artists: [{ name: "Biswa Kalyan Rath", role: "Comedian", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" }],
  },
  {
    id: 4,
    title: "Kenny Sebastian Live",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&q=80",
    venue: "St. Andrews Auditorium",
    city: "Mumbai",
    date: "2026-06-28",
    rating: "4.8",
    votes: "14K",
    category: "Standup Comedy",
    language: "English",
    duration: "2h",
    age: "16+",
    price: "₹799 onwards",
    tagline: "Music, jokes and good vibes.",
    description: "Kenny Sebastian blends music with comedy for a one-of-a-kind live experience.",
    venueDescription: "St. Andrews Auditorium is a beloved Mumbai venue for intimate performances.",
    artists: [{ name: "Kenny Sebastian", role: "Comedian & Musician", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&q=80" }],
  },
  {
    id: 5,
    title: "Kanan Gill: Try Again",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80",
    venue: "Rangsharda Auditorium",
    city: "Mumbai",
    date: "2026-07-05",
    rating: "4.6",
    votes: "8K",
    category: "Standup Comedy",
    language: "English",
    duration: "1h 45m",
    age: "18+",
    price: "₹599 onwards",
    tagline: "Failing forward, one joke at a time.",
    description: "Kanan Gill's sharp wit and self-deprecating humour make for an unforgettable evening.",
    venueDescription: "Rangsharda Auditorium offers a spacious and comfortable comedy-watching experience.",
    artists: [{ name: "Kanan Gill", role: "Comedian", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80" }],
  },
  {
    id: 6,
    title: "Ladies Night Out: Comedy Edition",
    image: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=400&q=80",
    venue: "The Comedy Store",
    city: "Mumbai",
    date: "2026-07-12",
    rating: "4.4",
    votes: "6K",
    category: "Standup Comedy",
    language: "English / Hindi",
    duration: "2h",
    age: "18+",
    price: "₹449 onwards",
    tagline: "Women. Laughter. No filter.",
    description: "A night celebrating female voices in Indian comedy featuring top women comics.",
    venueDescription: "The Comedy Store Mumbai is the city's premier dedicated comedy venue.",
    artists: [{ name: "Various Comedians", role: "Performers", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80" }],
  },
];

export const CONCERT_EVENTS = [
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
    artists: [{ name: "Arijit Singh", role: "Singer", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" }],
  },
  {
    id: 102,
    title: "Nucleya Bass Rani Tour",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80",
    venue: "Mahalaxmi Racecourse",
    city: "Mumbai",
    date: "2026-06-15",
    rating: "4.7",
    votes: "21K",
    category: "Concert",
    language: "Instrumental",
    duration: "3h",
    age: "18+",
    price: "₹1499 onwards",
    tagline: "Bass so heavy it moves the earth.",
    description: "Nucleya returns with his signature bass-heavy electronic sound for a massive outdoor show.",
    venueDescription: "Mahalaxmi Racecourse transforms into a massive open-air festival ground.",
    artists: [{ name: "Nucleya", role: "DJ / Producer", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80" }],
  },
  {
    id: 103,
    title: "Shankar-Ehsaan-Loy Live",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    venue: "Jio World Garden",
    city: "Mumbai",
    date: "2026-06-22",
    rating: "4.8",
    votes: "31K",
    category: "Concert",
    language: "Hindi / English",
    duration: "3h 30m",
    age: "All Ages",
    price: "₹1999 onwards",
    tagline: "Three legends. One stage.",
    description: "India's iconic trio Shankar-Ehsaan-Loy perform their greatest hits spanning three decades.",
    venueDescription: "Jio World Garden is a world-class open-air venue in BKC Mumbai.",
    artists: [
      { name: "Shankar Mahadevan", role: "Vocalist", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
      { name: "Ehsaan Noorani", role: "Guitarist", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
      { name: "Loy Mendonsa", role: "Keyboardist", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&q=80" },
    ],
  },
  {
    id: 104,
    title: "Prateek Kuhad: In Tokens & Charms",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&q=80",
    venue: "Mehboob Studio",
    city: "Mumbai",
    date: "2026-06-29",
    rating: "4.8",
    votes: "16K",
    category: "Concert",
    language: "English / Hindi",
    duration: "2h",
    age: "All Ages",
    price: "₹1299 onwards",
    tagline: "Songs that feel like home.",
    description: "Prateek Kuhad performs his beloved indie catalogue in an intimate studio concert setting.",
    venueDescription: "Mehboob Studio offers an intimate and acoustically superb live music experience.",
    artists: [{ name: "Prateek Kuhad", role: "Singer-Songwriter", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80" }],
  },
  {
    id: 105,
    title: "When Chai Met Toast Live",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400&q=80",
    venue: "Blue Frog, Mumbai",
    city: "Mumbai",
    date: "2026-07-06",
    rating: "4.6",
    votes: "10K",
    category: "Concert",
    language: "English / Malayalam",
    duration: "2h",
    age: "All Ages",
    price: "₹899 onwards",
    tagline: "Feel good music for the soul.",
    description: "Kerala's beloved indie band brings their warm, uplifting sound to Mumbai.",
    venueDescription: "Blue Frog is one of Mumbai's most iconic live music venues.",
    artists: [{ name: "When Chai Met Toast", role: "Band", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80" }],
  },
  {
    id: 106,
    title: "AP Dhillon World Tour",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80",
    venue: "MMRDA Grounds, BKC",
    city: "Mumbai",
    date: "2026-07-13",
    rating: "4.9",
    votes: "44K",
    category: "Concert",
    language: "Punjabi / English",
    duration: "3h",
    age: "16+",
    price: "₹2999 onwards",
    tagline: "The world tour hits Mumbai.",
    description: "Global Punjabi pop sensation AP Dhillon brings his massive world tour to Mumbai.",
    venueDescription: "MMRDA Grounds BKC is Mumbai's premier open-air festival ground.",
    artists: [{ name: "AP Dhillon", role: "Singer", image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=200&q=80" }],
  },
];

export const THEATRE_EVENTS = [
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
    artists: [{ name: "Theatre Ensemble", role: "Cast", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&q=80" }],
  },
  {
    id: 202,
    title: "Hamlet: A Retelling",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
    venue: "Prithvi Theatre",
    city: "Mumbai",
    date: "2026-06-16",
    rating: "4.7",
    votes: "7K",
    category: "Theatre",
    language: "English",
    duration: "2h",
    age: "14+",
    price: "₹699 onwards",
    tagline: "To be or not to be — reimagined.",
    description: "A contemporary Indian retelling of Shakespeare's Hamlet set in a corporate empire.",
    venueDescription: "Prithvi Theatre is Mumbai's most storied and beloved theatrical space.",
    artists: [{ name: "Prithvi Rep Company", role: "Cast", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80" }],
  },
  {
    id: 203,
    title: "Tumhari Amrita",
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80",
    venue: "Tata Theatre, NCPA",
    city: "Mumbai",
    date: "2026-06-23",
    rating: "4.9",
    votes: "13K",
    category: "Theatre",
    language: "Hindi / Urdu",
    duration: "1h 45m",
    age: "12+",
    price: "₹999 onwards",
    tagline: "Letters that outlived everything.",
    description: "The timeless two-hander starring Shabana Azmi and Farooq Sheikh's most celebrated play.",
    venueDescription: "Tata Theatre at NCPA is the crown jewel of Mumbai's performing arts scene.",
    artists: [{ name: "Theatre Company", role: "Cast", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" }],
  },
  {
    id: 204,
    title: "Broken Images",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
    venue: "Experimental Theatre, NCPA",
    city: "Mumbai",
    date: "2026-06-30",
    rating: "4.6",
    votes: "5K",
    category: "Theatre",
    language: "English",
    duration: "1h 15m",
    age: "16+",
    price: "₹599 onwards",
    tagline: "One woman. Two voices. One truth.",
    description: "Girish Karnad's award-winning solo play performed by Arundhati Nag.",
    venueDescription: "Experimental Theatre NCPA hosts cutting-edge, intimate theatrical works.",
    artists: [{ name: "Arundhati Nag", role: "Performer", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&q=80" }],
  },
  {
    id: 205,
    title: "Wicked: The Musical",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80",
    venue: "Jamshed Bhabha Theatre",
    city: "Mumbai",
    date: "2026-07-07",
    rating: "4.9",
    votes: "29K",
    category: "Theatre",
    language: "English",
    duration: "2h 45m",
    age: "10+",
    price: "₹2499 onwards",
    tagline: "The untold story of the witches of Oz.",
    description: "Broadway's beloved musical Wicked makes its grand Mumbai debut.",
    venueDescription: "Jamshed Bhabha Theatre is NCPA's grandest and most technically advanced stage.",
    artists: [{ name: "International Cast", role: "Performers", image: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=200&q=80" }],
  },
  {
    id: 206,
    title: "Salesman Ramlal",
    image: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?w=400&q=80",
    venue: "Rangsharda Auditorium",
    city: "Mumbai",
    date: "2026-07-14",
    rating: "4.5",
    votes: "4K",
    category: "Theatre",
    language: "Hindi",
    duration: "1h 30m",
    age: "12+",
    price: "₹399 onwards",
    tagline: "Every man has a story to sell.",
    description: "A bittersweet Hindi adaptation of Death of a Salesman set in 1980s Mumbai.",
    venueDescription: "Rangsharda Auditorium is a well-loved venue for Hindi theatre in Mumbai.",
    artists: [{ name: "Mumbai Theatre Guild", role: "Cast", image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80" }],
  },
];

export default function Dashboard() {
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [moviesError, setMoviesError] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.user || { username: "there" };
  const displayName =
    user.username.charAt(0).toUpperCase() + user.username.slice(1);
  const greeting = getGreeting(displayName);

  const q = searchQuery.toLowerCase().trim();

  const filteredMovies = movies.filter(
    (m) =>
      m.title?.toLowerCase().includes(q) ||
      m.genre_names?.some((g) => g.toLowerCase().includes(q))
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

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (currentScrollY < 80) setShowNavbar(true);
      else if (currentScrollY > lastScrollY) setShowNavbar(false);
      else setShowNavbar(true);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const genreMap = {
      28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
      80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror",
      10402: "Musical", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller",
      10752: "War", 37: "Western", 99: "Documentary", 9648: "Mystery", 36: "History",
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

  const goToCategory = (slug) => {
    navigate(`/category/${slug}`, { state: { user } });
  };

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}
      <nav
        className={`dash-navbar ${scrolled ? "scrolled" : ""} ${showNavbar ? "nav-visible" : "nav-hidden"}`}
      >
        <span
          className="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ cursor: "pointer" }}
        >
          Lumino.
        </span>

        <div className={`nav-search-wrapper ${searchFocused ? "focused" : ""}`}>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search movies, concerts, shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>

        <div className="nav-right-group">
          {/* CATEGORIES DROPDOWN */}
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button className="nav-link">Categories ▾</button>
            <div className={`dropdown-menu ${categoryOpen ? "open" : ""}`}>
              <div className="dropdown-inner">
                {categories.map((cat) => (
                  <a
                    key={cat.slug}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToCategory(cat.slug);
                    }}
                  >
                    {cat.icon} {cat.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <button className="btn btn-outline" onClick={() => navigate("/auth")}>
            Log Out
          </button>
        </div>
      </nav>

      {/* GREETING */}
      <section className="dash-greeting">
        <h1 className="greeting-text">{greeting}</h1>
        <p className="greeting-sub">
          Here&apos;s what&apos;s happening in your city tonight.
        </p>
      </section>

      {/* MOVIES */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Now Showing</h2>
        </div>
        {moviesLoading ? (
          <SkeletonRow />
        ) : moviesError ? (
          <RowError message={moviesError} />
        ) : (
          <PaginatedRow
            items={filteredMovies}
            renderCard={(movie) => (
              <MovieCard key={movie.id} movie={movie} user={user} />
            )}
          />
        )}
      </section>

      {/* STANDUP */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Standup Shows Near You</h2>
        </div>
        <PaginatedRow
          items={filteredStandup}
          renderCard={(event) => (
            <EventCard key={event.id} event={event} user={user} />
          )}
        />
      </section>

      {/* CONCERTS */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Concerts Happening</h2>
        </div>
        <PaginatedRow
          items={filteredConcerts}
          renderCard={(event) => (
            <EventCard key={event.id} event={event} user={user} />
          )}
        />
      </section>

      {/* THEATRE */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Theatre & Acting</h2>
        </div>
        <PaginatedRow
          items={filteredTheatre}
          renderCard={(event) => (
            <EventCard key={event.id} event={event} user={user} />
          )}
        />
      </section>

      {/* CATEGORIES */}
      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className="category-card"
              onClick={() => goToCategory(cat.slug)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-left">
          <span className="footer-brand">Lumino.</span>
          <span className="footer-email">findurgigs.lumino@gmail.com</span>
        </div>
        <p className="footer-copy">
          © {new Date().getFullYear()} Lumino. All rights reserved.
        </p>
      </footer>
    </div>
  );
}