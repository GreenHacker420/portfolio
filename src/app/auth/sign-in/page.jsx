'use client';

import { AuthView } from '@neondatabase/auth/react';

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
            <div className="w-full max-w-md p-6 bg-neutral-900/50 border border-neutral-800 rounded-xl">
                <AuthView pathname="sign-in" />
            </div>
        </div>
    );
}
