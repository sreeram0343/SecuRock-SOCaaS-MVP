
"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ShieldAlert, ShieldCheck } from "lucide-react"

interface Narrative {
    id: string;
    timestamp: string;
    message: string;
    risk_level: string;
}

export default function NarrativeFeed() {
    const [narratives, setNarratives] = useState<Narrative[]>([
        { id: "1", timestamp: new Date().toISOString(), message: "System initialized. Monitoring active.", risk_level: "low" }
    ]);

    useEffect(() => {
        // Mock WebSocket for MVP Demo or connect to real endpoint
        const ws = new WebSocket("ws://localhost:8000/ws/alerts"); // Adjust if needed

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Transform backend alert to narrative format if needed
                const newNarrative: Narrative = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    message: data.message || "New security event detected",
                    risk_level: data.severity || "info"
                };
                setNarratives(prev => [newNarrative, ...prev].slice(0, 50));
            } catch (e) {
                console.error("WS Parse Error", e);
            }
        };

        return () => ws.close();
    }, []);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Live Narrative Feed</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                        {narratives.map((item) => (
                            <div key={item.id} className="flex gap-3 p-3 border rounded-lg bg-muted/50">
                                <div className="mt-1">
                                    {item.risk_level === "high" || item.risk_level === "critical" ?
                                        <ShieldAlert className="text-red-500 h-5 w-5" /> :
                                        <ShieldCheck className="text-green-500 h-5 w-5" />
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{item.message}</p>
                                    <span className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
