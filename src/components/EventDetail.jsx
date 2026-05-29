import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./EventDetail.css";

function StarRating({ value }) {
  const stars = Math.round(value || 4);

  return (
    <div className="star-row">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`star ${s <= stars ? "filled" : ""}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function EventDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const event = state?.event;
  const user = state?.user;

  const [activeTab, setActiveTab] = useState("about");
  const [showTrailer, setShowTrailer] = useState(false);

  if (!event) {
    return (
      <div className="movie-detail-page">
        <div className="detail-error">
          <p>Event not found.</p>

          <button
            className="book-btn"
            onClick={() => navigate("/dashboard", { state: { user } })}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const artistCount = event.artists?.length || 0;

  return (
    <div className="movie-detail-page">

      {/* ── NAVBAR ── */}
      <nav className="detail-navbar">

        <button
          className="back-btn"
          onClick={() => navigate("/dashboard", { state: { user } })}
        >
          Back
        </button>

        <span
          className="nav-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ cursor: "pointer" }}
        >
          Lumino.
        </span>
      </nav>

      {/* ── HERO ── */}
      <div className="detail-hero">

        <div
          className="detail-backdrop"
          style={{ backgroundImage: `url(${event.image})` }}
        />

        <div className="detail-backdrop-overlay" />

        <div className="detail-hero-content">

          {/* ── POSTER ── */}
          <div className="detail-poster-wrap">

            <img
              src={event.image}
              alt={event.title}
              className="detail-poster"
            />

            {event.trailer && (
              <button
                className="trailer-btn"
                onClick={() => setShowTrailer(true)}
              >
                Watch Promo
              </button>
            )}

          </div>

          {/* ── INFO ── */}
          <div className="detail-hero-info">

            <h1 className="detail-title">{event.title}</h1>

            <div className="detail-rating-badge">
              <StarRating value={event.rating} />
              <span className="rating-number">
                {event.rating} / 5
              </span>
              <span className="rating-votes">
                {event.votes} interested
              </span>
            </div>

            <div className="detail-meta-row">
              <span className="detail-meta-item genres">
                {event.category}
              </span>
              <span className="meta-dot">·</span>
              <span className="detail-meta-item">
                {event.date}
              </span>
              <span className="meta-dot">·</span>
              <span className="detail-meta-item">
                {event.city}
              </span>
            </div>

            <div className="detail-tags">
              <span className="detail-tag">{event.language}</span>
              <span className="detail-tag">{event.duration}</span>
              <span className="detail-tag">{event.age}</span>
            </div>

            {/* ✅ FIXED BUTTON */}
            <button
              className="book-btn"
              onClick={() =>
                navigate("/book-event-tickets", {
                  state: {
                    event,
                    user,
                  },
                })
              }
            >
              Book Tickets
            </button>

          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="detail-tabs-bar">
        {["about", "artists", "venue"].map((tab) => (
          <button
            key={tab}
            className={`detail-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "about"
              ? "About"
              : tab === "artists"
              ? "Artists"
              : "Venue"}
          </button>
        ))}
      </div>

      {/* ── BODY (UNCHANGED) ── */}
      <div className="detail-body">

        {/* ABOUT */}
        {activeTab === "about" && (
          <div className="tab-panel about-panel">
            <div className="about-grid">

              <div className="about-main">
                <h2 className="panel-heading">About the event</h2>
                <p className="about-overview">{event.description}</p>

                {event.tagline && (
                  <blockquote className="movie-tagline">
                    "{event.tagline}"
                  </blockquote>
                )}
              </div>

              <div className="about-sidebar">
                <div className="sidebar-row">
                  <span className="sidebar-label">Event Type</span>
                  <span className="sidebar-value">{event.category}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">Date</span>
                  <span className="sidebar-value">{event.date}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">Venue</span>
                  <span className="sidebar-value">{event.venue}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">City</span>
                  <span className="sidebar-value">{event.city}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">Duration</span>
                  <span className="sidebar-value">{event.duration}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">Language</span>
                  <span className="sidebar-value">{event.language}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">Age Restriction</span>
                  <span className="sidebar-value">{event.age}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">Starting Price</span>
                  <span className="sidebar-value">{event.price}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ARTISTS */}
        {activeTab === "artists" && (
          <div className="tab-panel cast-panel">

            <h2 className="panel-heading">
              {event.category === "Concert"
                ? "Performing Artists"
                : event.category === "Standup Comedy"
                ? "Comedians"
                : "Cast & Crew"}
            </h2>

            {artistCount === 0 ? (
              <p className="no-data">Artist information unavailable.</p>
            ) : (
              <div className="cast-grid">
                {event.artists.map((artist, index) => (
                  <div key={index} className="cast-card">

                    <div className="cast-avatar-wrap">
                      {artist.image ? (
                        <img src={artist.image} alt={artist.name} className="cast-avatar" />
                      ) : (
                        <div className="cast-avatar-placeholder">
                          {artist.name?.charAt(0)}
                        </div>
                      )}
                    </div>

                    <p className="cast-name">{artist.name}</p>
                    <p className="cast-role">{artist.role}</p>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VENUE */}
        {activeTab === "venue" && (
          <div className="tab-panel">

            <h2 className="panel-heading">Venue Details</h2>

            <div className="about-grid">

              <div>
                <p className="about-overview">{event.venueDescription}</p>

                <blockquote className="movie-tagline">
                  Experience the vibe live at {event.venue}.
                </blockquote>
              </div>

              <div className="about-sidebar">

                <div className="sidebar-row">
                  <span className="sidebar-label">Venue</span>
                  <span className="sidebar-value">{event.venue}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">City</span>
                  <span className="sidebar-value">{event.city}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">Event Date</span>
                  <span className="sidebar-value">{event.date}</span>
                </div>

                <div className="sidebar-row">
                  <span className="sidebar-label">Ticket Price</span>
                  <span className="sidebar-value">{event.price}</span>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ── TRAILER ── */}
      {showTrailer && event.trailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="trailer-close"
              onClick={() => setShowTrailer(false)}
            >
              ✕
            </button>

            <iframe
              width="100%"
              height="100%"
              src={event.trailer}
              title="Event Promo"
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
            <a href="mailto:findurgigs.lumino@gmail.com">
              findurgigs.lumino@gmail.com
            </a>
          </span>
        </div>

        <p className="footer-copy">
          © {new Date().getFullYear()} Lumino. All rights reserved.
        </p>
      </footer>

    </div>
  );
}