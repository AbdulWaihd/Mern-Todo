import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import AiPlanner from "./pages/AiPlanner";
import { useAuthContext } from "./hooks/useAuthContext";
import "./index.css";

function App() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <Navbar />
      <div className={user ? "dashboard-layout" : "landing-wrapper"}>
        <Routes>
          {/* Public Route: Landing Page */}
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/ai-planner" element={user ? <AiPlanner BASE_URL={import.meta.env.VITE_API_URL || ""} /> : <Navigate to="/login" />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={!user ? <LogIn /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/forgot-password"
            element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />}
          />
        </Routes>
      </div>
      {/* Show footer only on dashboard or static footer for landing? 
          Landing page has its own footer, so we can conditionally hide this. */}
      {user && <Footer />}
    </BrowserRouter>
  );
}

export default App;
