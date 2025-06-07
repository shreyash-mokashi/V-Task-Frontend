import axios from "axios";

const API = axios.create({
  baseURL: "https://v-task-backend.onrender.com",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;
