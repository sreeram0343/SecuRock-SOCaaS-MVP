
import { create } from 'zustand';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (credentials) => {
        set({ isLoading: true });
        try {
            const formData = new URLSearchParams();
            formData.append('username', credentials.username);
            formData.append('password', credentials.password);

            const response = await api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            // Decode token or fetch user profile... for now simulate
            set({ isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    signup: async (data) => {
        set({ isLoading: true });
        try {
            const response = await api.post('/auth/signup', data);
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            set({ isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Ideally verify token with backend
            set({ isAuthenticated: true });
        }
    },
}));
