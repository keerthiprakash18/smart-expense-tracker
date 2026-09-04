import React, { useState, useEffect } from "react";
import api from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [passData, setPassData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passLoading, setPassLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/expenses/profile/");
      setProfile(res.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePassChange = (e) => {
    setPassData({ ...passData, [e.target.name]: e.target.value });
    if (err) setErr("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passData.newPassword !== passData.confirmPassword) {
      setErr("New password and confirm password do not match.");
      return;
    }

    setPassLoading(true);
    setErr("");
    setMsg("");

    try {
      const res = await api.post("/api/expenses/change-password/", {
        old_password: passData.oldPassword,
        new_password: passData.newPassword,
      });

      setMsg(res.data?.message || "Password updated successfully!");
      setPassData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Change password error:", error.response);
      const backendError =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Failed to update password. Check your inputs.";
      setErr(backendError);
    } finally {
      setPassLoading(false);
    }
  };

  if (loading) {
    return <div style={styles.center}>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Account & Security Settings</h2>
      <p style={styles.subheading}>Manage your personal information and password</p>

      <div style={styles.grid}>
        {/* User Info */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>User Information</h3>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Name:</span>
            <span style={styles.infoValue}>{profile?.name || "N/A"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Email:</span>
            <span style={styles.infoValue}>{profile?.email || "N/A"}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Member Since:</span>
            <span style={styles.infoValue}>{profile?.date_joined || "N/A"}</span>
          </div>
          <div style={styles.badge}>Status: Active (Verified)</div>
        </div>

        {/* Change Password */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Change Password</h3>

          {err && <div style={styles.errorAlert}>{err}</div>}
          {msg && <div style={styles.successAlert}>{msg}</div>}

          <form onSubmit={handlePasswordSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passData.oldPassword}
                onChange={handlePassChange}
                placeholder="Enter current password"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passData.newPassword}
                onChange={handlePassChange}
                placeholder="E.g. Secret@123"
                required
                style={styles.input}
              />
              <small style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                Must be at least 8 chars, 1 uppercase (A-Z), 1 number (0-9), and 1 special char (@$!%*?&#)
              </small>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passData.confirmPassword}
                onChange={handlePassChange}
                placeholder="Re-enter new password"
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={passLoading}
              style={{
                ...styles.btn,
                opacity: passLoading ? 0.7 : 1,
                cursor: passLoading ? "not-allowed" : "pointer",
              }}
            >
              {passLoading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "900px", margin: "30px auto", padding: "0 16px" },
  center: { textAlign: "center", padding: "50px", color: "#64748b" },
  heading: { margin: "0 0 6px 0", fontSize: "24px", fontWeight: "700", color: "#0f172a" },
  subheading: { margin: "0 0 24px 0", fontSize: "14px", color: "#64748b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" },
  card: { backgroundColor: "#fff", padding: "24px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
  cardTitle: { margin: "0 0 18px 0", fontSize: "18px", fontWeight: "600", color: "#1e293b" },
  infoRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: "14px" },
  infoLabel: { color: "#64748b", fontWeight: "500" },
  infoValue: { color: "#0f172a", fontWeight: "600" },
  badge: { marginTop: "16px", display: "inline-block", padding: "6px 12px", backgroundColor: "#ecfdf5", color: "#059669", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "5px", textAlign: "left" },
  label: { fontSize: "13px", fontWeight: "600", color: "#334155" },
  input: { padding: "10px 12px", fontSize: "14px", borderRadius: "6px", border: "1px solid #cbd5e1" },
  btn: { padding: "11px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", marginTop: "6px" },
  errorAlert: { padding: "10px", marginBottom: "14px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "13px" },
  successAlert: { padding: "10px", marginBottom: "14px", borderRadius: "6px", backgroundColor: "#f0fdf4", color: "#16a34a", fontSize: "13px" },
};

export default Profile;