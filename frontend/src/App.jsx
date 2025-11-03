import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import "./index.css";
import Signup from "./pages/SignUp";
import LogIn from "./pages/LogIn";
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

          <Route
            path="/login"
            element={!user ? <LogIn /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
      </BrowserRouter>
   
  );
}

export default App;
