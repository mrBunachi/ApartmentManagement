import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: false,
});

// Inject token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// Global error handler
request.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default request;
