import { FaTrash, FaEdit, FaCalendarAlt, FaClock } from "react-icons/fa";

export default function TodoCard({ todo, onDelete, onToggle, onEditClick }) {
  const isCompleted = todo.completed;

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  return (
    <div className={`todo-card ${isCompleted ? "completed" : ""}`}>
      <div className="todo-checkbox-wrapper">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={isCompleted}
          onChange={() => onToggle(todo._id, todo.completed)}
        />
      </div>

      <div className="todo-content">
        <div className="todo-header">
          <span className="todo-title">{todo.title}</span>
          <span className={`badge ${getPriorityClass(todo.priority)}`}>
            {todo.priority}
          </span>
        </div>
        
        {todo.description && (
          <p className="todo-desc">{todo.description}</p>
        )}

        {todo.aiReason && (
          <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', fontStyle: 'italic' }}>
              <strong>AI Suggestion:</strong> {todo.aiReason}
            </p>
          </div>
        )}

        <div className="todo-meta">
          <div className="meta-item">
            <FaCalendarAlt style={{ color: '#6366f1' }} />
            <span>{formatDate(todo.dueDate)}</span>
          </div>
          <div className="meta-item">
            <FaClock style={{ color: '#a855f7' }} />
            <span>Created: {formatDate(todo.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="todo-actions">
        <button 
          className="action-btn edit-btn" 
          onClick={() => onEditClick(todo)}
          title="Edit Todo"
        >
          <FaEdit />
        </button>
        <button 
          className="action-btn delete-btn" 
          onClick={() => onDelete(todo._id)}
          title="Delete Todo"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}
