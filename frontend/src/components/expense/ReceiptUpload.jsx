import React, { useState } from "react";
import { scanReceipt } from "../../services/expenseService";

const ReceiptUpload = ({ onOCRResult }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError("Please choose a receipt image first.");
      return;
    }

    setScanning(true);
    setError("");

    try {
      const data = await scanReceipt(selectedFile);
      
      // Auto-fill trigger to parent form
      if (onOCRResult) {
        onOCRResult({
          ...data,
          receiptFile: selectedFile,
        });
      }
    } catch (err) {
      console.error("OCR Scan Error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Backend OCR server error. Check Django terminal.");
      }
    } finally {
      setScanning(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Scan Receipt (AI OCR)</h3>
      <p style={styles.subtitle}>
        Upload your bill or receipt to automatically extract expense details.
      </p>

      {error && <div style={styles.errorAlert}>{error}</div>}

      <div style={styles.uploadArea}>
        <input
          type="file"
          accept="image/*"
          id="receipt-input"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="receipt-input" style={styles.fileButton}>
          {selectedFile ? "Change Image" : "Choose Receipt Image"}
        </label>

        {selectedFile && (
          <span style={styles.fileName}>{selectedFile.name}</span>
        )}
      </div>

      {previewUrl && (
        <div style={styles.previewContainer}>
          <img src={previewUrl} alt="Receipt preview" style={styles.previewImage} />
        </div>
      )}

      {selectedFile && (
        <div style={styles.actionRow}>
          <button
            onClick={handleScan}
            disabled={scanning}
            style={{
              ...styles.scanButton,
              opacity: scanning ? 0.7 : 1,
              cursor: scanning ? "not-allowed" : "pointer",
            }}
          >
            {scanning ? "Extracting Data..." : "Scan & Auto-Fill Form"}
          </button>
          
          <button onClick={handleClear} disabled={scanning} style={styles.clearButton}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    marginBottom: "24px",
  },
  title: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
  subtitle: {
    margin: "0 0 16px 0",
    fontSize: "13px",
    color: "#64748b",
  },
  errorAlert: {
    padding: "10px",
    marginBottom: "14px",
    borderRadius: "6px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    fontSize: "13px",
    border: "1px solid #fecaca",
  },
  uploadArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  fileButton: {
    padding: "8px 16px",
    backgroundColor: "#0ea5e9",
    color: "#ffffff",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    display: "inline-block",
  },
  fileName: {
    fontSize: "13px",
    color: "#475569",
  },
  previewContainer: {
    marginTop: "14px",
    textAlign: "center",
  },
  previewImage: {
    maxHeight: "180px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
  },
  actionRow: {
    marginTop: "16px",
    display: "flex",
    gap: "10px",
  },
  scanButton: {
    padding: "9px 18px",
    backgroundColor: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
  },
  clearButton: {
    padding: "9px 14px",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
};

export default ReceiptUpload;