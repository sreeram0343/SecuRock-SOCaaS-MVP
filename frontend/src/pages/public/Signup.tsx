
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/layout/AnimatedBackground';

export default function Signup() {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        organization_name: '',
        plan_tier: searchParams.get('plan') || 'trial'
    });
    const { signup, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [error, setError] = useState('');

    // ... items ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.detail
                ? (typeof err.response.data.detail === 'object'
                    ? JSON.stringify(err.response.data.detail)
                    : err.response.data.detail)
                : 'Signup failed. Please check your inputs.';
            setError(msg);
        }
    };

    const planBenefits = {
        trial: ['14-day free trial', '1 user', '100 alerts/month'],
        basic: ['Up to 3 users', '1,000 alerts/month', 'Basic analytics'],
        premium: ['Unlimited users', 'Unlimited alerts', 'Advanced analytics', 'API access']
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md p-8 bg-card/30 backdrop-blur-md border border-border rounded-2xl shadow-2xl">
                <h2 className="mb-6 text-4xl font-bold text-center text-glow">Join SecuRock</h2>
                {error && (
                    <div className="mb-4 p-3 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <Input
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="bg-background/50 text-white border-border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Organization Name</label>
                        <Input
                            name="organization_name"
                            value={formData.organization_name}
                            onChange={handleChange}
                            className="bg-background/50 text-white border-border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-background/50 text-white border-border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-background/50 text-white border-border"
                            required
                            minLength={8}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Must be at least 8 characters, include uppercase, lowercase, number, and special character.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Plan</label>
                        <select
                            name="plan_tier"
                            value={formData.plan_tier}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-background/50 text-white border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="trial">Trial (14 days free)</option>
                            <option value="basic">Basic - $49/month</option>
                            <option value="premium">Premium - $199/month</option>
                        </select>
                        <div className="mt-2 text-xs text-muted-foreground">
                            {planBenefits[formData.plan_tier as keyof typeof planBenefits]?.map((benefit, i) => (
                                <div key={i}>✓ {benefit}</div>
                            ))}
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}
