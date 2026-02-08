"use client";

import { ProjectCard } from "~~/components/helix/ProjectCard";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-helix-navy py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-16 max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-4 tracking-tight">
          Funding the Cure. <br />
          <span className="text-helix-teal bg-helix-teal/10 px-2 rounded-lg">Democratizing</span> the Science.
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          The first decentralized marketplace for outcome-based medical research grants. 
          Backed by the XRP Ledger and verified by Flare FDC.
        </p>
      </div>

      {/* The Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-6">
        {/* Card 1: Lupus Cure */}
        <ProjectCard 
          id={0}
          title="Lupus Cure Phase 1"
          researcher="Dr. S. Helix"
          trustScore={98}
          fundingProgress={65}
          timeLeft="42h 12m"
        />
         {/* Card 2: mRNA Vector */}
         <ProjectCard 
          id={1}
          title="mRNA Delivery Vector"
          researcher="BioLab Inc"
          trustScore={84}
          fundingProgress={12}
          timeLeft="18h 30m"
        />
         {/* Card 3: Insulin Study */}
         <ProjectCard 
          id={2}
          title="Generic Insulin Study"
          researcher="OpenInsulin"
          trustScore={91}
          fundingProgress={89}
          timeLeft="04h 05m"
        />
      </div>
    </div>
  );
};

export default Home;
