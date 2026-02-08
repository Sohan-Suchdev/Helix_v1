"use client";

import { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// Helper to generate fake history for the "Zoomed Out" views
const generateStaticHistory = (points: number, volatility: number) => {
  let currentYes = 0.5;
  return Array.from({ length: points }, (_, i) => {
    const change = (Math.random() - 0.5) * volatility;
    currentYes = Math.max(0.1, Math.min(0.9, currentYes + change));
    return {
      time: i,
      priceYes: currentYes,
      priceNo: 1 - currentYes,
    };
  });
};

export const BondingCurveChart = ({ data }: { data: { time: number; priceYes: number; priceNo: number }[] }) => {
  const [timeframe, setTimeframe] = useState("1H");

  // Generate fake datasets for the other tabs
  const history1D = useMemo(() => generateStaticHistory(50, 0.05), []);
  const history1W = useMemo(() => generateStaticHistory(70, 0.08), []);
  const history1M = useMemo(() => generateStaticHistory(100, 0.15), []);
  const history1Y = useMemo(() => generateStaticHistory(120, 0.20), []);

  const activeData = useMemo(() => {
    switch (timeframe) {
      case "1H": return data;
      case "1D": return history1D;
      case "1W": return history1W;
      case "1M": return history1M;
      case "1Y": return history1Y;
      default: return data;
    }
  }, [timeframe, data, history1D, history1W, history1M, history1Y]);

  const timeframes = ["1H", "1D", "1W", "1M", "1Y"];

  return (
    <div className="h-full w-full p-6 flex flex-col relative z-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-sm font-serif text-slate-100 font-bold">Market Sentiment</h3>
           <div className="flex items-center gap-2 mt-1">
             <span className="text-xs text-slate-500 font-mono">YES vs NO Token Price</span>
             {timeframe === "1H" && (
                <span className="flex items-center text-[10px] text-helix-teal bg-helix-teal/10 px-1 rounded animate-pulse">
                   ● LIVE
                </span>
             )}
           </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-[#020617] rounded-lg p-1 border border-slate-800 z-20">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-[10px] font-mono rounded-md transition-all ${
                timeframe === tf 
                  ? "bg-helix-teal text-[#020617] font-bold shadow-[0_0_10px_rgba(31,174,159,0.3)]" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart Container - Fixed min-height to prevent "height(-1)" error */}
      <div className="flex-1 w-full min-h-[300px] min-w-0"> 
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeData}>
            <defs>
              <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1FAE9F" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#1FAE9F" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" hide />
            <YAxis domain={[0, 1]} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '12px' }}
              labelStyle={{ display: 'none' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value: number, name: string) => [
                  `$${value.toFixed(2)}`, 
                  name === "priceYes" ? "YES Token" : "NO Token"
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="priceNo" 
              stroke="#ef4444" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorNo)" 
              animationDuration={500}
            />
            <Area 
              type="monotone" 
              dataKey="priceYes" 
              stroke="#1FAE9F" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorYes)" 
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};