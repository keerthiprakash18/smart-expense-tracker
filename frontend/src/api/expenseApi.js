import api from "../services/api";

/*
 * Central API client
 * Use services/api.js so authentication,
 * JWT token handling and refresh logic stay consistent.
 */

export const getExpenses = async (params = {}) => {
  const response = await api.get("/api/expenses/", {
    params,
  });

  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post("/api/expenses/", data);

  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await api.put(
    `/api/expenses/${id}/`,
    data
  );

  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(
    `/api/expenses/${id}/`
  );

  return response.data;
};

export const getDashboard = async () => {
  const response = await api.get(
    "/api/dashboard/"
  );

  return response.data;
};

export const scanReceipt = async (file) => {
  const formData = new FormData();
  formData.append("receipt", file);

  const response = await api.post(
    "/api/scan-receipt/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export default api;