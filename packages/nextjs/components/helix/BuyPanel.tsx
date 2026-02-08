"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Loader2, CheckCircle, ShieldAlert } from "lucide-react";
import { useHelix } from "~~/context/HelixContext";
import {
  getProposalMeta,
  getMyResearcherNumber,
} from "~~/services/store/localData";

type Props = {
  projectId: number;
  isInsider?: boolean; // optional override
};

export const BuyPanel = ({ projectId, isInsider: isInsiderProp }: Props) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { address } = useAccount();
  const { projects, buyToken } = useHelix();

  // Find project in your context by id
  const project = useMemo(
    () => projects.find((p: any) => p.id === projectId),
    [projects, projectId],
  );

  // Demo meta + researcher number
  const meta = getProposalMeta(projectId);
  const myNum = getMyResearcherNumber();

  const isResearcherAddr =
    !!address &&
    !!project?.researcher &&
    address.toLowerCase() === project.researcher.toLowerCase();

  const isInsiderNumber =
    !!myNum && !!meta?.researcherNumber && myNum === meta.researcherNumber;

  // Final insider flag (prop override > auto-compute)
  const isInsider = typeof isInsiderProp === "boolean"
    ? isInsiderProp
    : (isResearcherAddr || isInsiderNumber);

  // Accept type: boolean (true = YES, false = NO)
  const handleBuy = (isYes: boolean) => {
    if (!amount || isInsider || loading) return;
    setLoading(true);

    // Simulated async fill (your context handles the actual state update)
    setTimeout(() => {
      buyToken(projectId, Number(amount), isYes);
      setLoading(false);
      setSuccess(true);
      setAmount("");
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="bg-helix-dark border border-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-serif text-slate-100 mb-4">Trade Position</h3>

      {/* Insider banner */}
      {isInsider && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center gap-3 text-yellow-300 mb-4">
          <ShieldAlert size={20} />
          <span className="font-mono text-sm">
            Insider rule active: you’re associated with this project. Trading is disabled.
          </span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 flex items-center gap-3 text-emerald-400 mb-4">
          <CheckCircle size={20} />
          <span className="font-mono text-sm">Order Filled!</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 font-mono">Amount (USDC)</label>
          <div className="relative mt-2">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="0.00"
              disabled={isInsider || loading}
            />
            <div className="absolute right-3 top-3 text-slate-500 text-sm">USDC</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => handleBuy(true)} // Buy YES
            disabled={loading || !amount || isInsider}
            className={`font-bold py-3 rounded-lg transition-colors ${
              loading || !amount || isInsider
                ? "bg-helix-teal/40 text-slate-900 cursor-not-allowed"
                : "bg-helix-teal hover:bg-emerald-500 text-slate-900"
            }`}
            title={isInsider ? "Insider rule active — trading disabled" : "Buy YES"}
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Buy YES"}
          </button>

          <button
            onClick={() => handleBuy(false)} // Buy NO
            disabled={loading || !amount || isInsider}
            className={`font-bold py-3 rounded-lg transition-colors ${
              loading || !amount || isInsider
                ? "bg-red-500/40 text-white/70 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            title={isInsider ? "Insider rule active — trading disabled" : "Buy NO"}
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Buy NO"}
          </button>
        </div>
      </div>
    </div>
  );
};
