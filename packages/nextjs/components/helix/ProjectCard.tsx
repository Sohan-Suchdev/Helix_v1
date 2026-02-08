"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Clock, Activity } from "lucide-react";

interface ProjectCardProps {
  id: number;
  title: string;
  researcher: string;
  trustScore: number;
  fundingProgress: number;
  timeLeft: string;
}

export const ProjectCard = ({ id, title, researcher, trustScore, fundingProgress, timeLeft }: ProjectCardProps) => {
  return (
    <Link href={`/project/${id}`}>
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 0 20px rgba(31, 174, 159, 0.15)" }}
        className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-helix-dark p-5 shadow-lg transition-colors hover:border-helix-teal/50 group"
      >
        {/* Top: Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-serif font-semibold text-slate-100 group-hover:text-helix-teal transition-colors">
              {title}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Rsrch: {researcher}</p>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-helix-teal/10 text-helix-teal">
            <Activity size={16} />
          </div>
        </div>

        {/* Middle: Data Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-helix-navy rounded-md p-2 border border-slate-800/50">
            <div className="flex items-center space-x-1 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              <ShieldCheck size={10} />
              <span>Trust Score</span>
            </div>
            <div className="text-xl font-mono text-helix-teal">{trustScore}</div>
          </div>
          <div className="bg-helix-navy rounded-md p-2 border border-slate-800/50">
            <div className="flex items-center space-x-1 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              <Clock size={10} />
              <span>Time Left</span>
            </div>
            <div className="text-sm font-mono text-slate-300 pt-1">{timeLeft}</div>
          </div>
        </div>

        {/* Bottom: Funding Bar (Updated Visuals) */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-400">Funding Progress</span>
            <span className="text-helix-teal font-mono">{fundingProgress}%</span>
          </div>
          
          {/* Thicker Bar with Background Track */}
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            {/* The Fill */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${fundingProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-teal-600 to-helix-teal shadow-[0_0_10px_rgba(31,174,159,0.5)]"
            />
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={14} className="text-helix-teal" />
        </div>
      </motion.div>
    </Link>
  );
};
