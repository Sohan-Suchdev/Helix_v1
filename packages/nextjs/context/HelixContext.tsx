"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- Data Types ---
export type Project = {
  id: number;
  title: string;
  researcher: string;
  description: string;
  trustScore: number;
  fundingProgress: number;
  timeLeft: string;
  target: number;
  status: "Active" | "Funded" | "Vested";
  // AMM State
  poolYes: number; // Virtual liquidity for YES
  poolNo: number;  // Virtual liquidity for NO
  history: { time: number; priceYes: number; priceNo: number }[]; 
};

// --- Helper: Calculate Price based on Pools ---
const getPrices = (yes: number, no: number) => {
  const total = yes + no;
  return {
    priceYes: yes / total,
    priceNo: no / total,
  };
};

// --- The Mock Data (Initialized with Pools) ---
const INITIAL_PROJECTS: Project[] = [
  {
    id: 0,
    title: "Lupus Cure Phase 1",
    researcher: "Dr. S. Helix",
    description: "A novel approach to autoimmune suppression using mRNA vectors verified by Flare FDC data attestations.",
    trustScore: 98,
    fundingProgress: 65,
    timeLeft: "42h 12m",
    target: 50000,
    status: "Active",
    poolYes: 65000, // Starts at $0.65
    poolNo: 35000,  // Starts at $0.35
    history: [], // Will fill on init
  },
  {
    id: 1,
    title: "mRNA Delivery Vector",
    researcher: "BioLab Inc",
    description: "High-efficiency lipid nanoparticles for targeted drug delivery to pancreatic beta cells.",
    trustScore: 84,
    fundingProgress: 12,
    timeLeft: "18h 30m",
    target: 120000,
    status: "Active",
    poolYes: 30000, // Starts at $0.30
    poolNo: 70000,  // Starts at $0.70
    history: [],
  },
  {
    id: 2,
    title: "Generic Insulin Study",
    researcher: "OpenInsulinDAO",
    description: "Community-funded clinical trial for open-source insulin production protocols.",
    trustScore: 91,
    fundingProgress: 89,
    timeLeft: "04h 05m",
    target: 25000,
    status: "Active",
    poolYes: 85000, // Starts at $0.85
    poolNo: 15000,  // Starts at $0.15
    history: [],
  },
];

interface HelixContextType {
  projects: Project[];
  buyToken: (id: number, amount: number, isYes: boolean) => void;
}

const HelixContext = createContext<HelixContextType | undefined>(undefined);

export const HelixProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize history based on starting pools
  const [projects, setProjects] = useState<Project[]>(() => 
    INITIAL_PROJECTS.map(p => {
       const { priceYes, priceNo } = getPrices(p.poolYes, p.poolNo);
       // Create fake history leading up to current price
       const history = Array.from({ length: 30 }, (_, i) => ({
           time: Date.now() - (30 - i) * 1000,
           priceYes: priceYes + (Math.random() * 0.02 - 0.01), // Tiny jitter
           priceNo: priceNo + (Math.random() * 0.02 - 0.01),
       }));
       return { ...p, history };
    })
  );

  // --- AMM SIMULATION LOOP ---
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects((currentProjects) =>
        currentProjects.map((p) => {
          // 1. Random "Market Noise" trading
          // Simulate a small random trade of $100 - $500
          const tradeAmount = 100 + Math.random() * 400;
          const isBuyYes = Math.random() > 0.5;

          const newPoolYes = isBuyYes ? p.poolYes + tradeAmount : p.poolYes;
          const newPoolNo = isBuyYes ? p.poolNo : p.poolNo + tradeAmount;

          const { priceYes, priceNo } = getPrices(newPoolYes, newPoolNo);

          const newHistory = [...p.history.slice(1), { 
              time: Date.now(), 
              priceYes: priceYes, 
              priceNo: priceNo 
          }];
          
          return { 
            ...p, 
            poolYes: newPoolYes, 
            poolNo: newPoolNo, 
            history: newHistory 
          };
        })
      );
    }, 1000); // 1 Second tick

    return () => clearInterval(interval);
  }, []);

  // --- User Action: Buy Token ---
  const buyToken = (id: number, amount: number, isYes: boolean) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // AMM Logic: Adding USD to one side of the pool
          const newPoolYes = isYes ? p.poolYes + amount : p.poolYes;
          const newPoolNo = isYes ? p.poolNo : p.poolNo + amount;

          const { priceYes, priceNo } = getPrices(newPoolYes, newPoolNo);

          const newHistory = [...p.history.slice(1), { 
              time: Date.now(), 
              priceYes: priceYes, 
              priceNo: priceNo 
          }];

          // Update Funding % (Visual only)
          const newFunding = isYes 
            ? Math.min(100, p.fundingProgress + (amount / p.target) * 100) 
            : p.fundingProgress;

          return { 
            ...p, 
            fundingProgress: newFunding,
            poolYes: newPoolYes,
            poolNo: newPoolNo,
            history: newHistory 
          };
        }
        return p;
      })
    );
  };

  return (
    <HelixContext.Provider value={{ projects, buyToken }}>
      {children}
    </HelixContext.Provider>
  );
};

export const useHelix = () => {
  const context = useContext(HelixContext);
  if (!context) throw new Error("useHelix must be used within a HelixProvider");
  return context;
};