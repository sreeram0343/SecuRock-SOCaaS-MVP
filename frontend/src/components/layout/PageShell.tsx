import AnimatedBackground from "@/components/layout/AnimatedBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { useLocation } from "react-router-dom";

export default function PageShell() {
    const { pathname } = useLocation();
    const title = pathname
        .split('/')
        .filter(Boolean)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ')
        || "SecuRock";

    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative flex flex-col">
            <AnimatedBackground />

            <Navbar />

            <main className="flex-grow container mx-auto px-4 pt-32 pb-12 relative z-10">
                <ScrollReveal variant="fadeUp">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {title}
                    </h1>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                    <GlassCard className="p-8 md:p-12 min-h-[400px]">
                        <p className="text-xl text-gray-300 mb-6">
                            This section is currently being updated.
                        </p>
                        <div className="h-px w-full bg-white/10 my-8" />
                        <p className="text-gray-400">
                            For immediate information about SOC services, visit the main pages:
                            Platform, Solutions, Services, Resources, and Pricing. For direct assistance,
                            contact <span className="text-securock-blue">sales@securock.com</span>.
                        </p>
                    </GlassCard>
                </ScrollReveal>
            </main>

            <Footer />
        </div>
    );
}
