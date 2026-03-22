import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </AuthContextProvider>
);
