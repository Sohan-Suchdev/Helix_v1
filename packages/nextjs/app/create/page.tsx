"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Database, ArrowRight, UploadCloud, CheckCircle } from "lucide-react";

// --- The Scanner Component ---
const AuditScanner = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { icon: Search, text: "Analyzing Research Methodology..." },
    { icon: Database, text: "Verifying Data Sources via Flare FDC..." },
    { icon: ShieldCheck, text: "Generating Zero-Knowledge Proof..." },
  ];

  // Auto-advance steps
  useState(() => {
    const interval = setInterval(() => {
      setStep((current) => {
        if (current >= 2) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 2;
        }
        return current + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-helix-dark rounded-xl border border-helix-teal/30 shadow-[0_0_30px_rgba(31,174,159,0.15)]">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-helix-teal/20 rounded-full animate-ping"></div>
        <div className="relative bg-helix-navy p-6 rounded-full border-2 border-helix-teal">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Search className="text-helix-teal" size={40} />
          </motion.div>
        </div>
      </div>
      <div className="space-y-4 w-full max-w-sm">
        {steps.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
            className={`flex items-center gap-3 text-sm font-mono ${i === step ? "text-helix-teal" : "text-slate-500"}`}
          >
            {i < step ? <CheckCircle size={16} /> : <s.icon size={16} />}
            {s.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- The Page Component ---
export default function CreateProposal() {
  const [scanning, setScanning] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
  };

  if (complete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-helix-navy px-4">
        <div className="bg-helix-dark p-8 rounded-2xl border border-helix-teal/50 shadow-lg max-w-md w-full text-center">
          <div className="mx-auto bg-helix-teal/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
             <ShieldCheck className="text-helix-teal" size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-100 mb-2">Proposal Tokenized</h2>
          <p className="text-slate-400 mb-6">Your research has been verified compatible with the bonding curve.</p>
          <button onClick={() => window.location.href = "/"} className="w-full bg-helix-teal text-slate-900 font-bold py-3 rounded-lg hover:bg-emerald-400 transition-colors">
            View on Market
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-helix-navy py-12 px-4 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-serif font-bold text-slate-100 mb-8">New Research Proposal</h1>
        {scanning ? (
          <AuditScanner onComplete={() => setComplete(true)} />
        ) : (
          <form onSubmit={handleSubmit} className="bg-helix-dark p-8 rounded-2xl border border-slate-800 space-y-6">
            <div>
              <label className="block text-slate-400 text-sm font-mono mb-2">Project Title</label>
              <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none" placeholder="e.g. Novel Malaria Vector..." required />
            </div>
            <div>
              <label className="block text-slate-400 text-sm font-mono mb-2">Research Data URL (IPFS/Arweave)</label>
              <div className="flex gap-2">
                <input type="url" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none" placeholder="ipfs://..." required />
                <button type="button" className="p-3 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><UploadCloud size={20}/></button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-sm font-mono mb-2">Target (USDC)</label>
                <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none" placeholder="50000" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm font-mono mb-2">Researcher ID</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none" placeholder="0x..." />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" className="w-full bg-helix-teal text-slate-900 font-bold py-4 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
                Initialize Validation <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}