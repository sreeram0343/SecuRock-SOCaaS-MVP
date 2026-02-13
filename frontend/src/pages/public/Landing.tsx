import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import ServicesSection from "@/components/landing/ServicesSection";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const serviceModels = [
    {
        title: "Fully Managed SOCaaS",
        description: "SecuRock manages monitoring, triage, investigation, and response communication end-to-end.",
    },
    {
        title: "Hybrid SOC",
        description: "Shared operating model where client teams retain control of selected response workflows.",
    },
    {
        title: "Mini-SOC for SMB",
        description: "Pre-configured onboarding with managed triage and periodic risk reporting for smaller teams.",
    },
    {
        title: "IR Retainer",
        description: "Priority incident surge support and forensic investigation during active security events.",
    },
];

const markets = ["SMBs", "Fintech", "Healthcare", "Educational Institutions", "Cloud-Native Startups"];

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-transparent text-foreground">
            <AnimatedBackground />
            <Navbar />

            <main>
                <HeroSection />
                <TrustSection />
                <ServicesSection />

                <section className="relative z-10 py-14">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-end justify-between gap-6">
                            <div>
                                <ScrollReveal variant="fadeUp">
                                    <h2 className="text-3xl font-bold text-white md:text-4xl">Flexible service models by security maturity.</h2>
                                </ScrollReveal>
                                <ScrollReveal variant="fadeUp" delay={0.1}>
                                    <p className="mt-3 max-w-3xl text-gray-300">
                                        Choose an operating model based on your team capacity, compliance requirements, and required response coverage.
                                    </p>
                                </ScrollReveal>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {serviceModels.map((model, idx) => (
                                <ScrollReveal key={model.title} variant="fadeUp" delay={idx * 0.08}>
                                    <GlassCard className="h-full bg-securock-navy-light/35 p-6">
                                        <h3 className="text-xl font-semibold text-white">{model.title}</h3>
                                        <p className="mt-2 text-gray-300">{model.description}</p>
                                    </GlassCard>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="relative z-10 py-8">
                    <div className="container mx-auto px-4">
                        <ScrollReveal variant="fadeUp">
                            <GlassCard className="bg-securock-navy-light/40 p-6 md:p-8">
                                <p className="text-sm uppercase tracking-wider text-securock-blue">Target Markets</p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {markets.map((item) => (
                                        <span key={item} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-200">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </GlassCard>
                        </ScrollReveal>
                    </div>
                </section>

                <section className="relative z-10 py-16">
                    <div className="container mx-auto px-4">
                        <ScrollReveal variant="fadeUp">
                            <div className="rounded-2xl border border-securock-blue/30 bg-gradient-to-r from-securock-blue/15 to-securock-green/10 p-8 md:p-12">
                                <h2 className="max-w-3xl text-3xl font-bold text-white md:text-4xl">
                                    Build a SOC operating model that scales with your business.
                                </h2>
                                <p className="mt-4 max-w-2xl text-gray-200">
                                    Start with baseline monitoring and evolve to advanced detection engineering, threat hunting, and response automation without replacing your stack.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <Button className="bg-securock-blue text-securock-navy hover:bg-securock-blue/90" onClick={() => navigate("/signup")}>
                                        Book Assessment
                                    </Button>
                                    <Button variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10" onClick={() => navigate("/services/threat-detection")}>
                                        Explore Services
                                    </Button>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
