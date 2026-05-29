import axios from "axios";

// Use the Vite proxy — all /api requests go to http://localhost:5000
const api = axios.create({
    baseURL: "/api",
    withCredentials: true, // send cookies on every request
});

export default api;
