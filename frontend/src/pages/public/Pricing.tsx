import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import PricingCard from "@/components/ui/PricingCard";
import { motion } from "framer-motion";

export default function Pricing() {
    const plans = [
        {
            name: "Basic",
            tier: "basic",
            price: "$49/month",
            description: "Essential SOC features for small teams",
            features: [
                "Up to 3 users",
                "1,000 alerts per month",
                "50 incident management",
                "Basic analytics dashboard",
                "30-day data retention",
                "Email support",
                "Standard playbooks",
                "Real-time threat detection"
            ]
        },
        {
            name: "Premium",
            tier: "premium",
            price: "$199/month",
            description: "Full-featured SOC for growing organizations",
            recommended: true,
            features: [
                "Unlimited users",
                "Unlimited alerts",
                "Unlimited incidents",
                "Advanced analytics & reporting",
                "365-day data retention",
                "Priority 24/7 support",
                "Custom playbooks",
                "API access",
                "Advanced threat intelligence",
                "Compliance reporting",
                "Multi-tenant support",
                "Dedicated account manager"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-transparent text-foreground overflow-x-hidden relative">
            <AnimatedBackground />

            <Navbar />

            <main className="relative z-10 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-glow">
                            Choose Your Plan
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Select the perfect plan for your organization's security needs.
                            Start with a 14-day free trial on any plan.
                        </p>
                    </motion.div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.tier}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <PricingCard {...plan} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Feature Comparison */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-card/30 backdrop-blur-md border border-border rounded-2xl p-8 max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">All Plans Include</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-4xl mb-3">🛡️</div>
                                <h3 className="font-semibold mb-2">Real-time Protection</h3>
                                <p className="text-sm text-muted-foreground">
                                    24/7 monitoring and threat detection
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-3">🤖</div>
                                <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                                <p className="text-sm text-muted-foreground">
                                    Machine learning anomaly detection
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-3">📊</div>
                                <h3 className="font-semibold mb-2">Comprehensive Dashboard</h3>
                                <p className="text-sm text-muted-foreground">
                                    Intuitive security operations center
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-20 max-w-3xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="bg-card/30 backdrop-blur-md border border-border rounded-xl p-6">
                                <h3 className="font-semibold mb-2">Can I switch plans later?</h3>
                                <p className="text-muted-foreground text-sm">
                                    Yes! You can upgrade or downgrade your plan at any time from your dashboard settings.
                                </p>
                            </div>
                            <div className="bg-card/30 backdrop-blur-md border border-border rounded-xl p-6">
                                <h3 className="font-semibold mb-2">What happens after the trial?</h3>
                                <p className="text-muted-foreground text-sm">
                                    After your 14-day trial, you'll be prompted to select a paid plan to continue using SecuRock.
                                </p>
                            </div>
                            <div className="bg-card/30 backdrop-blur-md border border-border rounded-xl p-6">
                                <h3 className="font-semibold mb-2">Do you offer custom enterprise plans?</h3>
                                <p className="text-muted-foreground text-sm">
                                    Yes! Contact our sales team for custom enterprise solutions tailored to your needs.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
