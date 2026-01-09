
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DotBackground } from "@/components/ui/DotBackground";
import { Activity } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Invalid credentials');
                setLoading(false);
            } else {
                router.push('/admin');
                router.refresh();
            }
        } catch (err) {
            setError('An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
            <DotBackground className="min-h-screen w-full flex items-center justify-center">
                <div className="z-10 w-full max-w-md p-8 bg-neutral-900/50 border border-white/10 rounded-2xl backdrop-blur-xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-xl bg-neon-green/20 flex items-center justify-center border border-neon-green/50">
                            <Activity className="w-6 h-6 text-neon-green" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-white mb-2">Admin Access</h2>
                    <p className="text-center text-neutral-400 mb-8">Enter your secure credentials.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@greenhacker.tech"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 bg-neutral-900 border-white/10 focus:border-neon-green"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 bg-neutral-900 border-white/10 focus:border-neon-green"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full bg-neon-green text-black hover:bg-neon-green/90 font-bold">
                            {loading ? 'Authenticating...' : 'Access Console'}
                        </Button>
                    </form>
                </div>
            </DotBackground>
        </div>
    );
}
