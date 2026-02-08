"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export const BuyPanel = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBuy = () => {
    setLoading(true);
    // Simulate transaction
    setTimeout(() => {
      setLoading(false);
      setAmount("");
      alert("Transaction Submitted to Coston2!");
    }, 2000);
  };

  return (
    <div className="bg-helix-dark border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-serif text-slate-100 mb-4">Trade Position</h3>
      
      <div className="space-y-4">
        {/* Input */}
        <div>
          <label className="text-xs text-slate-400 font-mono">Amount (USDC)</label>
          <div className="relative mt-2">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none font-mono"
              placeholder="0.00"
            />
            <div className="absolute right-3 top-3 text-slate-500 text-sm">USDC</div>
          </div>
        </div>

        {/* Calculations */}
        {amount && (
          <div className="p-3 bg-helix-teal/10 rounded-lg border border-helix-teal/20">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Receive:</span>
              <span className="text-helix-teal font-mono">≈ {(Number(amount) * 1.2).toFixed(2)} YES</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-slate-500">Price Impact:</span>
              <span className="text-emerald-400 font-mono">+0.4%</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={handleBuy}
            disabled={loading}
            className="bg-helix-teal hover:bg-emerald-500 text-slate-900 font-bold py-3 rounded-lg transition-colors flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Buy YES"}
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-lg transition-colors">
            Buy NO
          </button>
        </div>
      </div>
    </div>
  );
};
