import { ShieldCheck, Clock3, Cpu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "@/components/animations/ScrollReveal";

const proofPoints = [
    "24x7 analyst-led monitoring with AI-assisted triage",
    "Cloud and on-prem telemetry correlation in a single SOC workflow",
    "ISO 27001 and GDPR-ready reporting artifacts",
];

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="relative z-10 pt-32 md:pt-40 pb-16">
            <div className="mx-auto max-w-7xl px-4 md:px-6">
                <ScrollReveal variant="fadeUp">
                    <div className="inline-flex items-center gap-2 rounded-full border border-securock-blue/35 bg-securock-blue/10 px-4 py-1.5 text-sm text-securock-blue">
                        <ShieldCheck className="h-4 w-4" />
                        SecuRock SOC Services
                    </div>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.1}>
                    <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
                        AI-powered SOC operations with human-led incident response.
                    </h1>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.2}>
                    <p className="mt-6 max-w-3xl text-lg text-gray-300 md:text-xl">
                        SecuRock helps security teams reduce alert fatigue, improve MTTD/MTTR, and operationalize continuous monitoring across cloud, identity, endpoint, and network environments.
                    </p>
                </ScrollReveal>

                <ScrollReveal variant="fadeUp" delay={0.3}>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                        <Button
                            size="lg"
                            className="bg-securock-blue text-securock-navy hover:bg-securock-blue/90"
                            onClick={() => navigate("/signup")}
                        >
                            Request Demo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                            onClick={() => navigate("/pricing")}
                        >
                            View Pricing
                        </Button>
                    </div>
                </ScrollReveal>

                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {proofPoints.map((item, idx) => (
                        <ScrollReveal key={item} variant="fadeUp" delay={0.35 + idx * 0.08}>
                            <div className="rounded-xl border border-white/10 bg-securock-navy-light/35 px-4 py-3 text-sm text-gray-200">
                                {item}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal variant="fadeUp" delay={0.5}>
                    <div className="mt-10 grid gap-4 text-sm text-gray-300 md:grid-cols-3">
                        <div className="flex items-center gap-2">
                            <Clock3 className="h-4 w-4 text-securock-blue" />
                            Coverage options: 8x5, 16x7, 24x7
                        </div>
                        <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-securock-green" />
                            AI-assisted detection and triage workflows
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-securock-gold" />
                            Analyst-validated incident response actions
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
