import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./index.css";
import Signup from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import AiPlanner from "./pages/AiPlanner";
import { useAuthContext } from "./hooks/useAuthContext";
import"./index.css";
function App() {

  const {user}= useAuthContext();
  return (
   
      <BrowserRouter>
      <Navbar />
      <div className="pages p-4">
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/ai-planner" element={user ? <AiPlanner BASE_URL={import.meta.env.VITE_API_URL || "http://localhost:4000"} /> : <Navigate to="/login" />} />

          <Route
            path="/login"
            element={!user ? <LogIn /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
          <Route
            path="/forgot-password"
            element={!user ? <ForgotPassword /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
      <Footer />
      </BrowserRouter>
   
  );
}

export default App;
