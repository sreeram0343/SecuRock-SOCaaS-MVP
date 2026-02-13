import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Database, Network, Bot, Workflow, ShieldCheck, Cloud } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

const pillars = [
    {
        title: "Unified Telemetry Ingestion",
        icon: Database,
        description: "Collect endpoint, network, identity, and cloud logs through agents, syslog, and API connectors.",
    },
    {
        title: "SIEM Correlation Layer",
        icon: Network,
        description: "Normalize and correlate events across sources to identify high-fidelity detections.",
    },
    {
        title: "AI Detection Layer",
        icon: Bot,
        description: "Apply anomaly scoring and contextual prioritization before analyst triage.",
    },
    {
        title: "SOAR-Style Workflows",
        icon: Workflow,
        description: "Automate enrichment, ticketing, and selected containment actions through playbooks.",
    },
    {
        title: "Analyst-Led Operations",
        icon: ShieldCheck,
        description: "L1 and L2 analysts validate alerts, investigate incidents, and execute response workflows.",
    },
    {
        title: "Hybrid Deployment",
        icon: Cloud,
        description: "Support cloud-native and on-prem environments without forcing a single-vendor architecture.",
    },
];

export default function PlatformPage() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-transparent text-foreground">
            <AnimatedBackground />
            <Navbar />

            <main className="container relative z-10 mx-auto flex-grow px-4 pb-12 pt-32">
                <ScrollReveal variant="fadeUp">
                    <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                        SecuRock <span className="text-securock-blue">Platform Architecture</span>
                    </h1>
                    <p className="mb-12 max-w-3xl text-xl text-gray-300">
                        Built as a practical SOC operations platform where data ingestion, detection engineering, analyst workflow, and incident response are integrated end-to-end.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pillars.map((pillar, i) => (
                        <ScrollReveal key={pillar.title} variant="fadeUp" delay={i * 0.08}>
                            <GlassCard className="h-full bg-securock-navy-light/40 p-7">
                                <pillar.icon className="mb-4 h-10 w-10 text-securock-blue" />
                                <h2 className="mb-3 text-xl font-bold text-white">{pillar.title}</h2>
                                <p className="text-gray-300">{pillar.description}</p>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                    <GlassCard className="mt-10 bg-securock-navy-light/35 p-6 md:p-8">
                        <h3 className="text-xl font-semibold text-white">Reference Stack</h3>
                        <p className="mt-3 text-gray-300">
                            SIEM: Wazuh/OpenSearch, IDS/IPS: Suricata, cloud connectors for AWS/Azure/GCP, AI-assisted anomaly models, and playbook-driven automation for response workflows.
                        </p>
                    </GlassCard>
                </ScrollReveal>
            </main>
            <Footer />
        </div>
    );
}
