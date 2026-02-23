import { ShieldCheck, Clock3, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
"use client";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/animations/ScrollReveal";
import GlassCard from "@/components/ui/glass-card";

const proofPoints = [
    "24x7 analyst-led monitoring with AI-assisted triage",
    "Cloud and on-prem telemetry correlation in a single SOC workflow",
    "ISO 27001 and GDPR-ready reporting artifacts",
];

export default function HeroSection() {
    const router = useRouter();

    return (
        <section className="relative z-10 pt-32 md:pt-40 pb-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <ScrollReveal variant="fadeUp">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium">
                        <ShieldCheck className="h-4 w-4" />
                        SecuRock SOC Services
                    </div>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.1}>
                    <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-br from-white via-gray-100 to-securock-blue bg-clip-text text-transparent drop-shadow-sm md:text-7xl">
                        AI-powered SOC operations with human-led incident response.
                    </h1>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                    <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                        SecuRock helps security teams reduce alert fatigue, improve MTTD/MTTR, and operationalize continuous monitoring across cloud, identity, endpoint, and network environments.
                    </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.3}>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Button
                            size="lg"
                            className="bg-securock-blue text-securock-navy hover:bg-securock-blue/90 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all font-semibold"
                            onClick={() => router.push("/signup")}
                        >
                            Request Demo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-card text-foreground hover:bg-accent border-border"
                            onClick={() => router.push("/pricing")}
                        >
                            View Pricing
                        </Button>
                    </div>
                </ScrollReveal>

                <div className="mt-12 grid gap-4 md:grid-cols-3">
                    {proofPoints.map((item, idx) => (
                        <ScrollReveal key={item} variant="fadeUp" delay={0.35 + idx * 0.08}>
                            <GlassCard variant="hover-shine" className="h-full px-5 py-4 text-sm font-medium text-gray-200">
                                {item}
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal variant="fadeUp" delay={0.5}>
                    <div className="mt-10 grid gap-4 text-sm text-muted-foreground md:grid-cols-3 border-t border-border pt-8">
                        <div className="flex items-center gap-2">
                            <Clock3 className="h-5 w-5 text-primary" />
                            Coverage options: 8x5, 16x7, 24x7
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-primary" />
                            AI-assisted detection and triage workflows
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Analyst-validated incident response actions
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
