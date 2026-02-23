
import axios from 'axios';

// Create Axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', // Default to localhost for dev
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling 401s (token expiry)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Retry logic could go here (using refresh token)
        // For MVP, we'll just redirect to login if 401 and not already logging in
        if (error.response?.status === 401 && !originalRequest._retry) {
            // originalRequest._retry = true; 
            // Handle refresh flow here... for now just clear and redirect
            localStorage.removeItem('access_token');
            // window.location.href = '/login'; // Force redirect
        }
        return Promise.reject(error);
    }
);

export default api;
