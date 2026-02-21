import { CheckCircle2, BellRing, Bot, ClipboardCheck } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const trustSignals = [
    {
        label: "Operational Focus",
        value: "MTTD/MTTR Reduction",
        detail: "Detection and response workflows are tuned for measurable cycle-time improvement.",
        icon: BellRing,
    },
    {
        label: "Service Delivery",
        value: "Analyst + AI Model",
        detail: "Automation accelerates triage; analysts retain judgment and escalation control.",
        icon: Bot,
    },
    {
        label: "Governance",
        value: "Audit-Ready Reporting",
        detail: "Incident timelines and control evidence mapped for enterprise and regulated buyers.",
        icon: ClipboardCheck,
    },
    {
        label: "Architecture",
        value: "Cloud + On-Prem Coverage",
        detail: "Unified telemetry from endpoint, identity, network, and cloud control plane sources.",
        icon: CheckCircle2,
    },
];

export default function TrustSection() {
    return (
        <section className="relative z-10 py-12 text-foreground">
            <div className="container mx-auto px-4">
                <div className="mb-8 max-w-3xl">
                    <ScrollReveal variant="fadeUp">
                        <h2 className="text-3xl font-bold md:text-4xl">Built for security outcomes, not alert volume.</h2>
                    </ScrollReveal>
                    <ScrollReveal variant="fadeUp" delay={0.1}>
                        <p className="mt-3 text-muted-foreground">
                            SecuRock is designed around practical SOC operations: prioritize real threats, reduce analyst overload, and maintain decision-quality under pressure.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {trustSignals.map((item, index) => (
                        <ScrollReveal key={item.label} variant="fadeUp" delay={index * 0.08}>
                            <div className="h-full p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{item.label}</p>
                                <h3 className="mt-1 text-xl font-bold text-card-foreground">{item.value}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
