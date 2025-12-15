'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { GlassCard } from '@/components/Layout/GlassCard';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-glow mb-4">
                        <span className="text-white font-bold text-2xl">G</span>
                    </div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        GlassFinance
                    </h1>
                    <p className="text-white/70">
                        Sign in to manage your finances
                    </p>
                </div>

                {/* Login Form */}
                <GlassCard className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail size={18} />}
                            required
                            fullWidth
                        />

                        <Input
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            leftIcon={<Lock size={18} />}
                            required
                            fullWidth
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary-500 focus:ring-primary-500"
                                />
                                <span className="text-sm text-white/70">Remember me</span>
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                            rightIcon={<ArrowRight size={18} />}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-white/70">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </GlassCard>

                {/* Features */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="glass-card p-4 text-center">
                        <div className="text-2xl mb-2">🔒</div>
                        <p className="text-xs text-white/70">Secure</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <p className="text-xs text-white/70">Fast</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <div className="text-2xl mb-2">✨</div>
                        <p className="text-xs text-white/70">Beautiful</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
