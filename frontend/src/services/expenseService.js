import api from "./api";

export const getExpenses = async (params = {}) => {
  const response = await api.get("/api/expenses/", { params });
  return response.data;
};

export const addExpense = async (expenseData) => {
  const isFormData = expenseData instanceof FormData;
  const response = await api.post("/api/expenses/", expenseData, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const isFormData = expenseData instanceof FormData;
  const response = await api.put(`/api/expenses/${id}/`, expenseData, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/api/expenses/${id}/`);
  return response.data;
};

export const getDashboardSummary = async () => {
  const response = await api.get("/api/expenses/summary/");
  return response.data;
};

export const scanReceipt = async (file) => {
  const formData = new FormData();
  formData.append("receipt", file);

  const response = await api.post("/api/expenses/scan/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};