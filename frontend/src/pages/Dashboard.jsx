import React, { useState, useEffect } from "react";
import { getDashboardSummary } from "../services/expenseService";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load dashboard data. Please check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div style={styles.center}>Loading financial analytics...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorAlert}>{error}</div>
      </div>
    );
  }

  const categoryData = summary?.category_summary || [];
  const monthlyData = summary?.monthly_summary || [];
  const recentExpenses = summary?.recent_expenses || [];
  const totalAmount = summary?.total_expenses || 0;
  const totalCount = summary?.total_count || 0;
  const avgExpense = summary?.avg_expense || 0;
  const highestExpense = summary?.highest_expense || 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Financial Analytics Dashboard</h2>
      <p style={styles.subtitle}>Overview of your spending habits and category analytics</p>

      {/* 4 Metric Cards */}
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Spending</div>
          <div style={{ ...styles.cardValue, color: "#2563eb" }}>
            ₹{Number(totalAmount).toLocaleString()}
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Records</div>
          <div style={styles.cardValue}>{totalCount}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Average Expense</div>
          <div style={{ ...styles.cardValue, color: "#10b981" }}>
            ₹{Number(avgExpense).toLocaleString()}
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Highest Expense</div>
          <div style={{ ...styles.cardValue, color: "#ef4444" }}>
            ₹{Number(highestExpense).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Category Distribution</h3>
          {categoryData.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={styles.noData}>No category spending recorded.</p>
          )}
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Monthly Spending Trend</h3>
          {monthlyData.length > 0 ? (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} />
                  <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p style={styles.noData}>No monthly data available.</p>
          )}
        </div>
      </div>

      {/* Recent 5 Transactions */}
      <div style={styles.tableCard}>
        <h3 style={styles.chartTitle}>Recent 5 Transactions</h3>
        {recentExpenses.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Merchant</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((item) => (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>{item.expense_date}</td>
                    <td style={{ ...styles.td, fontWeight: "600" }}>{item.title}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{item.category}</span>
                    </td>
                    <td style={styles.td}>{item.merchant || "—"}</td>
                    <td style={{ ...styles.td, textAlign: "right", fontWeight: "700", color: "#0f172a" }}>
                      ₹{Number(item.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={styles.noData}>No recent transactions available.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "1150px", margin: "24px auto", padding: "0 16px" },
  center: { textAlign: "center", padding: "60px", color: "#64748b" },
  title: { margin: "0 0 6px 0", fontSize: "24px", fontWeight: "700", color: "#0f172a" },
  subtitle: { margin: "0 0 24px 0", fontSize: "14px", color: "#64748b" },
  errorAlert: { padding: "14px", borderRadius: "6px", backgroundColor: "#fef2f2", color: "#dc2626" },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  cardLabel: { fontSize: "13px", color: "#64748b", marginBottom: "8px" },
  cardValue: { fontSize: "24px", fontWeight: "700", color: "#0f172a" },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  chartCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  chartTitle: { margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600", color: "#1e293b" },
  noData: { textAlign: "center", color: "#94a3b8", padding: "50px 0", fontSize: "14px" },
  tableCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" },
  thRow: { borderBottom: "2px solid #f1f5f9" },
  th: { padding: "12px 10px", color: "#64748b", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "12px 10px", color: "#334155" },
  badge: {
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
  },
};

export default Dashboard;