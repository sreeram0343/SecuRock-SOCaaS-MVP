import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-border bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-4">
                    <div>
                        <div className="mb-4 flex items-center gap-2">
                            <Shield className="h-7 w-7 text-primary" />
                            <span className="text-2xl font-bold tracking-tight text-foreground">SecuRock</span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            AI-powered Security Operations Center services for continuous monitoring, investigation, and incident response.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-foreground">Platform</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/platform/overview" className="transition-colors hover:text-primary">Overview</Link></li>
                            <li><Link to="/services/threat-detection" className="transition-colors hover:text-primary">Capabilities</Link></li>
                            <li><Link to="/pricing" className="transition-colors hover:text-primary">SLA & Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-foreground">Solutions</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/solutions/enterprise" className="transition-colors hover:text-primary">SMB & Mid-Market</Link></li>
                            <li><Link to="/solutions/enterprise" className="transition-colors hover:text-primary">Fintech & Healthcare</Link></li>
                            <li><Link to="/solutions/enterprise" className="transition-colors hover:text-primary">Cloud-Native Teams</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 font-semibold text-foreground">Contact</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>sales@securock.com</li>
                            <li>Use the demo form to schedule discovery.</li>
                            <li>Service coverage: India, APAC, and remote global delivery.</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
                    <p>&copy; {new Date().getFullYear()} SecuRock. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
