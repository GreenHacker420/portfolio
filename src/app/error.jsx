
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error('Page-level error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-red-500">System Malfunction</h1>
                    <p className="text-zinc-400">An unexpected error has occurred in the matrix.</p>
                </div>
                
                {error.message && (
                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-left overflow-auto max-h-40">
                        <code className="text-xs text-red-400">{error.message}</code>
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    <Button 
                        onClick={() => reset()}
                        variant="default"
                        className="bg-white text-black hover:bg-zinc-200"
                    >
                        Reinitialize
                    </Button>
                    <Button 
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                        className="border-zinc-800 text-zinc-400 hover:text-white"
                    >
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
