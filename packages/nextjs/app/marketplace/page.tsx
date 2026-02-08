"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // <--- THIS WAS MISSING
import { useHelix } from "~~/context/HelixContext";
import { ProjectCard } from "~~/components/helix/ProjectCard";
import { Search, Filter, Microscope, Activity, HeartPulse, Brain } from "lucide-react";

export default function Marketplace() {
  const { projects } = useHelix();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    { name: "All", icon: null },
    { name: "Oncology", icon: Microscope },
    { name: "Longevity", icon: Activity },
    { name: "Neurology", icon: Brain },
    { name: "Immunology", icon: HeartPulse },
  ];

  // Logic to filter projects
  const filteredProjects = projects.filter((p) => {
    // 1. Filter by Text
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.researcher.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Filter by Category (Mock logic)
    const matchesCategory = category === "All" ? true : 
                            (category === "Oncology" && (p.title.includes("Cancer") || p.title.includes("Vector"))) ||
                            (category === "Neurology" && (p.title.includes("Brain") || p.title.includes("Lupus"))) ||
                            (category === "Immunology" && p.title.includes("Insulin")) ||
                            (category === "Longevity" && p.title.includes("mRNA"));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#020617] py-12 px-4 selection:bg-helix-teal/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Marketplace Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 tracking-tight">
              Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-helix-teal to-blue-500">Marketplace</span>
            </h1>
            <p className="text-slate-400 mt-3 text-lg">Trade intellectual property tokens backed by real science.</p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-[#0B1221] border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-100 focus:border-helix-teal/50 focus:ring-1 focus:ring-helix-teal/50 focus:outline-none w-full sm:w-72 transition-all shadow-lg group-hover:border-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3.5 top-3.5 text-slate-500 group-hover:text-helix-teal transition-colors" size={20} />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
               {categories.map((cat) => (
                 <button
                   key={cat.name}
                   onClick={() => setCategory(cat.name)}
                   className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                     category === cat.name 
                       ? "bg-helix-teal text-[#020617] border-helix-teal shadow-[0_0_15px_rgba(31,174,159,0.3)]" 
                       : "bg-[#0B1221] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200"
                   }`}
                 >
                   {cat.icon && <cat.icon size={16} />}
                   {cat.name}
                 </button>
               ))}
            </div>
          </div>
        </motion.div>

        {/* The Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const lastPoint = project.history[project.history.length - 1];
              return (
                <ProjectCard 
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  researcher={project.researcher}
                  trustScore={project.trustScore}
                  fundingProgress={project.fundingProgress}
                  timeLeft={project.timeLeft}
                  priceYes={lastPoint.priceYes}
                  priceNo={lastPoint.priceNo}
                />
              );
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-[#0B1221]/50 rounded-3xl border border-slate-800 border-dashed"
          >
             <Filter className="mx-auto text-slate-600 mb-4 opacity-50" size={48} />
             <h3 className="text-slate-400 font-mono text-lg">No research found matching filters.</h3>
             <button onClick={() => {setCategory("All"); setSearchTerm("")}} className="text-helix-teal text-sm mt-3 hover:underline font-bold">Clear Filters</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}