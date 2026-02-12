import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Server, Shield, Lock, Activity } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

export default function PlatformPage() {
    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative flex flex-col">
            <AnimatedBackground />
            <Navbar />

            <main className="flex-grow container mx-auto px-4 pt-32 pb-12 relative z-10">
                <ScrollReveal variant="fadeUp">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        SecuRock <span className="text-securock-blue">Platform</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mb-12">
                        A unified security operations platform designed for the modern enterprise.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ScrollReveal variant="fadeUp" delay={0.1}>
                        <GlassCard className="p-8 h-full bg-securock-navy-light/40">
                            <Server className="w-12 h-12 text-securock-blue mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Cloud-Native Architecture</h2>
                            <p className="text-gray-400">
                                Scalable infrastructure that grows with your business, supporting hybrid and multi-cloud environments.
                            </p>
                        </GlassCard>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeUp" delay={0.2}>
                        <GlassCard className="p-8 h-full bg-securock-navy-light/40">
                            <Activity className="w-12 h-12 text-securock-green mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Real-Time Analytics</h2>
                            <p className="text-gray-400">
                                Advanced machine learning algorithms that detect anomalies and threats in milliseconds.
                            </p>
                        </GlassCard>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeUp" delay={0.3}>
                        <GlassCard className="p-8 h-full bg-securock-navy-light/40">
                            <Shield className="w-12 h-12 text-securock-gold mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Automated Response</h2>
                            <p className="text-gray-400">
                                Playbook-driven automation to contain threats instantly without human intervention.
                            </p>
                        </GlassCard>
                    </ScrollReveal>

                    <ScrollReveal variant="fadeUp" delay={0.4}>
                        <GlassCard className="p-8 h-full bg-securock-navy-light/40">
                            <Lock className="w-12 h-12 text-rose-500 mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Zero Trust Security</h2>
                            <p className="text-gray-400">
                                Verify every request, identity, and device accessing your network and applications.
                            </p>
                        </GlassCard>
                    </ScrollReveal>
                </div>
            </main>
            <Footer />
        </div>
    );
}
