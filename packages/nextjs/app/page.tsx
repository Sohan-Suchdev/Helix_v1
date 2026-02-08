"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DNAHelix } from "~~/components/helix/DNAHelix"; // Import the DNA
import { ArrowRight, ShieldCheck, Zap, Globe, Activity, Lock, Database, PlayCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden font-sans selection:bg-helix-teal/30">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-helix-teal/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Side */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-helix-teal/10 border border-helix-teal/20 text-helix-teal text-xs font-mono mb-6 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-helix-teal animate-pulse"></span>
                DeSci Protocol V1.0
              </div>

              <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 leading-[0.9]">
                Your Gateway to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-helix-teal to-purple-400">
                  Decentralized Cures.
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 max-w-xl mb-8 leading-relaxed">
                The first liquidity layer for biotech. Verify research with AI, tokenize IP on the XRP Ledger, and fund the next breakthrough.
              </p>
              
              <div className="flex gap-4">
                <Link href="/marketplace">
                  <button className="px-8 py-4 bg-helix-teal text-[#020617] font-bold rounded-xl text-lg hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(31,174,159,0.3)]">
                    Launch App
                  </button>
                </Link>
                <button className="px-8 py-4 bg-transparent border border-slate-700 text-slate-300 font-bold rounded-xl text-lg hover:bg-slate-800 flex items-center gap-2">
                   <PlayCircle size={20} /> Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Visual Side (DNA) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1 }}
              className="relative hidden lg:block"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10"></div>
                <DNAHelix /> 
            </motion.div>
        </div>
      </section>

      {/* --- LIVE TICKER BAR (Inspo from Trading Apps) --- */}
      <div className="border-y border-slate-800 bg-[#0F172A]/50 backdrop-blur-md overflow-hidden">
        <div className="flex items-center gap-12 py-4 animate-marquee whitespace-nowrap px-4">
             <span className="text-slate-500 font-mono text-xs">LIVE TRIALS:</span>
             <span className="flex items-center gap-2 text-sm text-slate-300"><Activity size={14} className="text-helix-teal"/> Lupus Phase 1 <span className="text-helix-teal">+12%</span></span>
             <span className="flex items-center gap-2 text-sm text-slate-300"><Activity size={14} className="text-purple-400"/> mRNA Vector <span className="text-red-400">-2.4%</span></span>
             <span className="flex items-center gap-2 text-sm text-slate-300"><Activity size={14} className="text-helix-teal"/> Insulin DAO <span className="text-helix-teal">+5.8%</span></span>
             <span className="flex items-center gap-2 text-sm text-slate-300"><Activity size={14} className="text-blue-400"/> Longevity Net <span className="text-blue-400">+0.9%</span></span>
        </div>
      </div>

      {/* --- ECOSYSTEM CARDS (Inspo: BIO Green Cards) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">The Helix Architecture</h2>
            <p className="text-slate-400 max-w-2xl">A three-layer protocol engineered to commercialize science faster.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="group relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-helix-teal/40 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-helix-teal/5 rounded-full blur-2xl group-hover:bg-helix-teal/10 transition-colors"></div>
                <div className="w-14 h-14 bg-[#020617] rounded-2xl border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="text-helix-teal" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">FDC Oracle</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                    Flare Data Connector acts as the bridge, verifying off-chain results from PubMed and ClinicalTrials.gov directly to the blockchain.
                </p>
            </div>

            {/* Card 2 */}
            <div className="group relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>
                <div className="w-14 h-14 bg-[#020617] rounded-2xl border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Lock className="text-purple-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">IP-NFT Vaults</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                    Intellectual Property is wrapped into fractionable NFTs. Royalties are automatically distributed to token holders via smart contracts.
                </p>
            </div>

            {/* Card 3 */}
            <div className="group relative p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="w-14 h-14 bg-[#020617] rounded-2xl border border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Database className="text-blue-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-2">XRPL Liquidity</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                    Utilizing the XRP Ledger's speed and low fees to create global AMM pools for research tokens, ensuring 24/7 liquidity.
                </p>
            </div>
        </div>
      </section>

      {/* --- RESEARCHER SPOTLIGHT (Inspo: Team Section) --- */}
      <section className="py-24 px-6 border-t border-slate-800 bg-[#0B1221]">
        <div className="max-w-7xl mx-auto">
             <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-serif font-bold mb-2">Top Researchers</h2>
                    <p className="text-slate-400">Back the minds curing the world.</p>
                </div>
                <Link href="/marketplace" className="text-helix-teal hover:underline flex items-center gap-1">View All <ArrowRight size={16}/></Link>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { name: "Dr. Sarah Helix", role: "Immunology", color: "bg-helix-teal" },
                    { name: "James Sinka", role: "Longevity", color: "bg-purple-500" },
                    { name: "BioLab DAO", role: "Collective", color: "bg-blue-500" },
                    { name: "Dr. A. Chen", role: "Neurology", color: "bg-emerald-500" },
                ].map((p, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center group cursor-pointer"
                    >
                        <div className="relative w-full aspect-square rounded-2xl bg-slate-800 mb-4 overflow-hidden border border-slate-700 group-hover:border-slate-500 transition-colors">
                             {/* Placeholder for Headshot */}
                             <div className={`absolute inset-0 opacity-20 ${p.color} group-hover:opacity-30 transition-opacity`}></div>
                             <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-4xl">
                                {p.name[0]}
                             </div>
                        </div>
                        <h3 className="text-lg font-bold text-slate-200">{p.name}</h3>
                        <p className="text-sm text-helix-teal font-mono">{p.role}</p>
                    </motion.div>
                ))}
             </div>
        </div>
      </section>

      {/* --- CTA FOOTER --- */}
      <section className="py-32 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-helix-teal/5 rounded-full blur-[100px] -z-10"></div>
        <h2 className="text-5xl md:text-7xl font-serif font-bold mb-8 tracking-tight">Science is now <br/>Liquid.</h2>
        <Link href="/marketplace">
          <button className="px-12 py-6 bg-slate-100 text-[#020617] font-bold rounded-full text-xl hover:scale-105 transition-transform">
            Start Trading
          </button>
        </Link>
      </section>

    </div>
  );
}