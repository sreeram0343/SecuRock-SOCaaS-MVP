import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Eye, Zap, ShieldAlert, FileText, Laptop, Server } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

export default function ServicesPage() {
    const services = [
        { title: "24/7 Monitoring", icon: Eye, desc: "Continuous surveillance of your digital environment." },
        { title: "Incident Response", icon: Zap, desc: "Rapid containment and remediation of security threats." },
        { title: "Threat Intelligence", icon: ShieldAlert, desc: "Proactive defense powered by global threat data." },
        { title: "Compliance Reporting", icon: FileText, desc: "Automated reports for GDPR, SOC2, and HIPAA." },
        { title: "Endpoint Security", icon: Laptop, desc: "Advanced protection for all network endpoints." },
        { title: "Cloud Security", icon: Server, desc: "Securing your infrastructure across AWS, Azure, and GCP." },
    ];

    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative flex flex-col">
            <AnimatedBackground />
            <Navbar />

            <main className="flex-grow container mx-auto px-4 pt-32 pb-12 relative z-10">
                <ScrollReveal variant="fadeUp">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Our <span className="text-securock-blue">Services</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mb-12">
                        Comprehensive protection for every layer of your technology stack.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ScrollReveal key={index} variant="fadeUp" delay={index * 0.1}>
                            <GlassCard
                                variant="hover-shine"
                                className="p-8 h-full bg-securock-navy-light/30 border-securock-blue/10"
                            >
                                <div className="w-12 h-12 rounded-lg bg-securock-navy border border-white/10 flex items-center justify-center mb-6">
                                    <service.icon className="w-6 h-6 text-securock-blue" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {service.desc}
                                </p>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
