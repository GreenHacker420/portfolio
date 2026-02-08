export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
            <div className="max-w-md text-center space-y-4 p-8 border border-zinc-800 rounded-2xl bg-zinc-950/70">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-zinc-400">You need an admin account to view this area.</p>
                <a
                    className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
                    href="/auth/sign-in"
                >
                    Go to sign-in
                </a>
            </div>
        </div>
    );
}
