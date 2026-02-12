
import { useEffect } from 'react';
import { useAlertStore } from '@/store/alertStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Alerts() {
    const { alerts, fetchAlerts, updateAlertStatus, isLoading } = useAlertStore();

    useEffect(() => {
        fetchAlerts();
        // Simulate real-time by polling for demo (in real app use WebSockets)
        const interval = setInterval(fetchAlerts, 10000);
        return () => clearInterval(interval);
    }, [fetchAlerts]);

    const severityColors: Record<string, string> = {
        critical: 'bg-destructive/20 text-destructive border-destructive/50',
        high: 'bg-orange-500/20 text-orange-500 border-orange-500/50',
        medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
        low: 'bg-primary/20 text-primary border-primary/50',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-glow mb-2">Security Alerts</h1>
                    <p className="text-muted-foreground">Monitor and respond to security threats</p>
                </div>
                <Button
                    onClick={() => fetchAlerts()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-4">
                {['critical', 'high', 'medium', 'low'].map((severity) => {
                    const count = alerts.filter(a => a.severity === severity).length;
                    return (
                        <div key={severity} className="bg-card/30 backdrop-blur-md border border-border p-4 rounded-lg">
                            <div className="text-sm text-muted-foreground capitalize">{severity}</div>
                            <div className="text-2xl font-bold mt-1">{count}</div>
                        </div>
                    );
                })}
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
                {isLoading && alerts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 bg-card/30 backdrop-blur-md border border-border rounded-xl">
                        <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                        Loading alerts...
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 bg-card/30 backdrop-blur-md border border-border rounded-xl">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No alerts found</p>
                        <p className="text-xs mt-1">Your system is secure</p>
                    </div>
                ) : (
                    alerts.map((alert, index) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="bg-card/30 backdrop-blur-md border-border hover:border-primary/50 transition-all">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityColors[alert.severity] || severityColors.low}`}>
                                            {alert.severity.toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-2">{alert.description}</p>
                                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                                <span className="flex items-center">
                                                    <Clock size={12} className="mr-1" />
                                                    {new Date(alert.created_at).toLocaleString()}
                                                </span>
                                                <span>Source: {alert.source_ip}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        {alert.status === 'new' && (
                                            <Button
                                                size="sm"
                                                onClick={() => updateAlertStatus(alert.id, 'acknowledged')}
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                                            >
                                                Acknowledge
                                            </Button>
                                        )}
                                        {alert.status === 'acknowledged' && (
                                            <div className="flex items-center text-accent text-sm font-medium">
                                                <CheckCircle size={16} className="mr-2" /> Acknowledged
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
