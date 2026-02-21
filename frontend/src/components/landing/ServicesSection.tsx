import {
    Eye,
    ShieldAlert,
    Search,
    Microscope,
    Bug,
    Cpu,
    Server,
    FileCheck2,
} from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";

const services = [
    {
        title: "24x7 Real-Time Monitoring",
        description: "Continuous monitoring across cloud, endpoint, identity, and network telemetry.",
        icon: Eye,
    },
    {
        title: "Threat Detection & Triage",
        description: "Correlation, risk-based prioritization, and analyst-reviewed escalation.",
        icon: ShieldAlert,
    },
    {
        title: "Incident Investigation",
        description: "Structured investigation workflow with evidence capture and timelineing.",
        icon: Search,
    },
    {
        title: "Threat Hunting",
        description: "Proactive hunts using hypothesis-led queries and behavior-based indicators.",
        icon: Microscope,
    },
    {
        title: "Vulnerability Correlation",
        description: "Exploitability context linking vulnerability data with active detections.",
        icon: Bug,
    },
    {
        title: "Compliance Reporting",
        description: "ISO 27001 and GDPR-ready reporting artifacts for internal and external review.",
        icon: FileCheck2,
    },
];

const flow = [
    "Log Sources",
    "Collection Agents",
    "SIEM Correlation",
    "AI Detection Layer",
    "Analyst Review",
    "Response & Report",
];

export default function ServicesSection() {
    return (
        <section className="relative z-10 overflow-hidden py-20 text-foreground">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <ScrollReveal variant="fadeUp">
                        <h2 className="text-3xl font-bold md:text-5xl">
                            SOC capabilities mapped to real incident operations.
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal variant="fadeUp" delay={0.1}>
                        <p className="mt-4 text-lg text-muted-foreground">
                            SecuRock combines SIEM operations, AI-assisted analytics, and analyst-led incident response into one managed service model.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service, index) => (
                        <ScrollReveal key={service.title} variant="fadeUp" delay={index * 0.08}>
                            <div className="h-full rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow p-8">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
                                    <service.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-card-foreground">{service.title}</h3>
                                <p className="leading-relaxed text-muted-foreground">{service.description}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal variant="fadeUp" delay={0.15}>
                    <div className="mt-12 rounded-xl border border-border bg-card shadow-sm p-6 md:p-8">
                        <div className="mb-5 flex items-center gap-2 text-primary">
                            <Server className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-wide">Architecture Flow</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-6 md:items-center md:gap-2">
                            {flow.map((step, index) => (
                                <div key={step} className="flex items-center gap-2 md:justify-center">
                                    <div className="rounded-md border border-border bg-muted px-3 py-2 text-xs font-semibold text-foreground md:w-full md:text-center">
                                        {step}
                                    </div>
                                    {index < flow.length - 1 && (
                                        <span className="hidden text-muted-foreground md:inline">-&gt;</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground border-t border-border pt-4">
                            <Cpu className="h-4 w-4 text-primary" />
                            AI layer enriches and prioritizes alerts before analyst validation and response action.
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
