import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaCheckDouble } from "react-icons/fa";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  // Check if we should show the "Landing Page" style navbar
  const isPublicPage = ["/", "/login", "/signup", "/forgot-password"].includes(location.pathname);
  
  // Use public style if it's a public page AND user is NOT logged in
  const usePublicStyle = isPublicPage && !user;

  if (usePublicStyle) {
    return (
      <nav className={`navbar public-nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="navbar-brand">
          <FaCheckDouble className="navbar-icon public-icon" />
          <h2 className="navbar-title">Taskflow</h2>
        </Link>

        <div className="nav-buttons">
          <button className="login-btn ghost-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="signup-btn primary-btn-nav" onClick={() => navigate("/signup")}>
            Get Started
          </button>
        </div>
      </nav>
    );
  }

  // Private Navbar (Dashboard/AI Planner)
  return (
    <nav className="navbar private-nav">
      <Link to="/dashboard" className="navbar-brand">
        <FaCheckDouble className="navbar-icon" />
        <h2 className="navbar-title">Taskflow</h2>
      </Link>

      <div className="nav-buttons">
        {user && (
          <>
            <Link to="/ai-planner" className="navbar-link" style={{ marginRight: '15px', color: '#a855f7', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
              ✨ AI Planner
            </Link>
            <Link to="/dashboard" className="navbar-link" style={{ marginRight: '15px', color: '#6366f1', fontWeight: 'bold', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span className="welcome-text">
              <div className="avatar">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
              {user.username}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
        {!user && (
           <>
           <button className="login-btn" onClick={() => navigate("/login")}>
             Log In
           </button>
           <button className="signup-btn" onClick={() => navigate("/signup")}>
             Sign Up Free
           </button>
         </>
        )}
      </div>
    </nav>
  );
}
