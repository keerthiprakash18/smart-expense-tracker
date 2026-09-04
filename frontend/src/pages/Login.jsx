import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { setTokens } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [forgotData, setForgotData] = useState({ email: "", phone: "", otp: "", newPassword: "" });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotErr, setForgotErr] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/token/", {
        username: formData.email,
        password: formData.password,
      });

      if (response.data.access && response.data.refresh) {
        setTokens(response.data.access, response.data.refresh);
        loginUser(response.data.access);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.status === 401 ? "Invalid email or password." : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 - Send OTP
  const handleForgotSendOTP = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotErr("");
    setForgotMsg("");

    try {
      const res = await api.post("/api/expenses/forgot-password/send-otp/", {
        email: forgotData.email,
        phone: forgotData.phone,
      });
      setForgotMsg(res.data.message);
      setForgotStep(2);
    } catch (err) {
      setForgotErr(err.response?.data?.error || "User not found.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Forgot Password: Step 2 - Reset Password
  const handleForgotReset = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotErr("");

    try {
      const res = await api.post("/api/expenses/forgot-password/reset/", {
        email: forgotData.email,
        phone: forgotData.phone,
        otp: forgotData.otp,
        new_password: forgotData.newPassword,
      });
      alert(res.data.message);
      setShowForgotModal(false);
      setForgotStep(1);
    } catch (err) {
      setForgotErr(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subheading}>Login to manage your finances</p>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label style={styles.label}>Password</label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                style={styles.forgotBtn}
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3 style={{ margin: "0 0 10px 0" }}>Reset Password</h3>
            {forgotErr && <div style={styles.errorAlert}>{forgotErr}</div>}
            {forgotMsg && <div style={styles.successAlert}>{forgotMsg}</div>}

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotSendOTP} style={styles.form}>
                <input
                  type="email"
                  placeholder="Registered Email"
                  required
                  value={forgotData.email}
                  onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                  style={styles.input}
                />
                <input
                  type="tel"
                  placeholder="Registered Phone Number"
                  required
                  value={forgotData.phone}
                  onChange={(e) => setForgotData({ ...forgotData, phone: e.target.value })}
                  style={styles.input}
                />
                <button type="submit" disabled={forgotLoading} style={styles.submitBtn}>
                  {forgotLoading ? "Sending OTP..." : "Send Reset OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotReset} style={styles.form}>
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  required
                  maxLength="6"
                  value={forgotData.otp}
                  onChange={(e) => setForgotData({ ...forgotData, otp: e.target.value })}
                  style={{ ...styles.input, textAlign: "center", letterSpacing: "4px" }}
                />
                <input
                  type="password"
                  placeholder="New Strong Password (Min 8 chars, A-Z, 0-9, @#)"
                  required
                  value={forgotData.newPassword}
                  onChange={(e) => setForgotData({ ...forgotData, newPassword: e.target.value })}
                  style={styles.input}
                />
                <button type="submit" disabled={forgotLoading} style={styles.submitBtn}>
                  {forgotLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}

            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotStep(1);
              }}
              style={{ ...styles.backBtn, marginTop: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  card: { width: "100%", maxWidth: "420px", backgroundColor: "#fff", borderRadius: "10px", padding: "32px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
  heading: { margin: "0 0 8px 0", fontSize: "24px", fontWeight: "700", color: "#1e293b" },
  subheading: { margin: "0 0 24px 0", fontSize: "14px", color: "#64748b" },
  errorAlert: { padding: "10px", marginBottom: "16px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "13px" },
  successAlert: { padding: "10px", marginBottom: "16px", borderRadius: "6px", backgroundColor: "#f0fdf4", color: "#16a34a", fontSize: "13px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "6px", textAlign: "left" },
  label: { fontSize: "13px", fontWeight: "600", color: "#334155" },
  input: { padding: "10px 14px", fontSize: "14px", borderRadius: "6px", border: "1px solid #cbd5e1" },
  forgotBtn: { background: "none", border: "none", color: "#2563eb", fontSize: "12px", cursor: "pointer", fontWeight: "600" },
  submitBtn: { padding: "12px", fontSize: "14px", fontWeight: "600", color: "#fff", backgroundColor: "#2563eb", border: "none", borderRadius: "6px", cursor: "pointer" },
  footerText: { marginTop: "20px", fontSize: "14px", color: "#64748b", textAlign: "center" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: "600" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalCard: { width: "100%", maxWidth: "380px", backgroundColor: "#fff", padding: "24px", borderRadius: "10px", textAlign: "center" },
  backBtn: { border: "none", background: "none", color: "#64748b", fontSize: "13px", cursor: "pointer" },
};

export default Login;