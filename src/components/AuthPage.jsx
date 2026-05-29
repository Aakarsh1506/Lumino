import { useState, useRef } from "react";
import "./AuthPage.css";
import bgImage from '../assets/Login Page Background 2 - Lumino.png';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loginStatus, setLoginStatus] = useState({ msg: "", type: "" });
  const [signupStatus, setSignupStatus] = useState({ msg: "", type: "" });
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const loginPwTimer = useRef(null);
  const signupPwTimer = useRef(null);

  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    fullName: "", username: "", email: "", phone: "", password: ""
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const peekPassword = (type) => {
    if (type === "login") {
      if (!loginForm.password) return;
      setShowLoginPw(true);
      clearTimeout(loginPwTimer.current);
      loginPwTimer.current = setTimeout(() => setShowLoginPw(false), 1000);
    } else {
      if (!signupForm.password) return;
      setShowSignupPw(true);
      clearTimeout(signupPwTimer.current);
      signupPwTimer.current = setTimeout(() => setShowSignupPw(false), 1000);
    }
  };

  const handleLogin = async () => {
    const { identifier, password } = loginForm;

    if (!identifier || !password) {
      setLoginStatus({
        msg: "> ERROR: All fields are required.",
        type: "err",
      });
      return;
    }

    setLoginLoading(true);

    try {
      const response = await fetch(
        "https://lumino-backend-04ko.onrender.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginForm),
        }
      );

      const data = await response.json();

      setLoginLoading(false);

      if (data.success) {
        setLoginSuccess(true);
        setLoginStatus({
          msg: `> ${data.message}`,
          type: "ok",
        });
        setTimeout(() => {
          navigate("/dashboard", { state: { user: data.user } });
        }, 900);
      } else {
        setLoginStatus({
          msg: `> ERROR: ${data.message}`,
          type: "err",
        });
      }
    } catch (error) {
      console.error("FULL LOGIN ERROR:", error);
      setLoginLoading(false);
      setLoginStatus({
        msg: "> ERROR: Cannot connect to server.",
        type: "err",
      });
    }
  };

  const handleSignup = async () => {
    const { fullName, username, email, phone, password } = signupForm;

    if (!fullName || !username || !email || !phone || !password) {
      setSignupStatus({
        msg: "> ERROR: All fields are required.",
        type: "err",
      });
      return;
    }

    try {
      const response = await fetch(
        "https://lumino-backend-04ko.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signupForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSignupSuccess(true);
        setSignupStatus({
          msg: `> ${data.message}`,
          type: "ok",
        });
        setTimeout(() => {
          navigate("/dashboard", { state: { user: { username: signupForm.username } } });
        }, 900);
      } else {
        setSignupStatus({
          msg: `> ERROR: ${data.message}`,
          type: "err",
        });
      }
    } catch (error) {
      console.error("FULL SIGNUP ERROR:", error);
      setSignupStatus({
        msg: "> ERROR: Cannot connect to server.",
        type: "err",
      });
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setLoginStatus({ msg: "", type: "" });
    setSignupStatus({ msg: "", type: "" });
    setLoginSuccess(false);
    setSignupSuccess(false);
    setLoginLoading(false);
  };

  const EyeOpen = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOff = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div className="auth-page">
      <div className="auth-bg" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="auth-overlay" />

      <div
          className="auth-logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
      >
        Lumino.
      </div>

      <div className="auth-card">

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => switchMode("login")}>
            Log In
          </button>
          <button className={`auth-tab ${mode === "signup" ? "active" : ""}`} onClick={() => switchMode("signup")}>
            Sign Up
          </button>
        </div>

        {mode === "login" && (
          <div className="auth-form">
            <p className="auth-subtitle">Welcome back. Log in to continue.</p>

            <div className="field">
              <input
                type="text"
                name="identifier"
                id="identifier"
                placeholder=" "
                value={loginForm.identifier}
                onChange={handleLoginChange}
                autoComplete="off"
              />
              <label htmlFor="identifier">Username, Email or Phone</label>
            </div>

            <div className="field pw-field">
              <input
                type={showLoginPw ? "text" : "password"}
                name="password"
                id="login-password"
                placeholder=" "
                value={loginForm.password}
                onChange={handleLoginChange}
              />
              <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className={`eye-btn ${showLoginPw ? "peeking" : ""}`}
                onClick={() => peekPassword("login")}
              >
                {showLoginPw ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>

            {loginStatus.msg && (
              <p className={`auth-status ${loginStatus.type}`}>{loginStatus.msg}</p>
            )}

            <button
              className={`auth-submit-btn ${loginSuccess ? "success" : ""}`}
              onClick={handleLogin}
              disabled={loginLoading || loginSuccess}
            >
              {loginSuccess ? "ACCESS GRANTED" : loginLoading ? "AUTHENTICATING..." : "Log In"}
            </button>

            <p className="auth-switch">
              New to Lumino?{" "}
              <span onClick={() => switchMode("signup")}>Sign up here</span>
            </p>
          </div>
        )}

        {mode === "signup" && (
          <div className="auth-form">
            <p className="auth-subtitle">Create your account and find your next gig.</p>

            <div className="field">
              <input type="text" name="fullName" id="fullName" placeholder=" " value={signupForm.fullName} onChange={handleSignupChange} />
              <label htmlFor="fullName">Full Name</label>
            </div>

            <div className="field">
              <input type="text" name="username" id="username" placeholder=" " value={signupForm.username} onChange={handleSignupChange} />
              <label htmlFor="username">Username</label>
            </div>

            <div className="field">
              <input type="email" name="email" id="email" placeholder=" " value={signupForm.email} onChange={handleSignupChange} />
              <label htmlFor="email">Email ID</label>
            </div>

            <div className="field">
              <input type="tel" name="phone" id="phone" placeholder=" " value={signupForm.phone} onChange={handleSignupChange} />
              <label htmlFor="phone">Phone Number</label>
            </div>

            <div className="field pw-field">
              <input
                type={showSignupPw ? "text" : "password"}
                name="password"
                id="signup-password"
                placeholder=" "
                value={signupForm.password}
                onChange={handleSignupChange}
              />
              <label htmlFor="signup-password">Password</label>
              <button
                type="button"
                className={`eye-btn ${showSignupPw ? "peeking" : ""}`}
                onClick={() => peekPassword("signup")}
              >
                {showSignupPw ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>

            {signupStatus.msg && (
              <p className={`auth-status ${signupStatus.type}`}>{signupStatus.msg}</p>
            )}

            <button
              className={`auth-submit-btn ${signupSuccess ? "success" : ""}`}
              onClick={handleSignup}
              disabled={signupSuccess}
            >
              {signupSuccess ? "REGISTERED ✓" : "Sign Up"}
            </button>

            <p className="auth-switch">
              Already have an account?{" "}
              <span onClick={() => switchMode("login")}>Log in here</span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}