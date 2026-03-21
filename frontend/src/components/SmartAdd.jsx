import { useState } from "react";
import { FaMagic, FaTimes, FaTrash, FaSave, FaSpinner, FaClock } from "react-icons/fa";

export default function SmartAdd({ user, BASE_URL, onTasksAdded, onClose }) {
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [goalTitle, setGoalTitle] = useState("");

  // Step 1: Send goal to AI and get subtasks
  const handleBreakdown = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/todos/ai-breakdown`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ goal, deadline, context }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to break down goal");
      }

      setSubtasks(data.subtasks);
      setGoalTitle(data.goal);
      setIsLoading(false);
    } catch (err) {
      console.error("Breakdown error:", err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Step 2: Remove a subtask from the preview
  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  // Step 3: Edit a subtask title inline
  const editSubtaskTitle = (index, newTitle) => {
    const updated = [...subtasks];
    updated[index].title = newTitle;
    setSubtasks(updated);
  };

  // Step 4: Save all subtasks as todos
  const handleSaveAll = async () => {
    if (subtasks.length === 0) return;
    setIsSaving(true);
    setError(null);

    try {
      const todosToCreate = subtasks.map((st) => ({
        title: st.title,
        description: st.description,
        priority: st.priority,
        dueDate: st.suggestedDeadline,
        goalTitle: goalTitle,
        estimatedTime: st.estimatedTime,
      }));

      const response = await fetch(`${BASE_URL}/api/todos/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ todos: todosToCreate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save tasks");
      }

      // Notify parent to refresh the todo list
      onTasksAdded(data);
      setIsSaving(false);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message);
      setIsSaving(false);
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
    <div className="smart-add-overlay">
      <div className="smart-add-modal">
        <div className="smart-add-header">
          <h3><FaMagic style={{ color: "#a855f7" }} /> Smart Add</h3>
          <button className="smart-add-close" onClick={onClose}><FaTimes /></button>
        </div>

        {/* Step 1: Input Form */}
        {subtasks.length === 0 && !isLoading && (
          <form onSubmit={handleBreakdown} className="smart-add-form">
            <div className="form-group">
              <label>🎯 What do you want to achieve?</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="E.g., Prepare for my OS exam"
                required
              />
            </div>

            <div className="form-group">
              <label>📅 When do you need this done by?</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>💡 Any extra details? (optional)</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="E.g., I have 5 days, beginner level, focus on practical topics"
                rows="2"
              />
            </div>

            <button type="submit" className="primary-btn smart-add-submit">
              <FaMagic style={{ marginRight: "6px" }} /> Break it down
            </button>
          </form>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="smart-add-loading">
            <FaSpinner className="spinner-icon" />
            <p>AI is breaking down your goal into actionable tasks...</p>
          </div>
        )}

        {/* Step 2: Preview Subtasks */}
        {subtasks.length > 0 && !isLoading && (
          <div className="smart-add-preview">
            <div className="smart-add-goal-badge">
              <span>🎯</span> {goalTitle}
            </div>

            <div className="smart-add-subtask-list">
              {subtasks.map((st, index) => (
                <div key={index} className="smart-add-subtask-item">
                  <div className="smart-add-subtask-main">
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => editSubtaskTitle(index, e.target.value)}
                      className="smart-add-subtask-title-input"
                    />
                    <button
                      className="smart-add-remove-btn"
                      onClick={() => removeSubtask(index)}
                      title="Remove subtask"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  {st.description && (
                    <p className="smart-add-subtask-desc">{st.description}</p>
                  )}
                  <div className="smart-add-subtask-meta">
                    <span className={`badge badge-${st.priority}`}>
                      {getPriorityEmoji(st.priority)} {st.priority}
                    </span>
                    <span className="smart-add-meta-item">
                      <FaClock /> {st.estimatedTime}
                    </span>
                    <span className="smart-add-meta-item">
                      📅 {st.suggestedDeadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="smart-add-actions">
              <button
                className="primary-btn"
                onClick={handleSaveAll}
                disabled={isSaving || subtasks.length === 0}
              >
                {isSaving ? (
                  <><FaSpinner className="spinner-icon" /> Saving...</>
                ) : (
                  <><FaSave style={{ marginRight: "6px" }} /> Save All ({subtasks.length} tasks)</>
                )}
              </button>
              <button className="secondary-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {error && <p className="auth-error" style={{ marginTop: "16px" }}>{error}</p>}
      </div>
    </div>
  );
}
