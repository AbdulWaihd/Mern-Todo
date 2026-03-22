import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaUser, FaEnvelope, FaPaperPlane, FaCommentAlt } from "react-icons/fa";
import "./Contact.css"; // We'll create this for the glassmorphism and specific animations

export default function Contact() {
  const { user } = useAuthContext();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: user.username,
          email: user.email,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      setDescription("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-bg-glow"></div>
      
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>Have a question or feedback? We'd love to hear from you.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form-glass">
          {error && <div className="contact-error">{error}</div>}
          {success && (
            <div className="contact-success">
              🎉 Thank you! Your message has been sent successfully.
            </div>
          )}

          <div className="contact-input-group">
            <label><FaUser /> Name</label>
            <input 
              type="text" 
              value={user?.username || ""} 
              disabled 
              className="contact-input-disabled"
            />
          </div>

          <div className="contact-input-group">
            <label><FaEnvelope /> Email</label>
            <input 
              type="email" 
              value={user?.email || ""} 
              disabled 
              className="contact-input-disabled"
            />
          </div>

          <div className="contact-input-group">
            <label><FaCommentAlt /> How can we help?</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your query or feedback here..."
              required
              rows="5"
            />
          </div>

          <button 
            type="submit" 
            className="contact-submit-btn" 
            disabled={loading}
          >
            {loading ? "Sending..." : (
              <>
                <FaPaperPlane /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
