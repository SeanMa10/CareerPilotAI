import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 402) {
      const detail = error.response?.data?.detail;
      const payload =
        typeof detail === "object"
          ? detail
          : { message: detail || "This feature is locked." };

      window.dispatchEvent(
        new CustomEvent("feature-locked", {
          detail: payload,
        }),
      );
    }

    return Promise.reject(error);
  },
);

export default api;
