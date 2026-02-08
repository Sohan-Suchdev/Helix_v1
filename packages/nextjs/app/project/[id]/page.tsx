"use client";

import { useParams } from "next/navigation";
import { useHelix } from "~~/context/HelixContext";
import { ProbabilityGauge } from "~~/components/helix/ProbabilityGauge";
import { BondingCurveChart } from "~~/components/helix/BondingCurveChart";
import { BuyPanel } from "~~/components/helix/BuyPanel";
import { ShieldCheck, FileText, Database, Lock, Fingerprint, ExternalLink } from "lucide-react";

export default function ProjectDetails() {
  const params = useParams();
  const id = Number(params.id);
  const { projects } = useHelix();
  const project = projects.find((p) => p.id === id);

  if (!project) return <div className="text-white text-center pt-20">Project not found</div>;

  const lastPoint = project.history[project.history.length - 1];

  return (
    <div className="min-h-screen bg-[#020617] py-10 px-4 lg:px-8 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] font-mono rounded border border-slate-700">
                    ID: #{id.toString().padStart(4, '0')}
                </span>
                <span className="px-2 py-0.5 bg-helix-teal/10 text-helix-teal text-[10px] font-mono rounded border border-helix-teal/20 flex items-center gap-1">
                    <ShieldCheck size={10} /> AUDIT PASSED
                </span>
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[10px] font-mono rounded border border-purple-500/20">
                    IP-NFT MINTED
                </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-100 font-bold tracking-tight">{project.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-slate-400 text-sm">
                <span>By <span className="text-slate-200 font-medium">{project.researcher}</span></span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <a href="#" className="hover:text-helix-teal flex items-center gap-1 transition-colors">
                    View Proposal <ExternalLink size={12} />
                </a>
            </div>
        </div>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN (Content & Charts) - Takes up 8 columns */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* 1. THE BIG CHART (With Neon Border Wrapper) */}
                <div className="w-full h-[450px] relative rounded-2xl p-[1px] bg-gradient-to-b from-slate-700 to-transparent">
                    <div className="w-full h-full bg-[#0B1221] rounded-2xl overflow-hidden relative isolate">
                        
                        {/* GLOW FIX: Increased opacity to /20 and added pointer-events-none */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-helix-teal/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                        
                        {/* Chart Component */}
                        <BondingCurveChart data={project.history} />
                    </div>
                </div>

                {/* 2. CONSENSUS BAR (Polymarket Style + Glass Effect) */}
                <div className="bg-[#0B1221] p-6 rounded-2xl border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.3)] backdrop-blur-md relative overflow-hidden">
                    {/* Subtle animated sheen */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-30"></div>
                    
                    <div className="flex justify-between items-end mb-3 relative z-10">
                        <div>
                            <div className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-1">Market Probability</div>
                            <div className="text-2xl font-serif text-slate-100">
                                {(lastPoint.priceYes * 100).toFixed(1)}% <span className="text-emerald-500 text-lg">YES</span>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-2xl font-serif text-slate-500">
                                {(lastPoint.priceNo * 100).toFixed(1)}% <span className="text-sm">NO</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bar Visual */}
                    <div className="relative h-4 w-full bg-slate-900 rounded-full overflow-hidden flex z-10 border border-slate-800">
                        <div className="h-full bg-helix-teal shadow-[0_0_15px_rgba(31,174,159,0.5)] relative z-10 transition-all duration-700" style={{ width: `${lastPoint.priceYes * 100}%` }}></div>
                        <div className="h-full bg-red-500/20 transition-all duration-700" style={{ width: `${lastPoint.priceNo * 100}%` }}></div>
                        {/* Center Marker */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-black z-20 opacity-50"></div>
                    </div>
                </div>

                {/* 3. INFO TABS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Data Validation Card */}
                    <div className="bg-[#0B1221] p-6 rounded-2xl border border-slate-800 hover:border-helix-teal/30 transition-colors group">
                        <h3 className="text-slate-100 font-serif mb-4 flex items-center gap-2">
                            <Database size={18} className="text-helix-teal group-hover:scale-110 transition-transform"/> Data Anchoring
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-3">
                                <span className="text-slate-500">Oracle</span>
                                <span className="text-slate-200 font-mono">Flare FDC</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-3">
                                <span className="text-slate-500">Source</span>
                                <span className="text-slate-200">PubMed / CT.gov</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-slate-800 pb-3">
                                <span className="text-slate-500">Last Verified</span>
                                <span className="text-emerald-400 font-mono">2 mins ago</span>
                            </div>
                            <a href="https://ipfs.io/ipfs/bafkreicwe624a5w7d2d3a6v7p3s45u6l3f2j1k2l3m4n5o6p7q8r9s0" target="_blank" className="flex items-center gap-2 text-xs text-helix-teal hover:underline mt-2">
                                <FileText size={14}/> View Merkle Proof (IPFS)
                            </a>
                        </div>
                    </div>

                    {/* AI Analysis Card */}
                    <div className="h-full">
                         <ProbabilityGauge score={project.trustScore} />
                    </div>
                </div>

                {/* 4. IP-NFT & RESEARCH DETAILS */}
                <div className="bg-[#0B1221] p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
                     {/* Background Glow */}
                     <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px]"></div>
                     
                    <h3 className="text-xl font-serif text-slate-100 mb-6 flex items-center gap-2 relative z-10">
                        <Fingerprint className="text-purple-400" /> Intellectual Property (IP-NFT)
                    </h3>
                    
                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        {/* NFT Visual */}
                        <div className="w-full md:w-1/3 aspect-[3/4] bg-gradient-to-br from-slate-900 to-[#020617] rounded-xl border border-slate-700 flex flex-col items-center justify-center p-4 relative overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Lock size={40} className="text-slate-600 mb-4 group-hover:text-purple-400 transition-colors" />
                            <div className="text-xs font-mono text-slate-500">IP-NFT #8821</div>
                            <div className="absolute bottom-4 left-4 text-[10px] text-slate-400 font-mono">
                                ROYALTY: 2.5%<br/>
                                TYPE: EXCLUSIVE
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-slate-200 mb-2">Research Abstract</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {project.description} This project aims to revolutionize the delivery mechanism of mRNA sequences by utilizing a novel lipid nanoparticle shell that bypasses the immune system's initial response.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                    <div className="text-[10px] text-slate-500 uppercase">License Type</div>
                                    <div className="text-sm text-slate-200">Commercial / Sub-licensable</div>
                                </div>
                                <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                    <div className="text-[10px] text-slate-500 uppercase">Jurisdiction</div>
                                    <div className="text-sm text-slate-200">Global (WIPO)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN (Sticky Buy Panel) - Takes up 4 columns */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                    
                    {/* The Buy Panel with Neon Border Wrapper */}
                    <div className="relative z-10 p-[1px] rounded-2xl bg-gradient-to-b from-helix-teal/30 to-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
                         <div className="bg-[#0B1221] rounded-2xl overflow-hidden">
                            <BuyPanel projectId={project.id} />
                         </div>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="bg-[#0B1221]/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
                        <div className="text-xs font-mono text-slate-500 uppercase mb-4 tracking-widest">Market Stats</div>
                        <div className="flex justify-between items-center mb-3 border-b border-slate-800/50 pb-2">
                            <span className="text-sm text-slate-400">24h Volume</span>
                            <span className="text-sm text-slate-200 font-mono">$1.2M</span>
                        </div>
                        <div className="flex justify-between items-center mb-3 border-b border-slate-800/50 pb-2">
                            <span className="text-sm text-slate-400">Liquidity</span>
                            <span className="text-sm text-slate-200 font-mono">$450k</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Holders</span>
                            <span className="text-sm text-slate-200 font-mono">1,204</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
