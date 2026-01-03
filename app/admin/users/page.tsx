import { prisma } from "@/app/lib/prisma";

export default async function UsersAdmin() {
    const users = await prisma.user.findMany({ include: { profile: true }, orderBy: { createdAt: 'desc' } });
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Users</h2>
            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <table className="w-full text-left">
                    <thead className="bg-slate-700 text-slate-300">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4">Profile Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                                <td className="p-4 font-mono text-sm">{u.email}</td>
                                <td className="p-4"><span className="bg-slate-600 px-2 py-1 rounded text-xs font-bold text-slate-200">{u.role}</span></td>
                                <td className="p-4 text-slate-400">{u.createdAt.toLocaleDateString()}</td>
                                <td className="p-4 text-slate-400">{u.profile?.mode || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
