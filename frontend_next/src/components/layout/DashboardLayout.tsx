
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AnimatedBackground from './AnimatedBackground';

export default function DashboardLayout() {
    return (
        <div className="relative flex h-screen overflow-hidden">
            <AnimatedBackground />
            <Sidebar />
            <main className="relative z-10 flex-1 overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}
