import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";
import PublicDashboardPage from "./components/PublicDashboardPage";

// Öffentliche Route: /dashboard oder /?public
// Ohne React Router — einfache URL-Prüfung reicht für eine einzelne Public Page
const isPublicDashboard =
  window.location.pathname === "/dashboard" ||
  new URLSearchParams(window.location.search).has("public");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isPublicDashboard ? (
      <PublicDashboardPage />
    ) : (
      <AuthProvider>
        <App />
      </AuthProvider>
    )}
  </React.StrictMode>,
);
