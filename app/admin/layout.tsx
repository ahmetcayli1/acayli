import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import Link from "next/link";
import { Role } from "@prisma/client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== Role.ADMIN) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
            <h1 className="text-xl font-bold text-blue-400">UNIWISE Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
            <Link href="/admin" className="block px-4 py-2 rounded hover:bg-slate-700">Dashboard</Link>
            <Link href="/admin/datasets" className="block px-4 py-2 rounded hover:bg-slate-700">Datasets</Link>
            <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-slate-700">Users</Link>
            <Link href="/admin/match-runs" className="block px-4 py-2 rounded hover:bg-slate-700">Match Runs</Link>
            <Link href="/admin/purchases" className="block px-4 py-2 rounded hover:bg-slate-700">Purchases</Link>
        </nav>
        <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
            Admin: {session.user.email}
        </div>
      </aside>
      
      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
