
import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Home() {
    const [todos, setTodos] = useState([]);
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("priority");

    // Fetch all todos
    useEffect(() => {
        const fetchTodos = async () => {
            if (!user) return;

            setLoading(true);
            try {
                const response = await fetch("/api/todos", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (!response.ok) throw new Error("Unauthorized or Failed to fetch todos");

                const data = await response.json();
                setTodos(data);
            } catch (err) {
                setError(err.message);
            }
            setLoading(false);
        };

        fetchTodos();
    }, [user]);

    // Add a Todo
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in");
            return;
        }

        const title = e.target.title.value;
        const description = e.target.description.value;
        const priority = e.target.priority.value;
        const dueDate = e.target.dueDate.value; //  New — Deadline

        try {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ title, description, priority, dueDate }),
            });

            if (!response.ok) throw new Error("Failed to add todo");

            const newTodo = await response.json();
            setTodos([...todos, newTodo]);
            e.target.reset();
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete Todo
    const handleDelete = async (id) => {
        try {
            await fetch(`/api/todos/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setTodos(todos.filter((todo) => todo._id !== id));
        } catch (err) {
            console.error("Error deleting todo:", err);
        }
    };

    // Toggle Completed
    const handleToggleComplete = async (id, completed) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
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

const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === "deadline") {
        return new Date(a.dueDate) - new Date(b.dueDate); // earliest first
    }
    if (sortBy === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt); // newest first
    }
    return 0;
});

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="todo-container">
            {/* Left Side - Todo List */}
          <div className="todo-list">
    <h3>Your Todos</h3>

    {/* Sort Dropdown */}
    <label style={{ fontSize: "14px", marginRight: "10px" }}>Sort By:</label>
    <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        style={{ padding: "5px", marginBottom: "10px", borderRadius: "5px" }}
    >
        <option value="priority">Priority</option>
        <option value="deadline">Deadline</option>
        <option value="createdAt">Date Created</option>
    </select>

    {sortedTodos.length === 0 ? (
        <p>No todos found. Add one to get started!</p>
    ) : (
        <ul>
            {sortedTodos.map((todo) => (
                <li key={todo._id} className="todo-item">
                    <div>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleComplete(todo._id, todo.completed)}
                        />
                        <strong>{todo.title}</strong> - {todo.description || "No description"}
                        <span style={{ color: "gray", fontSize: "0.9rem" }}>
                            {" "} {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No Deadline"}
                        </span>
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(todo._id)}>
                        <FaTrash />
                    </button>
                </li>
            ))}
        </ul>
    )}
</div>


            {/* Right Side - Add Todo Form */}
            <div className="todo-form">
                <h3>Add New Todo</h3>
                <form onSubmit={handleSubmit}>
                    <label>Title:</label>
                    <input type="text" name="title" required />

                    <label>Description:</label>
                    <input type="text" name="description" />

                    <label>Priority:</label>
                    <select name="priority" defaultValue="medium">
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    {/*  NEW Deadline Field */}
                    <label>Deadline:</label>
                    <input type="date" name="dueDate" required />

                    <button type="submit">Add Todo</button>
                </form>
            </div>
        </div>
    );
}
