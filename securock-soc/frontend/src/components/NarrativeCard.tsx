import { AlertTriangle, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function NarrativeCard({
    host,
    riskScore,
    severity,
    summary
}: {
    host: string;
    riskScore: number;
    severity: string;
    summary: string;
}) {
    const isCritical = severity === 'CRITICAL';
    const isHigh = severity === 'HIGH';

    const Icon = isCritical ? ShieldAlert : isHigh ? AlertTriangle : ShieldCheck;
    const colorClass = isCritical ? 'text-destructive' : isHigh ? 'text-orange-500' : 'text-primary';
    const bgClass = isCritical ? 'bg-destructive/10' : isHigh ? 'bg-orange-500/10' : 'bg-primary/10';

    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4 hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${bgClass} ${colorClass}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{host}</h3>
                        <p className="text-xs text-muted-foreground">AI Incident Narrative</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">{riskScore.toFixed(0)}</div>
                    <div className={`text-xs font-bold tracking-wider ${colorClass}`}>{severity}</div>
                </div>
            </div>
            <div className="bg-background/50 rounded-lg p-3 text-sm leading-relaxed border border-border/50">
                {summary}
            </div>
        </div>
    );
}
