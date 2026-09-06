import React, { useState } from "react";
import { HashRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import Welcome from "./pages/welcome";

export default function App() {
  const [hasSeenIntro, setHasSeenIntro] = useState(() => {
    return localStorage.getItem("titan_intro_seen") === "true";
  });

  const handleFinishIntro = () => {
    localStorage.setItem("titan_intro_seen", "true");
    setHasSeenIntro(true);
  };

  if (!hasSeenIntro) {
    return <Welcome onComplete={handleFinishIntro} />;
  }

  return (
    <AuthProvider>
      <Router>
        <div
          style={{
            minHeight: "100vh",
            width: "100%",
            background: "#05070A",
            color: "#FFFFFF",
          }}
        >
          <AppRouter />
        </div>
      </Router>
    </AuthProvider>
  );
}