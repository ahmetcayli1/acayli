"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import clsx from "clsx";

export default function ResultsView({ runId }: { runId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/match/${runId}`)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [runId]);

  const handleUnlock = async () => {
    try {
        const res = await fetch('/api/billing/create-checkout-session', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ runId })
        });
        const { url } = await res.json();
        if (url) window.location.href = url;
    } catch (e) {
        alert("Payment initialization failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading matches...</div>;
  if (!data) return <div>Error loading results</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-bold">Your University Matches</h1>
                <p className="text-slate-400">Found {data.totalCount} programs tailored to your profile.</p>
            </div>
            {!data.isUnlocked && (
                <div className="text-right hidden md:block">
                    <div className="text-sm text-slate-400">Unlock full report</div>
                    <div className="text-2xl font-bold text-green-400">$863.64</div>
                </div>
            )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {data.results.map((result: any, idx: number) => (
                    <div key={result.id} className={clsx(
                        "bg-slate-800 rounded-xl p-6 border transition-all",
                        result.isLocked ? "border-slate-700 opacity-70 relative overflow-hidden" : "border-blue-500/30 shadow-lg"
                    )}>
                        {result.isLocked && (
                            <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/50 flex flex-col items-center justify-center z-10">
                                <Lock className="w-8 h-8 text-slate-400 mb-2" />
                                <span className="font-semibold text-slate-300">Premium Match</span>
                            </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{result.program.universityName}</h3>
                                <p className="text-blue-400">{result.program.programName}</p>
                            </div>
                            {!result.isLocked && (
                                <div className={clsx(
                                    "px-3 py-1 rounded-full text-sm font-bold",
                                    result.llmJson?.admission_probability > 70 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                                )}>
                                    {result.llmJson?.admission_probability}% Chance
                                </div>
                            )}
                        </div>
                        
                        {!result.isLocked && (
                            <>
                                <div className="flex gap-2 mb-4">
                                    {result.llmJson?.tags && (
                                        <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">{result.llmJson.tags}</span>
                                    )}
                                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">{result.program.country}</span>
                                </div>
                                <p className="text-slate-300 text-sm mb-4">{result.llmJson?.expert_commentary}</p>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Sidebar / Paywall */}
            <div className="lg:col-span-1">
                {!data.isUnlocked ? (
                    <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-8 border border-blue-500/50 sticky top-8 shadow-2xl">
                        <div className="mb-6">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">64% OFF</span>
                            <h2 className="text-2xl font-bold mt-2">Unlock All Matches</h2>
                            <p className="text-blue-200 text-sm">Get detailed analysis for all {data.totalCount} programs.</p>
                        </div>
                        
                        <div className="mb-8">
                            <div className="text-slate-400 line-through text-lg">$2,399</div>
                            <div className="text-4xl font-bold text-white">$863.64</div>
                            <div className="text-sm text-blue-300 mt-1">One-time payment</div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {['Full list of 10-50 programs', 'Admissions Probability Score', 'Expert Commentary', 'Tuition & City Insights'].map(i => (
                                <li key={i} className="flex items-center text-sm text-slate-200">
                                    <Check className="w-4 h-4 text-green-400 mr-2" /> {i}
                                </li>
                            ))}
                        </ul>

                        <button 
                            onClick={handleUnlock}
                            className="w-full py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                        >
                            Get Full Access
                        </button>
                    </div>
                ) : (
                    <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-xl sticky top-8">
                        <h3 className="text-green-400 font-bold mb-2">Premium Access Active</h3>
                        <p className="text-sm text-slate-300">You have full access to all insights and recommendations.</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
