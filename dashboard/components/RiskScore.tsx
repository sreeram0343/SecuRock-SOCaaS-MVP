
"use client"

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts"

interface RiskScoreProps {
    score: number; // 0.0 to 1.0
}

export default function RiskScore({ score }: RiskScoreProps) {
    const percentage = Math.round(score * 100);

    let fill = "#22c55e"; // Green
    if (percentage > 70) fill = "#ef4444"; // Red
    else if (percentage > 30) fill = "#eab308"; // Yellow

    const data = [{ name: "Risk", value: percentage, fill: fill }];

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-card rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Current Risk Score</h3>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        innerRadius="80%"
                        outerRadius="100%"
                        barSize={10}
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                        <RadialBar background dataKey="value" cornerRadius={30} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-[-80px] text-4xl font-bold text-foreground">
                {percentage}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
                AI-Calibrated Security Posture
            </p>
        </div>
    )
}
