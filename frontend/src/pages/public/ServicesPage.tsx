import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Eye, Zap, ShieldAlert, FileText, Laptop, Server, Search, Bug } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

const services = [
    { title: "24x7 Monitoring", icon: Eye, desc: "Continuous monitoring with layered alerting and escalation." },
    { title: "Threat Detection", icon: ShieldAlert, desc: "Rule, behavior, and anomaly-based detections with triage context." },
    { title: "Incident Response", icon: Zap, desc: "Runbooks for containment, remediation guidance, and stakeholder communication." },
    { title: "Threat Hunting", icon: Search, desc: "Hypothesis-driven hunts for stealthy activity and weak signals." },
    { title: "Vulnerability Correlation", icon: Bug, desc: "Prioritize exploitable findings linked to observed attack behavior." },
    { title: "Compliance Reporting", icon: FileText, desc: "Evidence-backed reporting support for ISO 27001 and GDPR readiness." },
    { title: "Endpoint Coverage", icon: Laptop, desc: "Visibility into workstation and server activity for compromise detection." },
    { title: "Cloud Security Operations", icon: Server, desc: "CloudTrail, identity, and control-plane analysis across major providers." },
];

export default function ServicesPage() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-transparent text-foreground">
            <AnimatedBackground />
            <Navbar />

            <main className="container relative z-10 mx-auto flex-grow px-4 pb-12 pt-32">
                <ScrollReveal variant="fadeUp">
                    <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                        SOC <span className="text-securock-blue">Service Catalog</span>
                    </h1>
                    <p className="mb-12 max-w-3xl text-xl text-gray-300">
                        End-to-end SOC services covering detection, investigation, response, and reporting workflows.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {services.map((service, index) => (
                        <ScrollReveal key={service.title} variant="fadeUp" delay={index * 0.06}>
                            <GlassCard variant="hover-shine" className="h-full border-securock-blue/10 bg-securock-navy-light/30 p-6">
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-securock-navy">
                                    <service.icon className="h-5 w-5 text-securock-blue" />
                                </div>
                                <h3 className="mb-2 text-lg font-bold text-white">{service.title}</h3>
                                <p className="text-sm leading-relaxed text-gray-300">{service.desc}</p>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
