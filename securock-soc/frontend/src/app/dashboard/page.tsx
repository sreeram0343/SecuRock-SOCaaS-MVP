'use client';

import { useEffect, useState } from 'react';
import ChatBar from '@/components/ChatBar';
import NarrativeCard from '@/components/NarrativeCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import api from '@/lib/api';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e']; // Critical, High, Medium, Low

export default function Dashboard() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setMetrics({
                severityDistribution: [
                    { name: 'Critical', value: 4 },
                    { name: 'High', value: 12 },
                    { name: 'Medium', value: 24 },
                    { name: 'Low', value: 45 },
                ],
                hostRisks: [
                    { host: 'web-prod-1', risk: 85 },
                    { host: 'db-master', risk: 65 },
                    { host: 'auth-svc', risk: 42 },
                    { host: 'worker-node-3', risk: 20 },
                ],
                timeline: [
                    { time: '10:42 AM', event: 'Multiple failed SSH logins', host: 'web-prod-1', severity: 'HIGH' },
                    { time: '10:45 AM', event: 'Unusual outbound traffice', host: 'web-prod-1', severity: 'CRITICAL' },
                    { time: '11:12 AM', event: 'Privilege escalation attempt', host: 'db-master', severity: 'HIGH' },
                ],
                narratives: [
                    { host: 'web-prod-1', riskScore: 85, severity: 'CRITICAL', summary: 'Host web-prod-1 is experiencing a coordinated brute force attack followed by unusual outbound data transfer. Recommended action: Isolate host and rotate SSH keys immediately.' },
                    { host: 'db-master', riskScore: 65, severity: 'HIGH', summary: 'Potential SQL injection pattern detected in web logs correlating with unauthorized access attempts to the database schema. Recommended action: Review WAF rules and audit DB access logs.' }
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="flex h-[80vh] items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4 text-muted-foreground">Severity Distribution</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.severityDistribution}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {metrics.severityDistribution.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-card border border-border p-5 rounded-xl shadow-sm lg:col-span-2">
                    <h3 className="font-semibold mb-4 text-muted-foreground">Top Host Risks</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.hostRisks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <XAxis dataKey="host" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    cursor={{ fill: 'hsl(var(--muted))' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                />
                                <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
                                    {metrics.hostRisks.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.risk > 80 ? '#ef4444' : entry.risk > 60 ? '#f97316' : '#eab308'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4 text-muted-foreground flex items-center justify-between">
                        <span>Incident Timeline</span>
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Live</span>
                    </h3>
                    <div className="space-y-4">
                        {metrics.timeline.map((event: any, i: number) => (
                            <div key={i} className="flex gap-4 border-l-2 border-primary/30 pl-4 py-1 relative">
                                <div className="absolute w-2 h-2 rounded-full bg-primary -left-[5px] top-2"></div>
                                <div>
                                    <div className="text-xs text-muted-foreground">{event.time}</div>
                                    <div className="text-sm font-medium mt-1">{event.event}</div>
                                    <div className="text-xs text-primary mt-1">{event.host}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-muted-foreground">AI Incident Narratives</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {metrics.narratives.map((nar: any, i: number) => (
                            <NarrativeCard key={i} {...nar} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-6 left-[50%] -translate-x-1/2 w-[calc(100%-3rem)] max-w-[1280px] px-6 flex justify-center z-50">
                <ChatBar />
            </div>
            <div className="h-24"></div>
        </div>
    );
}
