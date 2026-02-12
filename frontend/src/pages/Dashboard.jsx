import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/components';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertTriangle, Monitor } from 'lucide-react';

export default function Dashboard() {
    const { logout } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({ high: 0, medium: 0 });

    const fetchAlerts = async () => {
        try {
            // In prod, use environment variable
            const res = await axios.get('http://localhost:80/api/alerts');
            setAlerts(res.data.items || []);
            updateStats(res.data.items || []);
        } catch (e) {
            console.error("Failed to fetch alerts", e);
        }
    };

    const updateStats = (data) => {
        const high = data.filter(a => a.severity === 'HIGH' || a.severity === 'CRITICAL').length;
        const medium = data.filter(a => a.severity === 'MEDIUM').length;
        setStats({ high, medium });
    };

    useEffect(() => {
        fetchAlerts();

        // WebSocket
        const ws = new WebSocket('ws://localhost:80/api/alerts/ws/alerts');
        ws.onmessage = (event) => {
            console.log("New alert received", event.data);
            // For MVP, just refetch or optimistically add. 
            // The event.data currently is just title string.
            // Ideally we send full json.
            fetchAlerts();
        };

        return () => ws.close();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b bg-card px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-600" />
                    SecuRock SOC
                </h1>
                <button onClick={logout} className="text-sm font-medium hover:underline">Logout</button>
            </nav>

            <main className="p-6 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.high}</div>
                            <p className="text-xs text-muted-foreground">High Severity</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Suspicious Events</CardTitle>
                            <Monitor className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.medium}</div>
                            <p className="text-xs text-muted-foreground">Medium Severity</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <Shield className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Online</div>
                            <p className="text-xs text-muted-foreground">Detection Engine Active</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Alerts Table */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Severity</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Source IP</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {alerts.map((alert) => (
                                        <tr key={alert.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">{new Date(alert.timestamp).toLocaleTimeString()}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${alert.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                                                        alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                    {alert.severity}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle font-medium">{alert.title}</td>
                                            <td className="p-4 align-middle">{alert.source_ip}</td>
                                            <td className="p-4 align-middle">{alert.status}</td>
                                        </tr>
                                    ))}
                                    {alerts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-muted-foreground">No alerts found. System secure.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
