import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("finance_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message =
      error.response?.data?.message ||
      error.message ||
      "Request failed. Please try again.";
    error.status = error.response?.status;
    return Promise.reject(error);
  },
);
export default api;
