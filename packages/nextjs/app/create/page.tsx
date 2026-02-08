"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, UploadCloud, PlayCircle } from "lucide-react";

import { DNAHelix } from "~~/components/helix/DNAHelix";
import { AuditScanner } from "~~/components/helix/AuditScanner";

// wagmi + viem
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { parseAbi, decodeEventLog } from "viem";

// local demo storage
import {
  addProposalMeta,
  setMyResearcherNumber,
} from "~~/services/store/localData";

// Inline minimal ABI (no JSON import)
const HELIX_ABI = parseAbi([
  "function createProposal(string _name, address _researcher, string _auditUrl)",
  "event MarketCreated(uint256 indexed id, string name, address researcher)",
]);

const HELIX_ADDRESS = "0x1111111111111111111111111111111111111111" as `0x${string}`;

export default function CreateProposalPage() {
  const router = useRouter();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  // Form state
  const [title, setTitle] = useState("");
  const [auditUrl, setAuditUrl] = useState("");
  const [dataUrl, setDataUrl] = useState(""); // optional
  const [researcherNumber, setResearcherNumber] = useState("");

  // UI state
  const [scanning, setScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!title || !auditUrl || !researcherNumber) {
      setSubmitError("Please fill in Title, Audit URL, and Researcher Number.");
      return;
    }
    setScanning(true);
  };

  const handleScanComplete = async () => {
    try {
      setScanning(false);
      setIsSubmitting(true);
      setSubmitError(null);

      if (!HELIX_ADDRESS) throw new Error("HELIX address missing (NEXT_PUBLIC_HELIX_ADDRESS)");
      if (!walletClient || !address) throw new Error("Connect wallet first");

      // Write transaction via walletClient (viem)
      const hash = await walletClient.writeContract({
        address: HELIX_ADDRESS,
        abi: HELIX_ABI,
        functionName: "createProposal",
        args: [title, address, auditUrl],
      });

      // Wait for receipt
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });

      // Parse MarketCreated event for the new id
      let newId: number | null = null;
      for (const log of receipt.logs) {
        try {
          const parsed = decodeEventLog({
            abi: HELIX_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (parsed.eventName === "MarketCreated") {
            newId = Number(parsed.args.id);
            break;
          }
        } catch {
          // ignore
        }
      }

      // Save demo metadata so it shows on Marketplace immediately
      if (newId !== null) {
        addProposalMeta({
          id: newId,
          title,
          auditUrl,
          researcherNumber,
          creator: address,
          createdAt: Date.now(),
        });
        setMyResearcherNumber(researcherNumber);
      }

      setIsSubmitting(false);
      router.push(newId !== null ? `/marketplace/project?id=${newId}` : "/marketplace");
    } catch (err: any) {
      console.error("createProposal error:", err);
      setSubmitError(err?.message || "Transaction failed. Please check your wallet and network.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden font-sans selection:bg-helix-teal/30">
      {/* Hero */}
      <section className="relative min-h-[40vh] flex flex-col items-center justify-center px-4">
        {/* Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-helix-teal/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-helix-teal/10 border border-helix-teal/20 text-helix-teal text-xs font-mono mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-helix-teal animate-pulse"></span>
              DeSci Protocol V1.0
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-3 leading-[0.95]">
              Submit a <span className="text-transparent bg-clip-text bg-gradient-to-r from-helix-teal to-purple-400">Research Proposal</span>
            </h1>
            <p className="text-slate-400 max-w-xl mb-4">
              Define your project and audit endpoint. We’ll tokenize the market and prepare it for funding in ETH and FXRP.
            </p>
            <div className="flex gap-3">
              <Link href="/marketplace">
                <button className="px-6 py-3 bg-transparent border border-slate-700 text-slate-300 font-bold rounded-xl hover:bg-slate-800 flex items-center gap-2">
                  <PlayCircle size={18} /> Explore Markets
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10"></div>
            <DNAHelix />
          </motion.div>
        </div>
      </section>

      {/* Form card */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-lg p-8 shadow-[0_0_30px_rgba(31,174,159,0.15)]">
            {!scanning ? (
              <form onSubmit={onValidate} className="space-y-6">
                <div>
                  <label className="block text-slate-400 text-sm font-mono mb-2">Project Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none" placeholder="e.g. mRNA Lung Cancer Vaccine" required />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-mono mb-2">Audit URL (FDC-verifiable)</label>
                  <div className="flex gap-2">
                    <input type="url" value={auditUrl} onChange={e => setAuditUrl(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none" placeholder="https://clinicaltrials.gov/api/v2/studies/NCT012345" required />
                    <button type="button" className="p-3 bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Paste from clipboard" onClick={async () => { try { const t = await navigator.clipboard.readText(); setAuditUrl(t); } catch {} }}>
                      <UploadCloud size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-mono mb-2">Researcher Number (Demo identity)</label>
                  <input type="text" value={researcherNumber} onChange={e => setResearcherNumber(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none" placeholder="e.g. 314159" required />
                  <p className="text-xs text-slate-500 mt-2">Used to associate you with the project and disable trading for insiders (demo).</p>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-mono mb-2">Data URL (IPFS/Arweave, optional)</label>
                  <input type="url" value={dataUrl} onChange={e => setDataUrl(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none" placeholder="ipfs://Qm..." />
                </div>

                {submitError && <div className="text-red-400 text-sm font-mono">{submitError}</div>}

                <div className="pt-2">
                  <button type="submit" className="w-full bg-helix-teal text-[#020617] font-bold py-4 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
                    Initialize Validation <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            ) : (
              <AuditScanner onComplete={handleScanComplete} />
            )}

            {isSubmitting && <div className="mt-8 text-center text-slate-400">Submitting transaction… Please confirm in your wallet.</div>}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
