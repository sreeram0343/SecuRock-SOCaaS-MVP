import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingCardProps {
    name: string;
    tier: string;
    price: string;
    features: string[];
    recommended?: boolean;
    description: string;
}

export default function PricingCard({ name, tier, price, features, recommended = false, description }: PricingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative p-8 rounded-2xl border-2 ${recommended
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/5'
                    : 'border-border bg-card/50'
                } backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300`}
        >
            {recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        <Zap className="h-4 w-4" />
                        Recommended
                    </div>
                </div>
            )}

            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{description}</p>
                <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-glow">{price.split('/')[0]}</span>
                    <span className="text-muted-foreground">/{price.split('/')[1]}</span>
                </div>
            </div>

            <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                    </li>
                ))}
            </ul>

            <Link
                to={`/signup?plan=${tier}`}
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${recommended
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
            >
                Get Started
            </Link>
        </motion.div>
    );
}
