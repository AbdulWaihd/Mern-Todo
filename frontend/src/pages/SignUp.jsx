import {  useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";


export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const { dispatch } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

    try {
        // make a post request to backend
        const response = await fetch("/api/user/signup", {
            method: "POST",
            body: JSON.stringify({ username, email, password }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error||"Signup failed");
            setIsLoading(false);
            return ;
        } 
        // save the user to localStorage
        localStorage.setItem("user", JSON.stringify(data));
        // update the auth context
        dispatch({ type: "LOGIN", payload: data });
        setIsLoading(false);
        setSuccess("Signup successful! You can now log in.");

        navigate("/login");
    }
    catch (err) {
        setError("An error occurred. Please try again.");
        setIsLoading(false);   
        console.error(err); 
    }
    
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Signup</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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
                        {isLoading ? "Signing up..." : "Sign Up"}
                    </button>

                    {error && <p className="auth-error">{error}</p>}
                    {success && <p className="auth-success">{success}</p>}
                </form>
            </div>
        </div>
    );
}
