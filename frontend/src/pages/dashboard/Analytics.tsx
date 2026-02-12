

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Analytics() {
    const severityData = [
        { name: 'Critical', value: 5, color: '#ef4444' }, // destructive
        { name: 'High', value: 12, color: '#f97316' }, // orange-500
        { name: 'Medium', value: 25, color: '#eab308' }, // yellow-500
        { name: 'Low', value: 45, color: '#00D9FF' }, // electric blue
    ];

    const mttrData = [
        { day: 'Mon', minutes: 15 },
        { day: 'Tue', minutes: 22 },
        { day: 'Wed', minutes: 10 },
        { day: 'Thu', minutes: 18 },
        { day: 'Fri', minutes: 12 },
        { day: 'Sat', minutes: 8 },
        { day: 'Sun', minutes: 5 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-glow mb-2">Analytics & Reports</h1>
                <p className="text-muted-foreground">Deep insights into your security posture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-card/30 backdrop-blur-md border border-border hover:border-primary/50 transition-all shadow-lg shadow-black/20">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Alerts Severity Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={severityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {severityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(26, 31, 54, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', backdropFilter: 'blur(4px)' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card/30 backdrop-blur-md border border-border hover:border-primary/50 transition-all shadow-lg shadow-black/20">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Mean Time to Response (MTTR)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mttrData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" opacity={0.5} />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(26, 31, 54, 0.9)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', backdropFilter: 'blur(4px)' }}
                                    itemStyle={{ color: '#00D9FF' }}
                                    labelStyle={{ color: '#94a3b8' }}
                                />
                                <Line type="monotone" dataKey="minutes" stroke="#00D9FF" strokeWidth={3} dot={{ r: 4, fill: '#00D9FF' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card/30 backdrop-blur-md border border-border hover:border-primary/50 transition-all shadow-lg shadow-black/20">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Weekly Threat Volume</CardTitle>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-lg mx-6 mb-6 bg-background/20">
                    <p>Advanced AI analytics predictions coming soon...</p>
                </CardContent>
            </Card>
        </div>
    );
}

