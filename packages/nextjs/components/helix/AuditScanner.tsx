"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Database } from "lucide-react";
import { useEffect, useState } from "react";

export const AuditScanner = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { icon: Search, text: "Analyzing Research Methodology..." },
    { icon: Database, text: "Verifying Data Sources via FDC..." },
    { icon: ShieldCheck, text: "Generating Zero-Knowledge Proof..." },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => {
        if (s >= 2) {
          clearInterval(timer);
          setTimeout(onComplete, 1000); // Finish after last step
          return 2;
        }
        return s + 1;
      });
    }, 1500); // 1.5 seconds per step
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-helix-dark rounded-xl border border-helix-teal/30 shadow-glow">
      {/* Animated Pulse */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-helix-teal/20 rounded-full animate-ping"></div>
        <div className="relative bg-helix-navy p-4 rounded-full border-2 border-helix-teal">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Search className="text-helix-teal" size={32} />
          </motion.div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 w-full max-w-xs">
        {steps.map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
            className={`flex items-center gap-3 text-sm ${i === step ? "text-helix-teal font-bold" : "text-slate-500"}`}
          >
            <s.icon size={16} />
            {s.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
