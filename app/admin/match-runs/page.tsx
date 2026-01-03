import { prisma } from "@/app/lib/prisma";

export default async function MatchRunsAdmin() {
    const runs = await prisma.matchRun.findMany({ 
        include: { user: true, results: { select: { id: true } } }, 
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Match Runs</h2>
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left">
                    <thead className="bg-slate-700 text-slate-300">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Countries</th>
                            <th className="p-4">Results Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {runs.map(r => (
                            <tr key={r.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                                <td className="p-4">{r.user.email}</td>
                                <td className="p-4 text-slate-400">{r.createdAt.toLocaleString()}</td>
                                <td className="p-4">{r.selectedCountries.join(", ")}</td>
                                <td className="p-4">{r.results.length}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
