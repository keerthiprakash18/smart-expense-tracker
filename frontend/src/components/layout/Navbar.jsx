import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          ExpenseTracker
        </Link>

        <div style={styles.links}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>
              <Link to="/expenses" style={styles.link}>
                Expenses
              </Link>
              <Link to="/profile" style={styles.link}>
                Profile
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Login
              </Link>
              <Link to="/register" style={styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#0f172a",
    padding: "14px 20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "700",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "18px",
    alignItems: "center",
  },
  link: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
  },
  registerBtn: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "8px 14px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    color: "#ffffff",
    border: "none",
    padding: "7px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Navbar;