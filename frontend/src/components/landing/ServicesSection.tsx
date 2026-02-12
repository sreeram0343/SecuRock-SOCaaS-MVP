import { Eye, ShieldAlert, FileText, Zap, Map as MapIcon, Server } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";

const services = [
    {
        title: "AI Anomaly Detection",
        description: "Unsupervised machine learning models (Isolation Forest) detect zero-day threats in real-time.",
        icon: Eye,
    },
    {
        title: "Live Attack Map",
        description: "Visualize global threat origins and targets on an interactive, real-time 3D map.",
        icon: MapIcon, // Renamed from Map
    },
    {
        title: "Automated Response",
        description: "Instantaneous threat neutralization via automated containment playbooks.",
        icon: Zap,
    },
    {
        title: "SIEM Integration",
        description: "Seamlessly ingest logs from any source with our high-throughput data pipeline.",
        icon: Server,
    },
    {
        title: "Threat Intelligence",
        description: "Enriched alerts with real-time IP reputation and threat feed correlation.",
        icon: ShieldAlert,
    },
    {
        title: "Compliance Ready",
        description: "Built-in reporting for SOC2, HIPAA, and GDPR compliance.",
        icon: FileText,
    },
];

export default function ServicesSection() {
    return (
        <section className="py-24 relative z-10 overflow-hidden text-white">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-securock-blue/10 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 bg-securock-green/10 rounded-full blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <ScrollReveal variant="fadeUp">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Comprehensive <span className="text-securock-blue">Security Services</span>
                        </h2>
                    </ScrollReveal>
                    <ScrollReveal variant="fadeUp" delay={0.2}>
                        <p className="text-gray-400 text-lg">
                            Our SOCaaS platform delivers enterprise-grade protection tailored to your specific needs.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ScrollReveal key={index} variant="fadeUp" delay={index * 0.1}>
                            <GlassCard
                                variant="hover-shine"
                                className="p-8 h-full bg-securock-navy-light/30"
                            >
                                <div className="w-12 h-12 rounded-lg bg-securock-navy border border-white/10 flex items-center justify-center mb-6 group-hover:border-securock-blue/50 group-hover:scale-110 transition-all duration-300">
                                    <service.icon className="w-6 h-6 text-securock-blue group-hover:text-securock-green" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-securock-blue transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {service.description}
                                </p>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
