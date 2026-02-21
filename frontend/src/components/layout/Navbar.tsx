import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { label: "Platform", to: "/platform/overview" },
        { label: "Solutions", to: "/solutions/enterprise" },
        { label: "Services", to: "/services/threat-detection" },
        { label: "Pricing", to: "/pricing" },
        { label: "Resources", to: "/resources/blog" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-12">
                <div className="cursor-pointer" onClick={() => navigate('/')}>
                    <Logo />
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    {navItems.map((item) => (
                        <Link key={item.to} to={item.to} className="transition-colors text-muted-foreground hover:text-foreground">
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex gap-4">
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                    <Button
                        className="bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-sm"
                        onClick={() => navigate('/signup')}
                    >
                        Request Demo
                    </Button>
                </div>

                <button
                    className="inline-flex items-center justify-center rounded-md border border-white/15 p-2 text-gray-300 md:hidden"
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            <div className={`${isOpen ? "block" : "hidden"} border-t border-border bg-background/95 md:hidden`}>
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Button
                        variant="ghost"
                        className="justify-start text-muted-foreground hover:bg-muted hover:text-foreground"
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/login');
                        }}
                    >
                        Login
                    </Button>
                    <Button
                        className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/signup');
                        }}
                    >
                        Request Demo
                    </Button>
                </div>
            </div>
        </nav >
    );
}
