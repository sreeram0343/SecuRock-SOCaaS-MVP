import { HeroGeometric } from "@/components/ui/shape-landing-hero";

export default function HeroSection() {
    return (
        <section className="relative w-full">
            <HeroGeometric
                badge="SecuRock AI SOC"
                title1="Autonomous"
                title2="Cyber Defense"
                description="Elevate your security posture with SecuRock's AI-driven SOC. Real-time anomaly detection, instant threat neutralization, and a global attack visualization map."
            />
            {/* Overlay specific content if needed, but HeroGeometric handles most */}
        </section>
    );
}
