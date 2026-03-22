import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaCheckDouble, FaBars, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useSidebar } from "../context/SidebarContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
      <div className="navbar-left">
        {user && (
          <button className="hamburger-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        )}
        <Link to={user ? "/dashboard" : "/"} className="navbar-brand">
          <FaCheckDouble className="navbar-icon" />
          <h2 className="navbar-title">Taskflow</h2>
        </Link>
      </div>

      <div className="nav-buttons">
        {user && (
          <>
            <div className="nav-links">
              {location.pathname.includes("ai-planner") ? (
                <Link to="/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              ) : (
                <Link to="/ai-planner" className="navbar-link ai-planner-link">
                  ✨ AI Planner
                </Link>
              )}
            </div>

            <div className="user-menu-container" ref={dropdownRef}>
              <div
                className="user-profile-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="avatar">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="username-text">{user.username}</span>
                <FaChevronDown className={`dropdown-arrow ${showDropdown ? 'open' : ''}`} />
              </div>

              {showDropdown && (
                <div className="user-dropdown">
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
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
