

import { Shield, AlertTriangle, Activity, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color: string;
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/30 backdrop-blur-md border border-border p-6 rounded-xl hover:shadow-lg hover:shadow-primary/10 transition-all"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold">{value}</div>
                {trend && <span className="text-xs text-accent">↑ {trend}</span>}
            </div>
        </motion.div>
    );
}

import { useEffect, useState } from 'react';
import api from '@/services/api';

import AttackMap from '@/components/dashboard/AttackMap';

export default function Overview() {
    interface DashboardData {
        total_alerts: number;
        open_incidents: number;
        severity_distribution: { severity: string; count: number }[];
        alerts_over_time: { timestamp: string; value: number }[];
        recent_attacks: { source: [number, number]; destination: [number, number]; value: number }[];
    }

    interface ChartPoint {
        time: string;
        alerts: number;
    }

    interface AttackPoint {
        source: [number, number];
        destination: [number, number];
        value: number;
    }

    // const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAlerts: 0,
        openIncidents: 0,
        securityScore: 'N/A',
        activeThreats: 0
    });
    const [chartData, setChartData] = useState<ChartPoint[]>([]);
    const [attacks, setAttacks] = useState<AttackPoint[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/analytics/dashboard');
                const data: DashboardData = res.data;
                setStats({
                    totalAlerts: data.total_alerts,
                    openIncidents: data.open_incidents,
                    securityScore: 'A', // Metrics for score calculation to be added later
                    activeThreats: data.severity_distribution.find((d: { severity: string }) => d.severity === 'critical')?.count || 0
                });

                // Transform alerts_over_time for chart
                setChartData(data.alerts_over_time.map((d: { timestamp: string; value: number }) => ({
                    time: new Date(d.timestamp).toLocaleDateString(),
                    alerts: d.value
                })));

                if (data.recent_attacks) {
                    setAttacks(data.recent_attacks);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard metrics", error);
            } finally {
                // setLoading(false);
            }
        };

        fetchDashboard();

        // Poll every 30s
        const interval = setInterval(fetchDashboard, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-glow mb-2">Security Overview</h1>
                    <p className="text-muted-foreground">Real-time security operations dashboard</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-lg border border-accent/30">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">System Online</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Alerts"
                    value={stats.totalAlerts}
                    icon={AlertTriangle}
                    trend="+12%"
                    color="text-primary"
                />
                <StatCard
                    title="Open Incidents"
                    value={stats.openIncidents}
                    icon={Shield}
                    color="text-destructive"
                />
                <StatCard
                    title="Security Score"
                    value={stats.securityScore}
                    icon={TrendingUp}
                    color="text-accent"
                />
                <StatCard
                    title="Active Threats"
                    value={stats.activeThreats}
                    icon={Activity}
                    color="text-yellow-500"
                />
            </div>

            {/* Live Attack Map */}
            <div className="bg-card/30 backdrop-blur-md border border-border p-6 rounded-xl shadow-lg shadow-black/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-destructive" />
                    Live Attack Map
                </h3>
                <div className="h-[400px] w-full bg-slate-900/50 rounded-lg overflow-hidden relative">
                    <AttackMap attacks={attacks} />
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Threat Trends Chart */}
                <div className="lg:col-span-2 bg-card/30 backdrop-blur-md border border-border p-6 rounded-xl shadow-lg shadow-black/20">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Alert Trends
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.4} vertical={false} />
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(26, 31, 54, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', backdropFilter: 'blur(4px)' }}
                                    itemStyle={{ color: '#00D9FF' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Area type="monotone" dataKey="alerts" stroke="#00D9FF" strokeWidth={2} fillOpacity={1} fill="url(#colorAlerts)" activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>


                {/* Recent Activity */}
                <div className="bg-card/30 backdrop-blur-md border border-border p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {[
                            { type: 'critical', title: 'Failed Login Attempt', ip: '192.168.1.1', time: '2 min ago' },
                            { type: 'warning', title: 'Unusual Network Traffic', ip: '192.168.1.2', time: '5 min ago' },
                            { type: 'info', title: 'System Update', ip: 'Internal', time: '10 min ago' },
                            { type: 'critical', title: 'Port Scan Detected', ip: '192.168.1.3', time: '15 min ago' }
                        ].map((activity, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/50 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'critical' ? 'bg-destructive' :
                                    activity.type === 'warning' ? 'bg-yellow-500' :
                                        'bg-accent'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{activity.title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {activity.ip} • {activity.time}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Security Posture */}
            <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-card/30 backdrop-blur-md border border-border p-6 rounded-xl">
                    <h4 className="font-semibold mb-3 text-accent">Threat Detection</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Detection Rate</span>
                            <span className="font-semibold">98.5%</span>
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-2">
                            <div className="bg-accent h-2 rounded-full" style={{ width: '98.5%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-card/30 backdrop-blur-md border border-border p-6 rounded-xl">
                    <h4 className="font-semibold mb-3 text-primary">Response Time</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Avg. Response</span>
                            <span className="font-semibold">2.3s</span>
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="bg-card/30 backdrop-blur-md border border-border p-6 rounded-xl">
                    <h4 className="font-semibold mb-3 text-yellow-500">System Health</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Uptime</span>
                            <span className="font-semibold">99.9%</span>
                        </div>
                        <div className="w-full bg-background/50 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
