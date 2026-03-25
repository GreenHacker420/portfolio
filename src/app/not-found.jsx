
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
            <div className="text-center space-y-8">
                <h1 className="text-[12rem] font-black leading-none tracking-tighter text-zinc-900 select-none">404</h1>
                
                <div className="space-y-2 relative -mt-20">
                    <h2 className="text-3xl font-bold uppercase tracking-tight">Signal Lost</h2>
                    <p className="text-zinc-500 text-lg">The requested coordinate does not exist in this sector.</p>
                </div>

                <Link 
                    href="/"
                    className="inline-block px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                >
                    RETURN TO TERMINAL
                </Link>
            </div>
            
            <div className="fixed bottom-10 left-0 right-0 text-center">
                <p className="text-[10px] text-zinc-800 font-mono tracking-[0.5em] uppercase">Status: 404 // Protocol: Home_Search</p>
            </div>
        </div>
    );
}
