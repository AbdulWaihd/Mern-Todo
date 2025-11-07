import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
export default function LogIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();  
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/api/todos/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                setSuccess(null);
                setIsLoading(false);
                return;
            } 
            localStorage.setItem("user", JSON.stringify(data));
            dispatch({ type: "LOGIN", payload: data });
            setSuccess("Login successful!");
            setError(null);
            setIsLoading(false);
            navigate("/");
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setSuccess(null);
            console.error("Login error:", err);
        }

        setIsLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button disabled={isLoading} type="submit" className="btn-auth">
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>

                    {error && <p className="auth-error">{error}</p>}
                    {success && <p className="auth-success">{success}</p>}
                </form>
            </div>
        </div>
    );
}
