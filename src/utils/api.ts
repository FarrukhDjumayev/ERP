// services/API.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://api.noventer.uz/api/v1",
});

API.interceptors.request.use((config) => {
  // Login va register so‘rovlariga token qo‘shilmaydi
  if (!config.url?.includes("/login/") && !config.url?.includes("/register/")) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
