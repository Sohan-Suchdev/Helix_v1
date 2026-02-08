"use client";

import { useParams } from "next/navigation";
import { ProbabilityGauge } from "~~/components/helix/ProbabilityGauge";
import { BuyPanel } from "~~/components/helix/BuyPanel";
import { ShieldCheck, FileText } from "lucide-react";

export default function ProjectDetails() {
  const params = useParams();
  const id = params.id;

  // Mock Data - In real app, we fetch this using the ID
  const project = {
    title: "Lupus Cure Phase 1",
    researcher: "Dr. S. Helix",
    description: "A novel approach to autoimmune suppression using mRNA vectors verified by Flare FDC data attestations.",
    score: 98,
  };

  return (
    <div className="min-h-screen bg-helix-navy py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 border-b border-slate-800 pb-8">
            <div className="flex items-center space-x-3 mb-4">
                <span className="px-2 py-1 bg-helix-teal/10 text-helix-teal text-xs font-mono rounded border border-helix-teal/20">
                    ID: {id}
                </span>
                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs font-mono rounded border border-purple-500/20">
                    AUDIT PASSED
                </span>
            </div>
            <h1 className="text-4xl font-serif text-slate-100 font-bold">{project.title}</h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-lg">{project.description}</p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Data Vault */}
            <div className="space-y-6">
                <div className="bg-helix-dark p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-slate-100 font-serif mb-4 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-helix-teal"/> Validator Data
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                            <span className="text-slate-500">Oracle Status</span>
                            <span className="text-emerald-400 font-mono">Active</span>
                        </div>
                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                            <span className="text-slate-500">Data Source</span>
                            <span className="text-slate-300">PubMed / ClinicalTrials</span>
                        </div>
                        <div className="pt-2">
                            <button className="text-xs text-helix-teal flex items-center gap-1 hover:underline">
                                <FileText size={12}/> View IPFS Proof
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center: The Gauge */}
            <div className="flex flex-col gap-6">
                <ProbabilityGauge score={project.score} />
                
                {/* Chart Placeholder */}
                <div className="h-64 bg-helix-dark rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-600">
                   <div className="text-xs font-mono mb-2">BONDING CURVE TRAJECTORY</div>
                   <div className="w-full h-1/2 bg-gradient-to-t from-helix-teal/10 to-transparent w-3/4 rounded-b-lg border-b border-helix-teal/30"></div>
                </div>
            </div>

            {/* Right: Buy Panel */}
            <div>
                <BuyPanel />
            </div>

        </div>
      </div>
    </div>
  );
}
