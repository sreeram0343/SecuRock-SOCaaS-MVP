
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertCircle, ShieldAlert, BarChart3, Settings, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
    const { logout } = useAuthStore();

    const navItems = [
        { to: '/dashboard/overview', icon: LayoutDashboard, label: 'Overview' },
        { to: '/dashboard/alerts', icon: AlertCircle, label: 'Alerts' },
        { to: '/dashboard/incidents', icon: ShieldAlert, label: 'Incidents' },
        { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="h-screen w-64 bg-card/30 backdrop-blur-md text-white flex flex-col border-r border-border">
            {/* Logo */}
            <div className="p-6 flex items-center space-x-3 border-b border-border">
                <Shield className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-glow">SecuRock</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => cn(
                            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-border space-y-3">
                <div className="px-4 py-2 bg-accent/10 rounded-lg">
                    <div className="text-xs text-muted-foreground">Organization</div>
                    <div className="text-sm font-semibold">Your Company</div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full flex items-center justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut size={20} className="mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
