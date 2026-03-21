import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaMagic, FaSave, FaTimes, FaSpinner, FaChevronDown, FaChevronRight } from "react-icons/fa";
import SubtaskPreviewCard from "../components/SubtaskPreviewCard";
import TodoCard from "../components/TodoCard";

export default function AiPlanner({ BASE_URL }) {
  const { user } = useAuthContext();
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [context, setContext] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [goalTitle, setGoalTitle] = useState("");
  const [subtasks, setSubtasks] = useState([]);

  // For History
  const [savedTodos, setSavedTodos] = useState([]);
  const [collapsedGoals, setCollapsedGoals] = useState({});

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${BASE_URL}/api/todos`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // Specifically filter those that have a goalTitle for the history section
        setSavedTodos(data.filter((t) => t.goalTitle && t.isAIGenerated));
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleBreakdown = async (e) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/ai/breakdown`, {
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
      setGoal("");
      setDeadline("");
      setContext("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSubtask = (index) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSubtaskTitle = (index, newTitle) => {
    setSubtasks((prev) => {
      const updated = [...prev];
      updated[index].title = newTitle;
      return updated;
    });
  };

  const handleSaveAll = async () => {
    if (subtasks.length === 0 || !user) return;

    setIsSaving(true);
    setError(null);

    try {
      const todosToSave = subtasks.map((st) => ({
        title: st.title,
        description: st.description,
        priority: st.priority,
        dueDate: st.suggestedDeadline,
        goalTitle: goalTitle,
        estimatedTime: st.estimatedTime,
        isAIGenerated: true,
      }));

      const response = await fetch(`${BASE_URL}/api/todos/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ todos: todosToSave }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save tasks");

      setSubtasks([]);
      setGoalTitle("");
      fetchHistory(); // Refresh history immediately
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const cancelBreakdown = () => {
    setSubtasks([]);
    setGoalTitle("");
  };

  const toggleGoalCollapse = (title) => {
    setCollapsedGoals((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Group history
  const historyGrouped = {};
  savedTodos.forEach((todo) => {
    if (!historyGrouped[todo.goalTitle]) {
      historyGrouped[todo.goalTitle] = [];
    }
    historyGrouped[todo.goalTitle].push(todo);
  });

  return (
    <div className="home-layout">
      {/* LEFT COLUMN: Main Interaction */}
      <div className="main-content" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
        
        {/* TOP SECTION: Input Form */}
        <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <FaMagic style={{ color: "#a855f7" }} /> AI Smart Add
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            Tell our AI what you want to achieve, and it will break it down into actionable subtasks with estimated time and deadlines.
          </p>

          <form onSubmit={handleBreakdown} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div className="form-group" style={{ marginBottom: "0" }}>
              <label>What do you want to achieve?</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="E.g. Prepare for my OS exam, Build a portfolio website"
                required
                style={{ padding: "14px", fontSize: "1.1rem" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div className="form-group" style={{ marginBottom: "0" }}>
                <label>Target deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "0" }}>
                <label>Any extra context? (Optional)</label>
                <input
                  type="text"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="E.g. I have 5 days, I am a beginner"
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={isLoading || isSaving}
              style={{ marginTop: "10px", padding: "14px", fontSize: "1.1rem" }}
            >
              {isLoading ? (
                <><FaSpinner className="spinner-icon" /> AI is thinking...</>
              ) : (
                <><FaMagic style={{ marginRight: "8px" }} /> Break it down</>
              )}
            </button>
          </form>

          {error && <div style={{ marginTop: "15px", background: "rgba(239, 68, 68, 0.1)", color: "#f87171", padding: "12px", borderRadius: "8px" }}>{error}</div>}
        </div>

        {/* MIDDLE SECTION: Preview List */}
        {subtasks.length > 0 && !isLoading && (
          <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "30px", borderRadius: "16px", border: "1px solid rgba(168, 85, 247, 0.3)" }}>
            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              Here's your plan: <span style={{ color: "#a855f7", fontWeight: "normal" }}>"{goalTitle}"</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" }}>
              {subtasks.map((st, index) => (
                <SubtaskPreviewCard
                  key={index}
                  subtask={st}
                  index={index}
                  onRemove={removeSubtask}
                  onTitleChange={updateSubtaskTitle}
                />
              ))}
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button
                className="primary-btn"
                onClick={handleSaveAll}
                disabled={isSaving}
                style={{ flex: 1, padding: "14px", fontSize: "1.1rem", background: "#10b981" }}
              >
                {isSaving ? (
                  <><FaSpinner className="spinner-icon" /> Saving Tasks...</>
                ) : (
                  <><FaSave style={{ marginRight: "8px" }} /> Save All to My Todos</>
                )}
              </button>
              <button
                className="secondary-btn"
                onClick={cancelBreakdown}
                disabled={isSaving}
                style={{ padding: "14px 24px" }}
              >
                <FaTimes style={{ marginRight: "8px" }} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: History */}
      <div className="sidebar">
        <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "15px", marginBottom: "20px" }}>
          Saved AI Goals
        </h3>

        {Object.keys(historyGrouped).length === 0 ? (
          <div style={{ textAlign: "center", opacity: 0.5, padding: "20px 0" }}>
            <p>No AI plans saved yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {Object.keys(historyGrouped).map((title) => {
              const isCollapsed = collapsedGoals[title];
              const goalTodos = historyGrouped[title];
              const completedCount = goalTodos.filter((t) => t.completed).length;

              return (
                <div key={title} style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div
                    onClick={() => toggleGoalCollapse(title)}
                    style={{
                      padding: "15px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                      background: "rgba(168, 85, 247, 0.1)",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                      borderBottomLeftRadius: isCollapsed ? "8px" : "0",
                      borderBottomRightRadius: isCollapsed ? "8px" : "0",
                      transition: "0.2s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
                      {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                      <span style={{ fontSize: "0.95rem" }}>{title}</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: "12px", color: completedCount === goalTodos.length ? "#10b981" : "white" }}>
                      {completedCount}/{goalTodos.length} done
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {goalTodos.map((todo) => (
                        <div key={todo._id} style={{ opacity: todo.completed ? 0.5 : 1 }}>
                          <span style={{ textDecoration: todo.completed ? "line-through" : "none", fontSize: "0.9rem" }}>
                            • {todo.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
