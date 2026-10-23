
import axios from "axios";

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL ||
    "https://aifinancetracker.onrender.com/api"
  ).replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("finance_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.status = error.response?.status;
    error.message =
      error.response?.data?.message ||
      error.message ||
      "Request failed. Please try again.";

    return Promise.reject(error);
  }
);

export default api;
