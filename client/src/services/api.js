import axios from "axios";

const api = axios.create({
  baseURL: (
    import.meta.env.VITE_API_URL ||
    "https://aifinancetracker.onrender.com"
  ).replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add authentication token to every request
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

// Handle API responses and errors
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