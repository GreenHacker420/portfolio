'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            setError('Invalid credentials');
        } else {
            router.push('/admin');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md p-8 bg-neutral-900/50 border border-neutral-800 rounded-xl backdrop-blur-sm">
                <h1 className="text-2xl font-bold mb-6 text-center">System Access</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-500 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Identity</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-neutral-800 rounded p-2 focus:border-green-500 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Passkey</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-neutral-800 rounded p-2 focus:border-green-500 outline-none transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-2 rounded hover:bg-neutral-200 transition-colors"
                    >
                        Authenticate
                    </button>
                </form>
            </div>
        </div>
    );
}
