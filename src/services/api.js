import axios from "axios";

const API = axios.create({
  baseURL: "https://glaze-backend-production-ad01.up.railway.app/api"
});

// Interceptor: agrega el token a cada request automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//aaaaaaaaaaaaaaaaaaaaaa
export default API;