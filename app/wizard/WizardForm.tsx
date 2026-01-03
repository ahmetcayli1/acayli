"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Step1ModeCountry } from "../components/wizard/Step1ModeCountry";
import { Step2Personal } from "../components/wizard/Step2Personal";
import { Step6Documents } from "../components/wizard/Step6Documents";

const PlaceholderStep = ({ title }: { title: string }) => (
  <div className="text-center py-20">
    <h2 className="text-3xl font-bold mb-4">{title}</h2>
    <p className="text-slate-400">This step is simplified for the demo.</p>
  </div>
);

export default function WizardForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    mode: "MASTER", // Default
    countries: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 8));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
        // Save profile
        await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        // Trigger matching
        const res = await fetch('/api/match/run', {
            method: 'POST',
        });
        const data = await res.json();
        
        router.push(`/results/${data.runId}`);
    } catch (error) {
        console.error("Error submitting:", error);
        alert("Something went wrong. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1ModeCountry formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2Personal formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PlaceholderStep title="Education History" />;
      case 4:
        return <PlaceholderStep title="Test Scores" />;
      case 5:
        return <PlaceholderStep title="Experience" />;
      case 6:
        return <Step6Documents formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <PlaceholderStep title="Goals & Motivation" />;
      case 8:
        return <PlaceholderStep title="Preferences & Finance" />;
      default:
        return <div>Step {step} coming soon</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header / Progress */}
      <div className="h-16 border-b border-slate-800 flex items-center px-8 justify-between bg-slate-900/80 backdrop-blur z-50 fixed w-full top-0">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">UNIWISE AI</div>
        <div className="flex-1 mx-12">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-sm text-slate-400">Step {step} of 8</div>
      </div>

      <div className="flex-1 pt-24 pb-12 px-4 md:px-0">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 w-full h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-8 z-50">
        <button
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
          className="px-6 py-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-50"
        >
          Previous
        </button>
        
        {step === 8 ? (
             <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="px-8 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {isSubmitting ? "Generating..." : "Find Matches"}
             </button>
        ) : (
            <button
                onClick={nextStep}
                className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium"
            >
                Next
            </button>
        )}
      </div>
    </div>
  );
}
