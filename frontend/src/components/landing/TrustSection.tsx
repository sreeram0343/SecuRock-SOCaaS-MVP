import { Shield, Lock, Award, Activity } from "lucide-react";
import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function TrustSection() {
    const stats = [
        { label: "Threats Neutralized", value: "1M+", icon: Shield },
        { label: "AI Accuracy", value: "99.8%", icon: Activity },
        { label: "Compliance", value: "SOC2 Type II", icon: Award },
        { label: "Data Processed", value: "1PB+", icon: Lock },
    ];

    return (
        <section className="py-12 relative z-10 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <ScrollReveal key={index} variant="scaleUp" delay={index * 0.1}>
                            <GlassCard variant="hover-shine" className="flex flex-col items-center text-center p-6 bg-securock-navy-light/40">
                                <div className="mb-4 p-3 rounded-full bg-securock-blue/10 text-securock-blue">
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
