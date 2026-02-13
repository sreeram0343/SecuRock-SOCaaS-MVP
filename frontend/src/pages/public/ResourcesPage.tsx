import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { FileText, Video, BookOpen, Download } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

const resources = [
    {
        type: "Whitepaper",
        title: "AI-Augmented SOC Operations: Design and Implementation",
        summary: "A practical framework for combining analyst workflow with AI-based prioritization.",
        icon: FileText,
    },
    {
        type: "Webinar",
        title: "Reducing MTTD and MTTR in Mid-Market Environments",
        summary: "Execution patterns for alert triage, escalation, and response playbook maturity.",
        icon: Video,
    },
    {
        type: "Guide",
        title: "Security Monitoring Baseline for Cloud-First Teams",
        summary: "Minimum telemetry, detections, and escalation controls for modern workloads.",
        icon: BookOpen,
    },
    {
        type: "Case Brief",
        title: "SOC Service Model Selection for SMB and Fintech",
        summary: "How to choose between fully managed, hybrid SOC, and IR retainer models.",
        icon: Download,
    },
];

export default function ResourcesPage() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-transparent text-foreground">
            <AnimatedBackground />
            <Navbar />

            <main className="container relative z-10 mx-auto flex-grow px-4 pb-12 pt-32">
                <ScrollReveal variant="fadeUp">
                    <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                        Security <span className="text-securock-blue">Resources</span>
                    </h1>
                    <p className="mb-12 max-w-3xl text-xl text-gray-300">
                        Reference material designed for CISOs, SOC managers, and technical buyers evaluating managed security operations.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {resources.map((resource, i) => (
                        <ScrollReveal key={resource.title} variant="fadeUp" delay={i * 0.08}>
                            <GlassCard className="group h-full p-6 transition-colors hover:border-securock-blue/50">
                                <div className="mb-4 inline-flex rounded-xl bg-white/5 p-3 transition-colors group-hover:bg-securock-blue/10">
                                    <resource.icon className="h-7 w-7 text-gray-300 group-hover:text-securock-blue" />
                                </div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-securock-blue">{resource.type}</div>
                                <h3 className="mb-2 text-xl font-bold text-white">{resource.title}</h3>
                                <p className="text-sm text-gray-300">{resource.summary}</p>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
