'use client';

import { NeonAuthUIProvider } from '@neondatabase/auth/react';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }) {
    const router = useRouter();

    return (
        <NeonAuthUIProvider
            authClient={authClient}
            navigate={router.push}
            replace={router.replace}
            onSessionChange={router.refresh}
            Link={Link}
        >
            {children}
        </NeonAuthUIProvider>
    );
}
