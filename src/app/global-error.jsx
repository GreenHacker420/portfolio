
'use client';

import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-black text-white`}>
                <div className="min-h-screen flex items-center justify-center p-6">
                    <div className="max-w-lg w-full text-center space-y-8">
                        <h1 className="text-6xl font-black text-white tracking-tighter">CRITICAL_FAILURE</h1>
                        <p className="text-zinc-500 text-lg uppercase tracking-widest">The application has encountered an unrecoverable state.</p>
                        
                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-left font-mono text-sm text-red-400">
                            <p className="font-bold mb-2">DIAGNOSTIC_INFO:</p>
                            <p>{error?.message || "Internal system error"}</p>
                        </div>

                        <button 
                            onClick={() => reset()}
                            className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                        >
                            ATTEMPT RECOVERY
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
