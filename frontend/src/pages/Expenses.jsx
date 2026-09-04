import React, { useState, useEffect } from "react";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "../services/expenseService";
import ReceiptUpload from "../components/expense/ReceiptUpload";
import ExpenseForm from "../components/expense/ExpenseForm";
import ExpenseList from "../components/expense/ExpenseList";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [ocrData, setOcrData] = useState(null);

  // Search and Filter states
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const data = await getExpenses(params);
      
      if (Array.isArray(data)) {
        setExpenses(data);
      } else if (data && Array.isArray(data.results)) {
        setExpenses(data.results);
      } else {
        setExpenses([]);
      }
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setExpenses([]);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to load expenses. Please check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [category, startDate, endDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExpenses();
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setStartDate("");
    setEndDate("");
  };

  // OCR result flow
  const handleOCRResult = (data) => {
    setOcrData(data);
    setShowForm(true);
    setEditingExpense(null);
  };

  // Save new or updated expense
  const handleSaveExpense = async (formData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, formData);
      } else {
        await addExpense(formData);
      }
      setShowForm(false);
      setEditingExpense(null);
      setOcrData(null);
      fetchExpenses();
    } catch (err) {
      console.error("Save expense error:", err);
      alert("Error saving expense. Please check all fields.");
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id);
        fetchExpenses();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete expense.");
      }
    }
  };

  // Edit click
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setOcrData(null);
    setShowForm(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.heading}>Expense Management</h2>
          <p style={styles.subheading}>Track, scan, and organize your receipts and spending</p>
        </div>
        <button
          onClick={() => {
            setEditingExpense(null);
            setOcrData(null);
            setShowForm(!showForm);
          }}
          style={styles.addButton}
        >
          {showForm ? "Close Form" : "+ Add Expense"}
        </button>
      </div>

      {/* OCR Upload Section */}
      <ReceiptUpload onOCRResult={handleOCRResult} />

      {/* Expense Add / Edit Form Modal or Inline */}
      {showForm && (
        <div style={styles.formContainer}>
          <ExpenseForm
            onSubmit={handleSaveExpense}
            initialData={editingExpense}
            ocrData={ocrData}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(null);
              setOcrData(null);
            }}
          />
        </div>
      )}

      {/* Filters & Search */}
      <div style={styles.filterCard}>
        <form onSubmit={handleSearchSubmit} style={styles.filterForm}>
          <input
            type="text"
            placeholder="Search title, merchant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.input}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.filterBtn}>
            Filter
          </button>
          <button type="button" onClick={handleResetFilters} style={styles.resetBtn}>
            Reset
          </button>
        </form>
      </div>

      {/* Expense List display */}
      {loading ? (
        <div style={styles.loading}>Loading expenses...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <ExpenseList
          expenses={Array.isArray(expenses) ? expenses : []}
          onEdit={handleEditClick}
          onDelete={handleDeleteExpense}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "24px auto",
    padding: "0 16px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  heading: {
    margin: "0 0 4px 0",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  },
  subheading: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
  },
  addButton: {
    padding: "10px 18px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  formContainer: {
    marginBottom: "24px",
  },
  filterCard: {
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  filterForm: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "13px",
  },
  select: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "13px",
  },
  filterBtn: {
    padding: "8px 16px",
    backgroundColor: "#0ea5e9",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  resetBtn: {
    padding: "8px 14px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
  },
  error: {
    padding: "12px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    borderRadius: "6px",
    textAlign: "center",
  },
};

export default Expenses;