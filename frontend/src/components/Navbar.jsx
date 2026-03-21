import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaCheckDouble } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FaCheckDouble className="navbar-icon" />
        <h2 className="navbar-title">
          {user ? "Taskflow" : "Todo Workspace"}
        </h2>
      </Link>

      <div className="nav-buttons">
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

        {user && (
          <>
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
      </div>
    </nav>
  );
}
