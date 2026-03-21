import { FaTrash, FaClock, FaCalendarAlt } from "react-icons/fa";

export default function SubtaskPreviewCard({ subtask, index, onRemove, onTitleChange }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high": return "badge-high";
      case "medium": return "badge-medium";
      case "low": return "badge-low";
      default: return "badge-medium";
    }
  };

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case "high": return "🔴";
      case "medium": return "🟡";
      case "low": return "🟢";
      default: return "🟡";
    }
  };

  return (
    <div className="todo-card" style={{ background: "rgba(168, 85, 247, 0.05)", borderLeft: "4px solid #a855f7" }}>
      <div className="todo-content" style={{ width: "100%" }}>
        <div className="todo-header" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={subtask.title}
            onChange={(e) => onTitleChange(index, e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "1px dashed rgba(255,255,255,0.2)",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <span className={`badge ${getPriorityClass(subtask.priority)}`}>
            {getPriorityEmoji(subtask.priority)} {subtask.priority}
          </span>
          <button 
            className="action-btn delete-btn" 
            onClick={() => onRemove(index)}
            title="Remove subtask"
            style={{ marginLeft: "10px" }}
          >
            <FaTrash />
          </button>
        </div>

        {subtask.description && (
          <p className="todo-desc" style={{ marginTop: "8px", opacity: 0.8 }}>{subtask.description}</p>
        )}

        <div className="todo-meta" style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px" }}>
          {subtask.estimatedTime && (
            <div className="meta-item">
              <FaClock style={{ color: '#a855f7' }} />
              <span>Est: {subtask.estimatedTime}</span>
            </div>
          )}
          <div className="meta-item">
            <FaCalendarAlt style={{ color: '#6366f1' }} />
            <span>{subtask.suggestedDeadline ? new Date(subtask.suggestedDeadline).toLocaleDateString() : "No deadline"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
