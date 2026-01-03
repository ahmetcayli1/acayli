"use client";

import { useState, useEffect } from "react";
import { DegreeLevel } from "@prisma/client";

export default function DatasetsPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [uploadCountry, setUploadCountry] = useState("Germany");
  const [uploadDegree, setUploadDegree] = useState("MASTER");
  const [file, setFile] = useState<File | null>(null);

  const fetchStats = async () => {
    const res = await fetch("/api/admin/datasets");
    const data = await res.json();
    setStats(data.stats || []);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("country", uploadCountry);
    fd.append("degreeLevel", uploadDegree);

    try {
      const res = await fetch("/api/admin/datasets/upload", {
        method: "POST",
        body: fd
      });
      if (!res.ok) throw new Error("Upload failed");
      alert("Dataset imported successfully");
      fetchStats();
    } catch (err) {
      alert("Error uploading dataset");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (country: string, degreeLevel: string) => {
    if (!confirm(`Delete ${country} ${degreeLevel}?`)) return;
    await fetch("/api/admin/datasets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, degreeLevel })
    });
    fetchStats();
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dataset Manager</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
            <h3 className="text-xl font-bold mb-4">Import Dataset</h3>
            <form onSubmit={handleUpload} className="space-y-4">
                <div>
                    <label className="block text-sm mb-1 text-slate-400">Country</label>
                    <select 
                        value={uploadCountry} 
                        onChange={e => setUploadCountry(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded p-2"
                    >
                        <option value="Germany">Germany</option>
                        <option value="Italy">Italy</option>
                        <option value="Poland">Poland</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1 text-slate-400">Degree</label>
                    <select 
                        value={uploadDegree} 
                        onChange={e => setUploadDegree(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded p-2"
                    >
                        <option value="MASTER">Master</option>
                        <option value="BACHELOR">Bachelor</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1 text-slate-400">Excel File</label>
                    <input 
                        type="file" 
                        accept=".xlsx"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-sm"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !file}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded font-medium disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Upload & Import"}
                </button>
            </form>
        </div>

        {/* Existing Datasets */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Existing Data</h3>
            <div className="space-y-4">
                {stats.length === 0 ? (
                    <div className="text-slate-500 italic">No datasets found.</div>
                ) : (
                    stats.map((s: any) => (
                        <div key={`${s.country}-${s.degreeLevel}`} className="flex justify-between items-center p-3 bg-slate-700/50 rounded border border-slate-600">
                            <div>
                                <div className="font-bold">{s.country}</div>
                                <div className="text-xs text-slate-400">{s.degreeLevel}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-sm font-mono text-blue-300">{s._count.id} programs</div>
                                <button 
                                    onClick={() => handleDelete(s.country, s.degreeLevel)}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
