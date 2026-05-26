import { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import bgImage from '../assets/Landing Page Background 2 - Lumino.jpg'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [scrolledFull, setScrolledFull] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
      setScrolled(window.scrollY > heroHeight * 0.28);
      setScrolledFull(window.scrollY > heroHeight * 0.85);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <span className="nav-logo visible-initial">Lumino.</span>

        <div className="nav-right-group">
          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button className="nav-link">Categories ▾</button>
            <div className={`dropdown-menu ${categoryOpen ? "open" : ""}`}>
              <a href="#">Concerts</a>
              <a href="#">Standup Comedy</a>
              <a href="#">Movies</a>
              <a href="#">Theatre & Plays</a>
              <a href="#">Festivals</a>
              <a href="#">Open Mic</a>
              <a href="#">Club Nights</a>
              <a href="#">Art & Exhibitions</a>
              <a href="#">Sports Events</a>
              <a href="#">DJ Nights</a>
            </div>
          </div>

          <div
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setCityOpen(true)}
            onMouseLeave={() => setCityOpen(false)}
          >
            <button className="nav-link">City ▾</button>
            <div className={`dropdown-menu ${cityOpen ? "open" : ""}`}>
              <a href="#">Mumbai</a>
              <a href="#">Delhi</a>
              <a href="#">Bangalore</a>
              <a href="#">Hyderabad</a>
              <a href="#">Chennai</a>
              <a href="#">Pune</a>
              <a href="#">Kolkata</a>
              <a href="#">Ahmedabad</a>
              <a href="#">Jaipur</a>
              <a href="#">Goa</a>
            </div>
          </div>

          <div className="nav-divider" />
          <button className="btn btn-outline">Log In</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1 className={`hero-title ${scrolled ? "shrink" : ""}`}>Lumino.</h1>
          <p className={`hero-tagline ${scrolled ? "fade-out" : ""}`}>
            Your city&apos;s heartbeat, live.
          </p>
        </div>

        <div className={`hero-buttons ${scrolledFull ? "hidden" : ""}`}>
          <button className="btn btn-outline">Log In</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>

        <div className={`scroll-hint ${scrolled ? "hidden" : ""}`}>
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">
        <div className="content-placeholder">
          <h2>Find the gig that moves you.</h2>
          <p>
            From underground jazz sets to rooftop raves — Lumino surfaces every
            live experience happening near you, before it sells out.
          </p>
        </div>
      </main>

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
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </span>
          <span className="social-icon" title="X (coming soon)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
          </span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} Lumino. All rights reserved.</p>
      </footer>
    </>
  );
}