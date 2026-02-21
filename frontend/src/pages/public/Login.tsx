
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/layout/AnimatedBackground';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username: email, password });
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center text-foreground overflow-hidden bg-background">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg">
                <h2 className="mb-6 text-3xl font-extrabold text-center text-foreground tracking-tight">SecuRock Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-background/50 text-white border-border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-background/50 text-white border-border"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Sign In'}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                </div>
            </div>
        </div>
    );
}
