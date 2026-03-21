import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import TodoCard from "../components/TodoCard";
import { FaPlus, FaSave, FaTimes, FaFilePdf, FaMagic, FaChevronDown, FaChevronRight, FaEdit, FaInbox, FaRegCalendarCheck, FaCheckCircle, FaStar, FaSearch } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collapsedGoals, setCollapsedGoals] = useState({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sort & Filter state
  const [sortBy, setSortBy] = useState("createdAt");
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'pending', 'completed'

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });

  // Editing State
  const [editingId, setEditingId] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/todos`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) throw new Error("Unauthorized or failed to fetch todos");
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    fetchTodos();
  }, [user, BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (todo) => {
    setEditingId(todo._id);
    setFormData({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority || "medium",
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : ""
    });
    setShowTaskForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", priority: "medium", dueDate: "" });
    setShowTaskForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingId) {
        const response = await fetch(`${BASE_URL}/api/todos/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to edit todo");
        const updatedTodo = await response.json();
        setTodos(todos.map(t => t._id === editingId ? updatedTodo : t));
        cancelEdit();
      } else {
        const response = await fetch(`${BASE_URL}/api/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to add todo");
        const newTodo = await response.json();
        setTodos([...todos, newTodo]);
        cancelEdit();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`${BASE_URL}/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });
      const updatedTodo = await response.json();
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // Filter & Sort Logic
  const filteredTodos = todos.filter(t => {
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterMode === "pending") return !t.completed;
    if (filterMode === "completed") return t.completed;
    return true; 
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === "deadline") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Goal Grouping
  const goalGrouped = {};
  const standaloneTodos = [];
  sortedTodos.forEach((todo) => {
    if (todo.goalTitle) {
      if (!goalGrouped[todo.goalTitle]) goalGrouped[todo.goalTitle] = [];
      goalGrouped[todo.goalTitle].push(todo);
    } else standaloneTodos.push(todo);
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("Taskflow Productivity Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated for ${user.username} on ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Status", "Task", "Priority", "Deadline"];
    const tableRows = sortedTodos.map(todo => [
      todo.completed ? "Done" : "Pending",
      todo.title,
      todo.priority.toUpperCase(),
      todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "-"
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [124, 58, 237] }
    });
    doc.save("taskflow-report.pdf");
  };

  return (
    <div className="dashboard-wrapper">
      {/* LEFT SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-section">
          <p className="sidebar-label">Views</p>
          <button className={`sidebar-btn ${filterMode === 'all' ? 'active' : ''}`} onClick={() => setFilterMode('all')}>
            <FaInbox /> All Tasks
          </button>
          <button className={`sidebar-btn ${filterMode === 'pending' ? 'active' : ''}`} onClick={() => setFilterMode('pending')}>
            <FaRegCalendarCheck /> Pending
          </button>
          <button className={`sidebar-btn ${filterMode === 'completed' ? 'active' : ''}`} onClick={() => setFilterMode('completed')}>
            <FaCheckCircle /> Completed
          </button>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Smart Goals</p>
          {Object.keys(goalGrouped).map(goal => (
            <button key={goal} className="sidebar-goal-link" onClick={() => document.getElementById(goal)?.scrollIntoView({ behavior: 'smooth' })}>
              <FaMagic style={{ fontSize: '0.8rem', color: '#a855f7' }} /> {goal}
            </button>
          ))}
          {Object.keys(goalGrouped).length === 0 && <p className="sidebar-hint">No active AI goals.</p>}
        </div>
        
        <div className="sidebar-footer">
           <button className="export-btn-sidebar" onClick={generatePDF}>
             <FaFilePdf /> Export Report
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="dashboard-main">
        {/* TOP BAR */}
        <header className="dashboard-top-bar">
          <div className="search-box">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search your tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="top-bar-actions">
             <select className="sort-mini-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="createdAt">Date added</option>
                <option value="priority">Priority</option>
                <option value="deadline">Deadline</option>
             </select>
             <button className="add-task-btn-main" onClick={() => setShowTaskForm(true)}>
               <FaPlus /> Add Task
             </button>
          </div>
        </header>

        {/* TASK CONTENT */}
        <div className="task-container">
           {error && <div className="error-banner">{error}</div>}
           
           <div className="task-sections">
              {/* Standalone Section */}
              <div className="section-title-group">
                <h2>{filterMode === 'all' ? 'All Tasks' : filterMode.charAt(0).toUpperCase() + filterMode.slice(1)}</h2>
                <span>{sortedTodos.length} total</span>
              </div>

              {sortedTodos.length === 0 && !loading && (
                <div className="empty-dashboard">
                  <span style={{ fontSize: '3rem' }}>🧘</span>
                  <h3>You're all caught up!</h3>
                  <p>Enjoy your day or start a new ambitious goal.</p>
                </div>
              )}

              {/* Goal-Grouped Todos */}
              {Object.keys(goalGrouped).map((goalTitle) => (
                <div key={goalTitle} id={goalTitle} className="goal-group-v2">
                  <div className="goal-group-header-v2" onClick={() => setCollapsedGoals(prev => ({ ...prev, [goalTitle]: !prev[goalTitle] }))}>
                    <FaMagic /> <h3>{goalTitle}</h3>
                    <div className="goal-progress-pill">
                      {goalGrouped[goalTitle].filter(t => t.completed).length} / {goalGrouped[goalTitle].length}
                    </div>
                  </div>
                  {!collapsedGoals[goalTitle] && (
                    <div className="goal-group-tasks-v2">
                      {goalGrouped[goalTitle].map((todo) => (
                        <TodoCard key={todo._id} todo={todo} onDelete={handleDelete} onToggle={handleToggleComplete} onEditClick={handleEditClick} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Standalone Todos */}
              <div className="standalone-grid">
                {standaloneTodos.map((todo) => (
                  <TodoCard key={todo._id} todo={todo} onDelete={handleDelete} onToggle={handleToggleComplete} onEditClick={handleEditClick} />
                ))}
              </div>
           </div>
        </div>
      </main>

      {/* TASK FORM DRAWER / MODAL */}
      {showTaskForm && (
        <div className="task-form-overlay" onClick={cancelEdit}>
          <div className="task-form-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{editingId ? "Edit Task" : "Create New Task"}</h3>
              <button className="close-drawer" onClick={cancelEdit}><FaTimes /></button>
            </div>
            <form onSubmit={handleSubmit} className="drawer-form">
              <div className="form-group-v2">
                <label>Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required autoFocus />
              </div>
              <div className="form-group-v2">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" />
              </div>
              <div className="form-row-v2">
                <div className="form-group-v2">
                  <label>Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange}>
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
                <div className="form-group-v2">
                  <label>Deadline</label>
                  <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required />
                </div>
              </div>
              <button type="submit" className="save-task-btn">
                {editingId ? "Update Task" : "Add Task to Inbox"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
