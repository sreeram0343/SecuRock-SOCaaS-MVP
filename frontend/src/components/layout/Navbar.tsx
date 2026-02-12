import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center backdrop-blur-md bg-securock-navy/70 border-b border-white/5">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
                <Logo />
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <a href="/platform/overview" className="hover:text-securock-blue transition-colors">Platform</a>
                <a href="/solutions/enterprise" className="hover:text-securock-blue transition-colors">Solutions</a>
                <a href="/services/threat-detection" className="hover:text-securock-blue transition-colors">Services</a>
                <a href="/pricing" className="hover:text-securock-blue transition-colors">Pricing</a>
                <a href="/resources/blog" className="hover:text-securock-blue transition-colors">Resources</a>
            </div>

            <div className="flex gap-4">
                <Button
                    variant="ghost"
                    className="hidden md:inline-flex text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => navigate('/login')}
                >
                    Login
                </Button>
                <Button
                    className="bg-securock-blue text-securock-navy hover:bg-securock-blue/90 font-semibold shadow-[0_0_15px_rgba(0,217,255,0.4)] transition-all hover:shadow-[0_0_25px_rgba(0,217,255,0.6)]"
                    onClick={() => navigate('/signup')}
                >
                    Get Started
                </Button>
            </div>
        </nav>
    );
}
