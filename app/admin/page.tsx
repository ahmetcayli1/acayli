import { prisma } from "@/app/lib/prisma";

export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const matchRunCount = await prisma.matchRun.count();
  const purchaseCount = await prisma.purchase.count();
  const programCount = await prisma.program.count();

  return (
    <div>
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Total Users</div>
                <div className="text-3xl font-bold">{userCount}</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Match Runs</div>
                <div className="text-3xl font-bold">{matchRunCount}</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Purchases</div>
                <div className="text-3xl font-bold">{purchaseCount}</div>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Programs in DB</div>
                <div className="text-3xl font-bold">{programCount}</div>
            </div>
        </div>
    </div>
  );
}
