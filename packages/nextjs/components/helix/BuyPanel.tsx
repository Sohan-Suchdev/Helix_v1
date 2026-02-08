"use client";
import { useState } from "react";
import { useHelix } from "~~/context/HelixContext"; 
import { Loader2, CheckCircle } from "lucide-react";

export const BuyPanel = ({ projectId }: { projectId: number }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { buyToken } = useHelix(); 

  // Accept type: boolean (true = YES, false = NO)
  const handleBuy = (isYes: boolean) => {
    if (!amount) return;
    setLoading(true);
    
    setTimeout(() => {
      buyToken(projectId, Number(amount), isYes); // Pass isYes
      setLoading(false);
      setSuccess(true);
      setAmount("");
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-helix-dark border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-serif text-slate-100 mb-4">Trade Position</h3>
      
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3 text-emerald-400 mb-4">
          <CheckCircle size={20} /> <span className="font-mono text-sm">Order Filled!</span>
        </div>
      )}

      <div className="space-y-4">
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

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={() => handleBuy(true)} // Buy YES
            disabled={loading || !amount}
            className="bg-helix-teal hover:bg-emerald-500 text-slate-900 font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Buy YES"}
          </button>
          <button 
             onClick={() => handleBuy(false)} // Buy NO
             disabled={loading || !amount}
             className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "Buy NO"}
          </button>
        </div>
      </div>
    </div>
  );
};
