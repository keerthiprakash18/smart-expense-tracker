import api from "./api";

/* ================================
   GET ALL EXPENSES / TRANSACTIONS
================================ */

export const getExpenses = async (params = {}) => {
  const response = await api.get("/api/expenses/", {
    params,
  });

  return response.data;
};


/* ================================
   ADD EXPENSE / INCOME / TRANSACTION
================================ */

export const addExpense = async (expenseData) => {
  const isFormData = expenseData instanceof FormData;

  const response = await api.post(
    "/api/expenses/",
    expenseData,
    {
      headers: isFormData
        ? {
            "Content-Type": "multipart/form-data",
          }
        : undefined,
    }
  );

  return response.data;
};


/* ================================
   UPDATE TRANSACTION
================================ */

export const updateExpense = async (
  id,
  expenseData
) => {
  const isFormData = expenseData instanceof FormData;

  const response = await api.put(
    `/api/expenses/${id}/`,
    expenseData,
    {
      headers: isFormData
        ? {
            "Content-Type": "multipart/form-data",
          }
        : undefined,
    }
  );

  return response.data;
};


/* ================================
   DELETE TRANSACTION
================================ */

export const deleteExpense = async (id) => {
  const response = await api.delete(
    `/api/expenses/${id}/`
  );

  return response.data;
};


/* ================================
   DASHBOARD SUMMARY
================================ */

export const getDashboardSummary = async () => {
  const response = await api.get(
    "/api/dashboard/"
  );

  return response.data;
};


/* ================================
   OCR RECEIPT SCANNER
================================ */

export const scanReceipt = async (file) => {
  if (!file) {
    throw new Error("Receipt image is required.");
  }

  const formData = new FormData();

  formData.append(
    "receipt",
    file
  );

  const response = await api.post(
    "/api/scan-receipt/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000,
    }
  );

  return response.data;
};


/* ================================
   GET SINGLE TRANSACTION
================================ */

export const getExpense = async (id) => {
  const response = await api.get(
    `/api/expenses/${id}/`
  );

  return response.data;
};