import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import PricingCard from "@/components/ui/PricingCard";
import { motion } from "framer-motion";

export default function Pricing() {
    const plans = [
        {
            name: "Starter SOC",
            tier: "starter",
            price: "INR 49,000/month",
            description: "Baseline managed coverage for teams starting formal SOC operations.",
            features: [
                "Up to 50 GB/day log ingestion",
                "Monitoring window: 8x5",
                "Initial alert acknowledgement <= 60 minutes",
                "Up to 4 incident response hours/month",
                "Monthly posture and incident summary",
                "Cloud and endpoint telemetry onboarding"
            ]
        },
        {
            name: "Growth SOC",
            tier: "growth",
            price: "INR 1,25,000/month",
            description: "Extended SOC coverage and deeper investigation support for scaling organizations.",
            recommended: true,
            features: [
                "Up to 200 GB/day log ingestion",
                "Monitoring window: 16x7",
                "Initial alert acknowledgement <= 30 minutes",
                "Up to 12 incident response hours/month",
                "Threat hunting support and detection tuning",
                "Compliance-ready reporting artifacts"
            ]
        },
        {
            name: "Enterprise SOC",
            tier: "enterprise",
            price: "INR 3,20,000/month",
            description: "Continuous 24x7 SOC with priority response for high-availability environments.",
            features: [
                "Up to 750 GB/day log ingestion",
                "Monitoring window: 24x7",
                "Initial alert acknowledgement <= 15 minutes",
                "Up to 25 incident response hours/month",
                "Priority incident handling and escalation",
                "Quarterly control and risk review"
            ]
        }
    ];

    const addons = [
        ["Additional ingestion", "INR 9,000 per extra 50 GB/day"],
        ["Endpoint telemetry package", "INR 180 per endpoint/month (min 100 endpoints)"],
        ["Threat intel premium feeds", "INR 40,000/month"],
        ["SOAR custom playbook", "INR 25,000 per playbook (one-time)"],
        ["Emergency IR overage", "INR 12,000 per hour"],
    ];

    return (
        <div className="relative min-h-screen overflow-x-hidden bg-transparent text-foreground">
            <AnimatedBackground />
            <Navbar />

            <main className="relative z-10 px-6 py-20 pt-32">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center"
                    >
                        <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl">
                            SOC <span className="text-securock-blue">Pricing</span>
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-gray-300">
                            Practical monthly plans designed for SMB, mid-market, and enterprise security operations. Final commercial scope is confirmed after telemetry assessment.
                        </p>
                    </motion.div>

                    <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
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

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-card/30 p-8 backdrop-blur-md"
                    >
                        <h2 className="mb-6 text-3xl font-bold text-white">SLA Tiers</h2>
                        <div className="grid gap-4 text-sm text-gray-200 md:grid-cols-3">
                            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                <p className="font-semibold text-white">Basic</p>
                                <p className="mt-2">Coverage: 8x5</p>
                                <p>Escalation: &lt;= 2 hours</p>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                <p className="font-semibold text-white">Advanced</p>
                                <p className="mt-2">Coverage: 16x7</p>
                                <p>Escalation: &lt;= 60 minutes</p>
                            </div>
                            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                <p className="font-semibold text-white">Enterprise</p>
                                <p className="mt-2">Coverage: 24x7</p>
                                <p>Escalation: &lt;= 30 minutes (P1/P2)</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mx-auto mt-12 max-w-5xl rounded-2xl border border-white/10 bg-card/30 p-8 backdrop-blur-md"
                    >
                        <h2 className="mb-6 text-3xl font-bold text-white">Add-On Pricing</h2>
                        <div className="space-y-3">
                            {addons.map(([name, value]) => (
                                <div key={name} className="flex flex-col justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm md:flex-row md:items-center">
                                    <p className="font-medium text-white">{name}</p>
                                    <p className="text-gray-300">{value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
