"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Clock, Activity, TrendingUp, Trophy } from "lucide-react";

interface ProjectCardProps {
  id: number;
  title: string;
  researcher: string;
  trustScore: number;
  fundingProgress: number;
  timeLeft: string;
  priceYes: number;
  priceNo: number;
}

export const ProjectCard = ({ id, title, researcher, trustScore, fundingProgress, timeLeft, priceYes, priceNo }: ProjectCardProps) => {
  // Mock Researcher Score (Randomized for demo if not in DB)
  const researcherRep = 90 + (id * 2); 

  return (
    <Link href={`/project/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -6, boxShadow: "0 0 30px rgba(31, 174, 159, 0.2)" }}
        className="group relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#0B1221] p-5 shadow-lg transition-all duration-300 hover:border-helix-teal/50"
      >
        {/* Glowing Gradient Blob on Hover */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-helix-teal/10 rounded-full blur-[50px] transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-100 group-hover:text-helix-teal transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-400 font-mono">Rsrch: <span className="text-slate-200">{researcher}</span></p>
                {/* NEW: Researcher Score Badge */}
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-400 font-mono" title="Researcher Reputation Score">
                    <Trophy size={10} /> {researcherRep}
                </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-helix-teal group-hover:bg-helix-teal group-hover:text-[#020617] transition-all">
            <Activity size={16} />
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
          <div className="bg-[#020617]/50 rounded-xl p-3 border border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-1 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              <ShieldCheck size={12} />
              <span>Trust Score</span>
            </div>
            <div className="text-2xl font-mono text-helix-teal font-bold">{trustScore}</div>
          </div>
          <div className="bg-[#020617]/50 rounded-xl p-3 border border-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center space-x-1 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              <Clock size={12} />
              <span>Time Left</span>
            </div>
            <div className="text-sm font-mono text-slate-300 pt-1.5">{timeLeft}</div>
          </div>
        </div>

        {/* Consensus Bar */}
        <div className="mb-5 relative z-10">
            <div className="flex justify-between text-[10px] uppercase font-mono text-slate-500 mb-1.5">
                <span className="flex items-center gap-1"><TrendingUp size={10}/> Market Consensus</span>
                <span className={priceYes > priceNo ? "text-emerald-400" : "text-red-400"}>
                    {priceYes > priceNo ? "Bullish" : "Bearish"} ({(priceYes * 100).toFixed(0)}%)
                </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full flex overflow-hidden">
                <div className="h-full bg-helix-teal shadow-[0_0_10px_#1FAE9F]" style={{ width: `${priceYes * 100}%` }}></div>
                <div className="h-full bg-red-500/50" style={{ width: `${priceNo * 100}%` }}></div>
            </div>
        </div>

        {/* Funding Footer */}
        <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center relative z-10">
             <span className="text-xs text-slate-500 font-mono">Funding Progress</span>
             <span className="text-sm text-white font-bold">{fundingProgress}%</span>
        </div>
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-helix-teal to-transparent" style={{ width: `${fundingProgress}%` }}></div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
          <ArrowUpRight size={14} className="text-helix-teal" />
        </div>
      </motion.div>
    </Link>
  );
};
