"use client";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export const ProbabilityGauge = ({ score }: { score: number }) => {
  const getColor = (s: number) => (s < 50 ? "#E63946" : s < 80 ? "#D8B44A" : "#1FAE9F");
  const color = getColor(score);
  const status = score >= 80 ? "High Confidence" : score >= 50 ? "Moderate Risk" : "High Risk";

  return (
    <div className="w-full bg-helix-dark border border-slate-800 rounded-2xl p-6">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-1">AI Audit Score</h3>
          <div className="text-3xl font-serif font-bold text-slate-100 flex items-center gap-3">
            {score}/100
            <span className="text-sm font-mono font-normal px-2 py-1 rounded border" style={{ borderColor: `${color}30`, color: color, backgroundColor: `${color}10` }}>
              {status}
            </span>
          </div>
        </div>
        <div className="text-slate-500">
           {score >= 80 ? <ShieldCheck size={28} className="text-helix-teal" /> : <AlertTriangle size={28} className="text-amber-500" />}
        </div>
      </div>

      {/* The Bar */}
      <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
        {/* Tick Marks */}
        <div className="absolute top-0 left-1/4 h-full w-[1px] bg-slate-800 z-10"></div>
        <div className="absolute top-0 left-2/4 h-full w-[1px] bg-slate-800 z-10"></div>
        <div className="absolute top-0 left-3/4 h-full w-[1px] bg-slate-800 z-10"></div>
        
        {/* Fill */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full relative z-0"
          style={{ backgroundColor: color }}
        >
          {/* Shine effect */}
          <div className="absolute top-0 right-0 h-full w-2 bg-white/20 blur-[2px]"></div>
        </motion.div>
      </div>

      <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-2">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
};
