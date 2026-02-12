import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/public/Login';
import Signup from '@/pages/public/Signup';
import Landing from '@/pages/public/Landing';
import Pricing from '@/pages/public/Pricing';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Overview from '@/pages/dashboard/Overview';
import Alerts from '@/pages/dashboard/Alerts';
import Incidents from '@/pages/dashboard/Incidents';
import Analytics from '@/pages/dashboard/Analytics';
import PageShell from '@/components/layout/PageShell';
import PlatformPage from '@/pages/public/PlatformPage';
import SolutionsPage from '@/pages/public/SolutionsPage';
import ServicesPage from '@/pages/public/ServicesPage';
import ResourcesPage from '@/pages/public/ResourcesPage';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);

    if (!isAuthenticated && !localStorage.getItem('access_token')) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/pricing" element={<Pricing />} />

                <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="alerts" element={<Alerts />} />
                    <Route path="incidents" element={<Incidents />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<div className="text-white">Settings Page (Coming Soon)</div>} />
                </Route>

                {/* Expanded Site Structure */}
                <Route path="/platform/*" element={<PlatformPage />} />
                <Route path="/solutions/*" element={<SolutionsPage />} />
                <Route path="/services/*" element={<ServicesPage />} />
                <Route path="/resources/*" element={<ResourcesPage />} />

                {/* Fallback to PageShell for others */}
                <Route path="/about/*" element={<PageShell />} />
                <Route path="/customers/*" element={<PageShell />} />
                <Route path="/legal/*" element={<PageShell />} />
                <Route path="/support/*" element={<PageShell />} />
                <Route path="/tools/*" element={<PageShell />} />
                <Route path="/compare/*" element={<PageShell />} />
                <Route path="/events/*" element={<PageShell />} />
                <Route path="/community/*" element={<PageShell />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
