import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Building2, HeartPulse, Landmark, GraduationCap, Rocket } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

const industries = [
    {
        title: "Small and Medium Businesses",
        icon: Building2,
        desc: "Need enterprise-grade detection and response without the cost of building a full internal SOC.",
    },
    {
        title: "Fintech",
        icon: Landmark,
        desc: "Require high-confidence detections, strong audit trails, and response discipline around identity and transaction risk.",
    },
    {
        title: "Healthcare",
        icon: HeartPulse,
        desc: "Need ransomware resilience, uptime protection, and defensible incident documentation for sensitive environments.",
    },
    {
        title: "Educational Institutions",
        icon: GraduationCap,
        desc: "Must defend distributed users and endpoints while operating with constrained cybersecurity staffing.",
    },
    {
        title: "Cloud-Native Startups",
        icon: Rocket,
        desc: "Need rapid onboarding and cross-cloud visibility that supports delivery velocity and investor diligence.",
    },
];

export default function SolutionsPage() {
    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-transparent text-foreground">
            <AnimatedBackground />
            <Navbar />

            <main className="container relative z-10 mx-auto flex-grow px-4 pb-12 pt-32">
                <ScrollReveal variant="fadeUp">
                    <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                        Industry <span className="text-securock-blue">Solutions</span>
                    </h1>
                    <p className="mb-12 max-w-3xl text-xl text-gray-300">
                        Detection and response programs mapped to each sector's operating constraints, compliance obligations, and threat profile.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {industries.map((industry, i) => (
                        <ScrollReveal key={industry.title} variant="fadeUp" delay={i * 0.08}>
                            <GlassCard className="h-full bg-securock-navy-light/40 p-7">
                                <industry.icon className="mb-4 h-9 w-9 text-securock-blue" />
                                <h3 className="mb-3 text-2xl font-bold text-white">{industry.title}</h3>
                                <p className="text-gray-300">{industry.desc}</p>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
