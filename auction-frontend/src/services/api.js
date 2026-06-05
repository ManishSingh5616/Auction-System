import axios from "axios";

// Use the Vite proxy — all /api requests go to http://localhost:5000
const api = axios.create({
    baseURL: "/api",
    withCredentials: true, 
});

export default api;
