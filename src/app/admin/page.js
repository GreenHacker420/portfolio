export default function AdminDashboard() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                    <h3 className="text-xl font-bold mb-2">Total Visits</h3>
                    <p className="text-4xl text-blue-500">1,234</p>
                </div>
                <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                    <h3 className="text-xl font-bold mb-2">Messages</h3>
                    <p className="text-4xl text-green-500">5</p>
                </div>
                <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                    <h3 className="text-xl font-bold mb-2">Projects</h3>
                    <p className="text-4xl text-purple-500">4</p>
                </div>
            </div>
        </div>
    );
}
