import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { FileText, Video, BookOpen, Download } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

export default function ResourcesPage() {
    const resources = [
        { type: "Whitepaper", title: "The State of Cloud Security 2024", icon: FileText },
        { type: "Webinar", title: "Live Threat Hunting Demo", icon: Video },
        { type: "Guide", title: "SOC2 Compliance Checklist", icon: BookOpen },
        { type: "Case Study", title: "FinTech Giant Secures 10M+ Users", icon: Download },
    ];

    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative flex flex-col">
            <AnimatedBackground />
            <Navbar />

            <main className="flex-grow container mx-auto px-4 pt-32 pb-12 relative z-10">
                <ScrollReveal variant="fadeUp">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Security <span className="text-securock-blue">Resources</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mb-12">
                        Expert insights, guides, and tools to strengthen your security posture.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {resources.map((res, i) => (
                        <ScrollReveal key={i} variant="fadeUp" delay={i * 0.1}>
                            <GlassCard className="p-6 flex items-center gap-6 group hover:border-securock-blue/50 transition-colors">
                                <div className="p-4 bg-white/5 rounded-xl group-hover:bg-securock-blue/10 transition-colors">
                                    <res.icon className="w-8 h-8 text-gray-300 group-hover:text-securock-blue" />
                                </div>
                                <div>
                                    <div className="text-sm text-securock-blue font-semibold uppercase tracking-wider mb-1">{res.type}</div>
                                    <h3 className="text-xl font-bold text-white">{res.title}</h3>
                                </div>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
