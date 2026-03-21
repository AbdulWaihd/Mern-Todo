import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaYoutube, FaReddit, FaCheckDouble } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Left Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <FaCheckDouble /> Taskflow
          </div>
          <p>Organize your tasks. Boost your productivity with our modern workspace interface.</p>
          <div className="footer-social">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://reddit.com" target="_blank" rel="noopener noreferrer"><FaReddit /></a>
          </div>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div>
            <h4>Features</h4>
            <Link to="#">Smart Filtering</Link>
            <Link to="#">Priority Badges</Link>
            <Link to="#">Due Dates</Link>
            <Link to="#">Real-time Sync</Link>
          </div>

          <div>
            <h4>Resources</h4>
            <Link to="#">Help Center</Link>
            <Link to="#">API Documentation</Link>
            <Link to="#">Productivity Blog</Link>
          </div>

          <div>
            <h4>Company</h4>
            <Link to="#">About Taskflow</Link>
            <Link to="#">Careers</Link>
            <Link to="#">Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Taskflow Workspace. All rights reserved. Built for modern productivity.
      </div>
    </footer>
  );
}
