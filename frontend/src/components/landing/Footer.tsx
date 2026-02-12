import { Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-transparent border-t border-white/10 py-12 relative z-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Shield className="w-8 h-8 text-securock-blue" />
                            <span className="text-2xl font-bold text-white tracking-tight">SecuRock</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Next-generation SOCaaS platform delivering 24/7 threat detection and response for the modern enterprise.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Services</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="hover:text-securock-blue cursor-pointer transition-colors">Threat Monitoring</li>
                            <li className="hover:text-securock-blue cursor-pointer transition-colors">Incident Response</li>
                            <li className="hover:text-securock-blue cursor-pointer transition-colors">Compliance</li>
                            <li className="hover:text-securock-blue cursor-pointer transition-colors">Vulnerability Mgmt</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="hover:text-securock-blue cursor-pointer transition-colors">About Us</li>
                            <li className="hover:text-securock-blue cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-securock-blue cursor-pointer transition-colors">Blog</li>
                            <li className="hover:text-securock-blue cursor-pointer transition-colors">Contact</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>sales@securock.com</li>
                            <li>+1 (555) 123-4567</li>
                            <li>123 Security Blvd,<br />Cyber City, CA 90210</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} SecuRock SOCaaS. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
