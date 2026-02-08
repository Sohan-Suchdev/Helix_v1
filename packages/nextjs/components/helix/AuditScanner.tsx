"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Database, CheckCircle } from "lucide-react";

type AuditScannerProps = {
  onComplete: () => void;
  stepDurationMs?: number; // optional: tweak speed
};

export const AuditScanner = ({ onComplete, stepDurationMs = 1500 }: AuditScannerProps) => {
  const [step, setStep] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const steps = [
    { icon: Search, text: "Analyzing Research Methodology..." },
    { icon: Database, text: "Verifying Data Sources via Flare FDC..." },
    { icon: ShieldCheck, text: "Generating Zero-Knowledge Proof..." },
  ];

  useEffect(() => {
    // Progress through steps using chained timeouts
    const run = (i: number) => {
      if (i >= steps.length - 1) {
        setStep(steps.length - 1);
        timeoutRef.current = window.setTimeout(onComplete, 1000);
        return;
      }
      setStep(i);
      timeoutRef.current = window.setTimeout(() => run(i + 1), stepDurationMs);
    };
    run(0);

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onComplete, stepDurationMs, steps.length]);

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div
      className="flex flex-col items-center justify-center p-12 bg-slate-900/70 rounded-xl border border-helix-teal/30 backdrop-blur-lg shadow-[0_0_30px_rgba(31,174,159,0.15)]"
      aria-live="polite"
      role="status"
    >
      {/* Animated Pulse */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-helix-teal/20 rounded-full animate-ping"></div>
        <div className="relative bg-[#0B1221] p-6 rounded-full border-2 border-helix-teal">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Search className="text-helix-teal" size={40} />
          </motion.div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 w-full max-w-sm">
        {steps.map((s, i) => {
          const Icon = i < step ? CheckCircle : s.icon;
          const active = i === step;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= step ? 1 : 0.3, x: 0 }}
              className={`flex items-center gap-3 text-sm font-mono ${
                active ? "text-helix-teal" : "text-slate-500"
              }`}
            >
              <Icon size={16} />
              {s.text}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-sm mt-8">
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-helix-teal"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Validation in progress…
        </p>
      </div>
    </div>
  );
};
