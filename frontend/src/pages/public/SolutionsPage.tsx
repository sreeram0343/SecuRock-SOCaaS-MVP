import GlassCard from "@/components/ui/glass-card";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { ShoppingBag, Globe } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";

export default function SolutionsPage() {
    // Icon components
    const Building2Icon = ({ className }: { className: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
    );
    const ActivityIcon = ({ className }: { className: string }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
    );

    const industries = [
        { title: "Financial Services", icon: Building2Icon, desc: "Secure banking operations and protect customer financial data." },
        { title: "Healthcare", icon: ActivityIcon, desc: "HIPAA-compliant security for patient records and medical devices." },
        { title: "Retail", icon: ShoppingBag, desc: "Protect PCI data and secure e-commerce transactions." },
        { title: "Government", icon: Globe, desc: "Federal-grade security for public sector agencies." },
    ];

    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative flex flex-col">
            <AnimatedBackground />
            <Navbar />

            <main className="flex-grow container mx-auto px-4 pt-32 pb-12 relative z-10">
                <ScrollReveal variant="fadeUp">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Industry <span className="text-securock-blue">Solutions</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mb-12">
                        Tailored security strategies for your specific industry challenges.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {industries.map((ind, i) => (
                        <ScrollReveal key={i} variant="fadeUp" delay={i * 0.1}>
                            <GlassCard className="p-8 flex items-start gap-4 hover:bg-securock-navy-light/60 transition-colors">
                                <div className="p-3 bg-securock-blue/10 rounded-lg">
                                    {ind.title === "Healthcare" ? <ActivityIcon className="w-8 h-8 text-securock-blue" /> : <ind.icon className="w-8 h-8 text-securock-blue" />}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{ind.title}</h3>
                                    <p className="text-gray-400">{ind.desc}</p>
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
