import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const COUNTRY_CODES = [
  { code: "+91", country: "India (+91)" },
  { code: "+1", country: "USA / Canada (+1)" },
  { code: "+44", country: "UK (+44)" },
  { code: "+971", country: "UAE (+971)" },
  { code: "+65", country: "Singapore (+65)" },
];

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const checks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&#]/.test(formData.password),
  };
  const isPasswordValid = Object.values(checks).every(Boolean);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneNumber(val);
    if (error) setError("");
  };

  const fullPhone = `${countryCode}${phoneNumber}`;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (phoneNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!isPasswordValid) {
      setError("Please fulfill all password strength rules.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: fullPhone,
        password: formData.password,
      };

      console.log("Sending Register Payload:", payload);
      const res = await api.post("/api/expenses/register/", payload);

      setMessage(res.data?.message || "OTP generated successfully!");
      setStep(2);
    } catch (err) {
      console.error("Registration Error Object:", err);
      if (err.response) {
        // Show actual backend error text
        const backendMsg =
          err.response.data?.error ||
          err.response.data?.detail ||
          (typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data));
        setError(`Error (${err.response.status}): ${backendMsg}`);
      } else if (err.request) {
        setError("Network error: Cannot reach Django backend server at http://127.0.0.1:8000");
      } else {
        setError(`Client error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/api/expenses/verify-otp/", {
        phone: fullPhone,
        email: formData.email.trim().toLowerCase(),
        otp: otp,
      });

      alert("Account verified successfully! You can now login.");
      navigate("/login");
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || "Invalid OTP.");
      } else {
        setError("Network error during OTP verification.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>{step === 1 ? "Create Account" : "OTP Verification"}</h2>
        <p style={styles.subheading}>
          {step === 1
            ? "Track your daily expenses and finances"
            : `Enter 6-digit OTP sent for ${fullPhone}`}
        </p>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {message && <div style={styles.successAlert}>{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleRegister} style={styles.form} autoComplete="off">
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Mobile Number (For Verification)</label>
              <div style={styles.phoneRow}>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={styles.countrySelect}
                >
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.country}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="10-digit mobile number"
                  required
                  style={styles.phoneInput}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Create Strong Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                style={styles.input}
              />

              <div style={styles.criteriaBox}>
                <span style={{ color: checks.length ? "#16a34a" : "#94a3b8" }}>
                  {checks.length ? "✓" : "○"} At least 8 characters
                </span>
                <span style={{ color: checks.upper ? "#16a34a" : "#94a3b8" }}>
                  {checks.upper ? "✓" : "○"} 1 Uppercase letter (A-Z)
                </span>
                <span style={{ color: checks.lower ? "#16a34a" : "#94a3b8" }}>
                  {checks.lower ? "✓" : "○"} 1 Lowercase letter (a-z)
                </span>
                <span style={{ color: checks.number ? "#16a34a" : "#94a3b8" }}>
                  {checks.number ? "✓" : "○"} 1 Number (0-9)
                </span>
                <span style={{ color: checks.special ? "#16a34a" : "#94a3b8" }}>
                  {checks.special ? "✓" : "○"} 1 Special character (@$!%*?&#)
                </span>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid || phoneNumber.length < 10}
              style={{
                ...styles.submitBtn,
                opacity: loading || !isPasswordValid || phoneNumber.length < 10 ? 0.6 : 1,
                cursor: loading || !isPasswordValid || phoneNumber.length < 10 ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Sending OTP..." : "Register & Get OTP"}
            </button>

            <p style={styles.footerText}>
              Already registered?{" "}
              <Link to="/login" style={styles.link}>
                Login here
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Enter 6-Digit OTP</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                placeholder="------"
                required
                style={{ ...styles.input, textAlign: "center", fontSize: "22px", letterSpacing: "8px" }}
              />
              <small style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>
                Check your backend Django terminal for the generated OTP.
              </small>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Verifying..." : "Verify & Activate Account"}
            </button>

            <button type="button" onClick={() => setStep(1)} style={styles.backBtn}>
              Back to Edit Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  card: { width: "100%", maxWidth: "440px", backgroundColor: "#fff", borderRadius: "10px", padding: "30px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  heading: { margin: "0 0 6px 0", fontSize: "22px", fontWeight: "700", color: "#1e293b" },
  subheading: { margin: "0 0 20px 0", fontSize: "13px", color: "#64748b" },
  errorAlert: { padding: "12px 14px", marginBottom: "14px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "13px", border: "1px solid #fecaca", wordBreak: "break-word" },
  successAlert: { padding: "10px 14px", marginBottom: "14px", borderRadius: "6px", backgroundColor: "#f0fdf4", color: "#16a34a", fontSize: "13px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px", textAlign: "left" },
  label: { fontSize: "13px", fontWeight: "600", color: "#334155" },
  input: { padding: "10px 12px", fontSize: "14px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" },
  phoneRow: { display: "flex", gap: "8px" },
  countrySelect: { padding: "10px 8px", fontSize: "13px", borderRadius: "6px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", outline: "none", minWidth: "120px" },
  phoneInput: { flex: 1, padding: "10px 12px", fontSize: "14px", borderRadius: "6px", border: "1px solid #cbd5e1", outline: "none" },
  criteriaBox: { marginTop: "6px", display: "flex", flexDirection: "column", gap: "3px", fontSize: "11px" },
  submitBtn: { marginTop: "6px", padding: "12px", fontSize: "14px", fontWeight: "600", color: "#fff", backgroundColor: "#2563eb", border: "none", borderRadius: "6px" },
  backBtn: { padding: "8px", fontSize: "13px", color: "#64748b", background: "none", border: "none", cursor: "pointer" },
  footerText: { marginTop: "12px", fontSize: "13px", color: "#64748b", textAlign: "center" },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: "600" },
};

export default Register;