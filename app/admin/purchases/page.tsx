import { prisma } from "@/app/lib/prisma";

export default async function PurchasesAdmin() {
    const purchases = await prisma.purchase.findMany({ 
        include: { user: true }, 
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Purchases</h2>
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left">
                    <thead className="bg-slate-700 text-slate-300">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Stripe ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map(p => (
                            <tr key={p.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                                <td className="p-4">{p.user.email}</td>
                                <td className="p-4 font-mono font-bold text-green-400">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: p.currency }).format(p.amount)}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {p.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">{p.createdAt.toLocaleString()}</td>
                                <td className="p-4 text-xs font-mono text-slate-500">{p.stripeSessionId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
