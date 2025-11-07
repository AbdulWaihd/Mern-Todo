import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaYoutube, FaReddit } from "react-icons/fa";
import "./Footer.css";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-brand">
          <h2> TodoApp</h2>
          <p>Organize your tasks. Boost your productivity.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div>
            <h4>Features</h4>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/teams">For Teams</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/templates">Templates</Link>
          </div>

          <div>
            <h4>Resources</h4>
            <a href="https://todoapp.help" target="_blank" rel="noopener noreferrer">Help Center</a>
            <a href="https://todoapp.docs" target="_blank" rel="noopener noreferrer">API Docs</a>
            <a href="https://todoapp.blog" target="_blank" rel="noopener noreferrer">Productivity Tips</a>
          </div>

          <div>
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/press">Press</Link>
            <Link to="/contact">Contact</Link>
          </div>

          {/* Socials */}
          <div className="footer-social">
            <a href="https://youtube.com" target="_blank"><FaYoutube /></a>
            <a href="https://linkedin.com" target="_blank"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank"><FaInstagram /></a>
            <a href="https://reddit.com" target="_blank"><FaReddit /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} TodoApp · All rights reserved.
      </div>
    </footer>
  );
}
