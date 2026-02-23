
import { create } from 'zustand';
import api from '../services/api';

export interface Alert {
    id: string;
    severity: string;
    title: string;
    status: string;
    description: string;
    created_at: string;
    source_ip: string;
}

interface AlertState {
    alerts: Alert[];
    isLoading: boolean;
    fetchAlerts: () => Promise<void>;
    updateAlertStatus: (id: string, status: string) => Promise<void>;
}

export const useAlertStore = create<AlertState>((set, get) => ({
    alerts: [],
    isLoading: false,

    fetchAlerts: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/alerts');
            set({ alerts: response.data.items, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch alerts', error);
            // Fallback for demo if backend not running
            set({
                alerts: [
                    { id: '1', severity: 'critical', title: 'Brute Force Detected', status: 'new', description: 'Multiple failed logins', created_at: new Date().toISOString(), source_ip: '192.168.1.50' },
                    { id: '2', severity: 'high', title: 'Malware Signature', status: 'new', description: 'Known malware hash found', created_at: new Date().toISOString(), source_ip: '10.0.0.5' },
                ], isLoading: false
            });
        }
    },

    updateAlertStatus: async (id, status) => {
        // Optimistic update
        const currentAlerts = get().alerts;
        set({ alerts: currentAlerts.map(a => a.id === id ? { ...a, status } : a) });

        try {
            await api.post(`/alerts/${id}/acknowledge`);
        } catch (error) {
            // Revert on fail
            set({ alerts: currentAlerts });
            console.error('Failed to update status', error);
        }
    }
}));
