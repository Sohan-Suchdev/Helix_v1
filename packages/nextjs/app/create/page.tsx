"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, UploadCloud, PlayCircle } from "lucide-react";
// If you use Scaffold-ETH hooks, import them:
/// import { useAccount } from "wagmi";
/// import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

// Local components
import { DNAHelix } from "~~/components/helix/DNAHelix";
import { AuditScanner } from "~~/components/helix/AuditScanner";
// If you prefer raw ethers v6:
/// import { ethers } from "ethers";
/// import HelixMarketAbi from "~~/contracts/abi/HelixMarket.json"; // update path
/// const HELIX_ADDRESS = process.env.NEXT_PUBLIC_HELIX_ADDRESS!;

export default function CreateProposalPage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = useState("");
  const [auditUrl, setAuditUrl] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // If using Scaffold-ETH
  /// const { address } = useAccount();
  /// const { writeAsync: createProposalWrite } = useScaffoldContractWrite({
  ///   contractName: "HelixMarket",
  ///   functionName: "createProposal",
  ///   args: [title, address || "0x0000000000000000000000000000000000000000", auditUrl],
  ///   blockConfirmations: 1,
  /// });

  const onValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!title || !auditUrl) {
      setSubmitError("Please fill in Title and Audit URL.");
      return;
    }
    setScanning(true);
  };

  const handleScanComplete = async () => {
    setScanComplete(true);
    setScanning(false);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // OPTION 1: Scaffold-ETH hooks (uncomment if using)
      // await createProposalWrite();

      // OPTION 2: Raw Ethers v6 (uncomment if using)
      // const provider = new ethers.BrowserProvider((window as any).ethereum);
      // const signer = await provider.getSigner();
      // const helix = new ethers.Contract(HELIX_ADDRESS, HelixMarketAbi, signer);
      // await helix.createProposal(title, await signer.getAddress(), auditUrl);

      // After creation, optionally store dataUrl for later upload or redirect with flash message
      setIsSubmitting(false);
      router.push("/marketplace"); // or /project/[id] if you have that route
    } catch (err: any) {
      console.error("createProposal error:", err);
      setSubmitError("Transaction failed. Please check your wallet and network.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden font-sans selection:bg-helix-teal/30">
      {/* Top hero header section matching Landing */}
      <section className="relative min-h-[40vh] flex flex-col items-center justify-center px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-helix-teal/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
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

            <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-3 leading-[0.95]">
              Submit a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-helix-teal to-purple-400">
                Research Proposal
              </span>
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

          {/* Visual side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10"></div>
            <DNAHelix />
          </motion.div>
        </div>
      </section>

      {/* Main content card */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-lg p-8 shadow-[0_0_30px_rgba(31,174,159,0.15)]"
          >
            {!scanning ? (
              <form onSubmit={onValidate} className="space-y-6">
                <div>
                  <label className="block text-slate-400 text-sm font-mono mb-2">Project Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none"
                    placeholder="e.g. mRNA Lung Cancer Vaccine"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-mono mb-2">Audit URL (FDC-verifiable)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={auditUrl}
                      onChange={e => setAuditUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none"
                      placeholder="https://clinicaltrials.gov/api/v2/studies/NCT012345"
                      required
                    />
                    <button type="button" className="p-3 bg-slate-800 rounded-lg text-slate-400 hover:text-white" title="Paste from clipboard" onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        setAuditUrl(text);
                      } catch {}
                    }}>
                      <UploadCloud size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-sm font-mono mb-2">Data URL (IPFS/Arweave, optional)</label>
                  <input
                    type="url"
                    value={dataUrl}
                    onChange={e => setDataUrl(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-100 focus:border-helix-teal focus:outline-none"
                    placeholder="ipfs://Qm..."
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    You can upload research data later via “Upload Data” once the market is created.
                  </p>
                </div>

                {submitError && (
                  <div className="text-red-400 text-sm font-mono">{submitError}</div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-helix-teal text-[#020617] font-bold py-4 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
                  >
                    Initialize Validation <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            ) : (
              <AuditScanner onComplete={handleScanComplete} />
            )}

            {/* Submission overlay */}
            {isSubmitting && (
              <div className="mt-8 text-center text-slate-400">
                Submitting transaction… Please confirm in your wallet.
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}