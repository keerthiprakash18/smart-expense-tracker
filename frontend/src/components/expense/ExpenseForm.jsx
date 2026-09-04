import React, { useState, useEffect } from "react";

const CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Utilities",
  "Entertainment",
  "Healthcare",
  "Other",
];

const ExpenseForm = ({ onSubmit, initialData, ocrData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    merchant: "",
    expense_date: new Date().toISOString().split("T")[0],
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form if Editing an existing expense
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        amount: initialData.amount || "",
        category: initialData.category || "Food",
        merchant: initialData.merchant || "",
        expense_date: initialData.expense_date || new Date().toISOString().split("T")[0],
      });
      if (initialData.receipt) {
        setReceiptPreview(
          initialData.receipt.startsWith("http")
            ? initialData.receipt
            : `http://127.0.0.1:8000${initialData.receipt}`
        );
      }
    }
  }, [initialData]);

  // Populate form if OCR scanned a receipt
  useEffect(() => {
    if (ocrData) {
      setFormData((prev) => ({
        ...prev,
        title: ocrData.title || ocrData.merchant ? `${ocrData.merchant || "Receipt"} Expense` : prev.title,
        amount: ocrData.amount ? String(ocrData.amount) : prev.amount,
        merchant: ocrData.merchant || prev.merchant,
        category: ocrData.category || prev.category,
        expense_date: ocrData.date || prev.expense_date,
      }));

      if (ocrData.receiptFile) {
        setReceiptFile(ocrData.receiptFile);
        setReceiptPreview(URL.createObjectURL(ocrData.receiptFile));
      }
    }
  }, [ocrData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.expense_date) {
      setError("Please fill all required fields (Title, Amount, Date).");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      // Use FormData to send file + data
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("amount", formData.amount);
      payload.append("category", formData.category);
      payload.append("merchant", formData.merchant || "");
      payload.append("expense_date", formData.expense_date);

      if (receiptFile) {
        payload.append("receipt", receiptFile);
      }

      await onSubmit(payload);
    } catch (err) {
      console.error("Expense form error:", err);
      setError("Failed to save expense. Please check your inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          {initialData ? "Edit Expense" : "Add New Expense"}
        </h3>
        {ocrData && (
          <span style={styles.ocrBadge}>✓ Auto-filled from OCR Scan</span>
        )}
      </div>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Amount (₹) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Merchant / Store</label>
            <input
              type="text"
              name="merchant"
              value={formData.merchant}
              onChange={handleChange}
              placeholder="e.g. Reliance, Shell, Amazon"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Expense Date <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="date"
              name="expense_date"
              value={formData.expense_date}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Attach Receipt (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={styles.fileInput}
            />
          </div>
        </div>

        {receiptPreview && (
          <div style={styles.previewBox}>
            <span style={styles.previewLabel}>Receipt Preview:</span>
            <img
              src={receiptPreview}
              alt="Receipt preview"
              style={styles.previewImg}
            />
          </div>
        )}

        <div style={styles.actionRow}>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.submitBtn,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting
              ? "Saving..."
              : initialData
              ? "Update Expense"
              : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "10px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    marginBottom: "24px",
    border: "1px solid #e2e8f0",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
  },
  ocrBadge: {
    backgroundColor: "#ecfdf5",
    color: "#059669",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  errorAlert: {
    padding: "10px 14px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    borderRadius: "6px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    textAlign: "left",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#334155",
  },
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    outline: "none",
  },
  select: {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    outline: "none",
  },
  fileInput: {
    padding: "8px 0",
    fontSize: "13px",
  },
  previewBox: {
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  previewLabel: {
    fontSize: "13px",
    color: "#64748b",
  },
  previewImg: {
    maxHeight: "100px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
  },
  cancelBtn: {
    padding: "10px 18px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 22px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default ExpenseForm;