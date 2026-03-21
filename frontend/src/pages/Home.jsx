import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import TodoCard from "../components/TodoCard";
import { FaPlus, FaSave, FaTimes, FaFilePdf, FaRobot, FaMagic, FaChevronDown, FaChevronRight, FaEdit } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAiSorting, setIsAiSorting] = useState(false);
  const [collapsedGoals, setCollapsedGoals] = useState({});

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
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", priority: "medium", dueDate: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    try {
      if (editingId) {
        // Edit Todo Setup
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
        // Add Todo Setup
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
        cancelEdit(); // Clears form
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
    if (filterMode === "pending") return !t.completed;
    if (filterMode === "completed") return t.completed;
    return true; // "all"
  });

  const handleAiSort = async () => {
    if (!user) return;
    setIsAiSorting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/todos/ai-sort`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        // Send only pending tasks for AI to rank, or all? Let's send pending tasks so they get priority output.
        body: JSON.stringify({ todos: todos.filter(t => !t.completed) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to sort tasks via AI");

      const completedTasks = todos.filter(t => t.completed);
      setTodos([...data, ...completedTasks]);
      setSortBy('ai');
    } catch (err) {
      setError(err.message);
    }
    setIsAiSorting(false);
  };

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "ai") return 0; // Maintain custom AI order mapping
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === "deadline") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Separate todos into goal-grouped and standalone
  const goalGrouped = {};
  const standaloneTodos = [];

  sortedTodos.forEach((todo) => {
    if (todo.goalTitle) {
      if (!goalGrouped[todo.goalTitle]) {
        goalGrouped[todo.goalTitle] = [];
      }
      goalGrouped[todo.goalTitle].push(todo);
    } else {
      standaloneTodos.push(todo);
    }
  });

  const toggleGoalCollapse = (goalTitle) => {
    setCollapsedGoals(prev => ({ ...prev, [goalTitle]: !prev[goalTitle] }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Todo Tasks", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Status", "Task Title", "Priority", "Deadline"];
    const tableRows = [];

    sortedTodos.forEach(todo => {
      const statusCheckbox = todo.completed ? "[ x ]" : "[   ]";
      const priorityStr = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);
      const deadlineStr = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No deadline";

      tableRows.push([
        statusCheckbox,
        todo.title,
        priorityStr,
        deadlineStr
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35 }
      }
    });

    doc.save("todo-tasks.pdf");
  };

  return (
    <div className="home-layout">
      {/* LEFT COLUMN: Main Content */}
      <div className="main-content">
        <div className="header-actions">
          <div className="title-section">
            <h3>My Tasks</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              {todos.filter(t => !t.completed).length} pending, {todos.filter(t => t.completed).length} completed
            </p>
          </div>

          <div className="filters">
            <button
              className="filter-btn"
              onClick={generatePDF}
              title="Download tasks as PDF"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', marginRight: '10px' }}
            >
              <FaFilePdf /> Export PDF
            </button>
            <button
              className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >All</button>
            <button
              className={`filter-btn ${filterMode === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterMode('pending')}
            >Pending</button>
            <button
              className={`filter-btn ${filterMode === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterMode('completed')}
            >Completed</button>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Newest First</option>
              <option value="priority">High Priority</option>
              <option value="deadline">Closest Deadline</option>
              <option value="ai">✨ AI Ordered</option>
            </select>
            <button
              className="filter-btn"
              onClick={handleAiSort}
              disabled={isAiSorting}
              title="Order Tasks Using AI"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)' }}
            >
              <FaRobot /> {isAiSorting ? "Loading..." : "AI Sort"}
            </button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px', borderRadius: '8px' }}>{error}</div>}
        {loading && <p style={{ color: '#94a3b8' }}>Loading your tasks...</p>}

        <div className="todo-list-grid">
          {!loading && sortedTodos.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🚀</span>
              <p>Nothing to do yet! Add a task to get started.</p>
            </div>
          ) : (
            <>
              {/* Goal-Grouped Todos */}
              {Object.keys(goalGrouped).map((goalTitle) => {
                const isCollapsed = collapsedGoals[goalTitle];
                const goalTodos = goalGrouped[goalTitle];
                const completedCount = goalTodos.filter(t => t.completed).length;

                return (
                  <div key={goalTitle} className="goal-group">
                    <div
                      className="goal-group-header"
                      onClick={() => toggleGoalCollapse(goalTitle)}
                    >
                      <div className="goal-group-title">
                        {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                        <FaMagic style={{ color: '#a855f7', fontSize: '0.85rem' }} />
                        <span>{goalTitle}</span>
                      </div>
                      <div className="goal-group-badge">
                        {completedCount}/{goalTodos.length} done
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div className="goal-group-tasks">
                        {goalTodos.map((todo) => (
                          <TodoCard
                            key={todo._id}
                            todo={todo}
                            onDelete={handleDelete}
                            onToggle={handleToggleComplete}
                            onEditClick={handleEditClick}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Standalone Todos */}
              {standaloneTodos.map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onDelete={handleDelete}
                  onToggle={handleToggleComplete}
                  onEditClick={handleEditClick}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar Form */}
      <div className="sidebar">
        <h3>
          {editingId ? <><FaEdit style={{ color: '#6366f1' }} /> Edit Task</> : <><FaPlus style={{ color: '#a855f7' }} /> Add New Task</>}
        </h3>
        <form className="todo-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="E.g., Complete project presentation"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Details about the task..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleInputChange}>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deadline *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            {editingId ? <><FaSave style={{ marginRight: '6px' }} /> Save Changes</> : "Add Task"}
          </button>

          {editingId && (
            <button type="button" className="secondary-btn" onClick={cancelEdit}>
              <FaTimes style={{ marginRight: '6px' }} /> Cancel Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}




export default function Home() {
  const [todos, setTodos] = useState([]);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAiSorting, setIsAiSorting] = useState(false);

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
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", priority: "medium", dueDate: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    try {
      if (editingId) {
        // Edit Todo Setup
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
        // Add Todo Setup
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
        cancelEdit(); // Clears form
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
    if (filterMode === "pending") return !t.completed;
    if (filterMode === "completed") return t.completed;
    return true; // "all"
  });

  const handleAiSort = async () => {
    if (!user) return;
    setIsAiSorting(true);
    try {
      const response = await fetch(`${BASE_URL}/api/todos/ai-sort`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        // Send only pending tasks for AI to rank, or all? Let's send pending tasks so they get priority output.
        body: JSON.stringify({ todos: todos.filter(t => !t.completed) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to sort tasks via AI");

      const completedTasks = todos.filter(t => t.completed);
      setTodos([...data, ...completedTasks]);
      setSortBy('ai');
    } catch (err) {
      setError(err.message);
    }
    setIsAiSorting(false);
  };

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "ai") return 0; // Maintain custom AI order mapping
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === "deadline") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Todo Tasks", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Status", "Task Title", "Priority", "Deadline"];
    const tableRows = [];

    sortedTodos.forEach(todo => {
      const statusCheckbox = todo.completed ? "[ x ]" : "[   ]";
      const priorityStr = todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1);
      const deadlineStr = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No deadline";

      tableRows.push([
        statusCheckbox,
        todo.title,
        priorityStr,
        deadlineStr
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35 }
      }
    });

    doc.save("todo-tasks.pdf");
  };

  return (
    <div className="home-layout">
      {/* LEFT COLUMN: Main Content */}
      <div className="main-content">
        <div className="header-actions">
          <div className="title-section">
            <h3>My Tasks</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              {todos.filter(t => !t.completed).length} pending, {todos.filter(t => t.completed).length} completed
            </p>
          </div>

          <div className="filters">
            <button
              className="filter-btn"
              onClick={generatePDF}
              title="Download tasks as PDF"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6366f1', background: 'rgba(99, 102, 241, 0.1)', marginRight: '10px' }}
            >
              <FaFilePdf /> Export PDF
            </button>
            <button
              className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >All</button>
            <button
              className={`filter-btn ${filterMode === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterMode('pending')}
            >Pending</button>
            <button
              className={`filter-btn ${filterMode === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterMode('completed')}
            >Completed</button>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Newest First</option>
              <option value="priority">High Priority</option>
              <option value="deadline">Closest Deadline</option>
              <option value="ai">✨ AI Ordered</option>
            </select>
            <button
              className="filter-btn"
              onClick={handleAiSort}
              disabled={isAiSorting}
              title="Order Tasks Using AI"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', background: 'rgba(168, 85, 247, 0.1)' }}
            >
              <FaRobot /> {isAiSorting ? "Loading..." : "AI Sort"}
            </button>
          </div>
        </div>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '12px', borderRadius: '8px' }}>{error}</div>}
        {loading && <p style={{ color: '#94a3b8' }}>Loading your tasks...</p>}

        <div className="todo-list-grid">
          {!loading && sortedTodos.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}>🚀</span>
              <p>Nothing to do yet! Add a task to get started.</p>
            </div>
          ) : (
            sortedTodos.map((todo) => (
              <TodoCard
                key={todo._id}
                todo={todo}
                onDelete={handleDelete}
                onToggle={handleToggleComplete}
                onEditClick={handleEditClick}
              />
            ))
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Sidebar Form */}
      <div className="sidebar">
        <h3>
          {editingId ? <><FaEdit style={{ color: '#6366f1' }} /> Edit Task</> : <><FaPlus style={{ color: '#a855f7' }} /> Add New Task</>}
        </h3>
        <form className="todo-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="E.g., Complete project presentation"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Details about the task..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={formData.priority} onChange={handleInputChange}>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>

          <div className="form-group">
            <label>Deadline *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            {editingId ? <><FaSave style={{ marginRight: '6px' }} /> Save Changes</> : "Add Task"}
          </button>

          {editingId && (
            <button type="button" className="secondary-btn" onClick={cancelEdit}>
              <FaTimes style={{ marginRight: '6px' }} /> Cancel Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
