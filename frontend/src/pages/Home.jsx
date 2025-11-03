import { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useAuthContext } from "../hooks/useAuthContext";  

export default function Home() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useAuthContext(); //  Access logged-in user + token

    //  Fetch all todos 
    useEffect(() => {
        const fetchTodos = async () => {
            if (!user) return; // If no user, don’t fetch

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

    //  Add a Todo
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError("You must be logged in");
            return;
        }

        const title = e.target.title.value;
        const description = e.target.description.value;
        const priority = e.target.priority.value;

        try {
            const response = await fetch("/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ title, description, priority }),
            });

            if (!response.ok) throw new Error("Failed to add todo");

            const newTodo = await response.json();
            setTodos([...todos, newTodo]);
            e.target.reset();
        } catch (err) {
            setError(err.message);
        }
    };

    // Delete a Todo
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

    //  Toggle Completed
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

    //  Sort Todos by Priority
    const sortedTodos = [...todos].sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

    return (
        <div className="todo-container">
            {/* Left Side - Todo List */}
            <div className="todo-list">
                <h3>Your Todos</h3>
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
                                    <strong
                                        style={{
                                            textDecoration: todo.completed ? "line-through" : "none",
                                        }}
                                    >
                                        {todo.title}
                                    </strong>{" "}
                                    - {todo.description || "No description"}
                                </div>
                                <button onClick={() => handleDelete(todo._id)} className="delete-btn">
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Right Side - Form */}
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

                    <button type="submit">Add Todo</button>
                </form>
            </div>
        </div>
    );
}
