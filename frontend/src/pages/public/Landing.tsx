import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import ServicesSection from "@/components/landing/ServicesSection";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/layout/Navbar";

import AnimatedBackground from "@/components/layout/AnimatedBackground";

export default function Landing() {

    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative">
            <AnimatedBackground />

            <Navbar />

            <main>
                <HeroSection />
                <TrustSection />
                <ServicesSection />
                {/* Tech Stack or other sections can go here */}
            </main>

            <Footer />
        </div>
    );
}
