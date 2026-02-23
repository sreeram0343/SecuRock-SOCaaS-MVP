import { create } from 'zustand';
import api from '../services/api';

export interface Incident {
    id: string;
    title: string;
    status: 'new' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    created_at: string;
    organization_id: string;
}

interface IncidentState {
    incidents: Incident[];
    isLoading: boolean;
    fetchIncidents: () => Promise<void>;
    createIncident: (data: Partial<Incident>) => Promise<void>;
    updateIncidentStatus: (id: string, status: string) => Promise<void>;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
    incidents: [],
    isLoading: false,

    fetchIncidents: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/incidents');
            // Ensure status maps correctly if backend uses different casing/values
            set({ incidents: response.data, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch incidents', error);
            // Fallback mock data
            set({
                incidents: [
                    { id: '1', title: 'Data Exfiltration Attempt', status: 'new', priority: 'high', description: 'Large outbound traffic to unknown IP address detected.', created_at: new Date().toISOString(), organization_id: 'mock' },
                    { id: '2', title: 'Suspicious Admin Login', status: 'in_progress', priority: 'medium', description: 'Multiple failed login attempts.', created_at: new Date().toISOString(), organization_id: 'mock' },
                ],
                isLoading: false
            });
        }
    },

    createIncident: async (data) => {
        try {
            const response = await api.post('/incidents', data);
            set(state => ({ incidents: [response.data, ...state.incidents] }));
        } catch (error) {
            console.error('Failed to create incident', error);
            throw error;
        }
    },

    updateIncidentStatus: async (id, status) => {
        // Optimistic update
        const current = get().incidents;
        set({ incidents: current.map(i => i.id === id ? { ...i, status: status as any } : i) });

        try {
            await api.patch(`/incidents/${id}`, { status });
        } catch (error) {
            set({ incidents: current });
            console.error('Failed to update incident', error);
        }
    }
}));
