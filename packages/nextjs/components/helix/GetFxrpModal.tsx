"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useAccount, useReadContract, useWalletClient, usePublicClient } from "wagmi";
import { erc20Abi, parseAbi, formatUnits } from "viem";
import { X, ArrowRight, RefreshCcw, Wallet, FlaskConical } from "lucide-react";

// Demo values — replace if needed
const FXRP = "0x2222222222222222222222222222222222222222" as `0x${string}`;
const DEX_URL = "https://dex.demo/swap?output=0x2222222222222222222222222222222222222222";
const BRIDGE_URL = "https://bridge.demo/";

const MOCK_ABI = parseAbi(["function mint(address to, uint256 amount) external"]);

export function GetFxrpModal({
  open,
  onClose,
  demoMintEnabled = false,
}: {
  open: boolean;
  onClose: () => void;
  demoMintEnabled?: boolean;
}) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [mounted, setMounted] = useState(false);
  const [minting, setMinting] = useState(false);
  const [tab, setTab] = useState<"bridge" | "swap">("bridge");

  // SSR-safe: only portal when mounted
  useEffect(() => setMounted(true), []);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // FXRP balance
  const fxrpBal = useReadContract({
    abi: erc20Abi,
    address: FXRP,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!(FXRP && address) },
  });

  const fxrpStr = useMemo(() => {
    const v = fxrpBal.data as bigint | undefined;
    if (!v) return "0.00 FXRP";
    const n = Number(formatUnits(v, 18));
    return `${n.toFixed(2)} FXRP`;
  }, [fxrpBal.data]);

  useEffect(() => {
    if (!open) {
      setTab("bridge");
      setMinting(false);
    }
  }, [open]);

  const onMintDemo = async () => {
    if (!FXRP || !walletClient || !address) return;
    try {
      setMinting(true);
      const hash = await walletClient.writeContract({
        address: FXRP,
        abi: MOCK_ABI,
        functionName: "mint",
        args: [address, 1000n * 10n ** 18n], // 1000 FXRP
      });
      await publicClient!.waitForTransactionReceipt({ hash });
    } catch (e) {
      console.error("mint error", e);
    } finally {
      setMinting(false);
    }
  };

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop (click to close) */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered card (immune to parent transforms) */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4"
        onClick={e => e.stopPropagation()} // keep backdrop clickable
      >
        <div
          role="dialog"
          aria-modal="true"
          className="w-[90vw] max-w-lg max-h-[80vh] overflow-auto rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="text-helix-teal" size={20} />
              <h3 className="text-slate-100 font-bold">Get FXRP</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
              <X size={18} />
            </button>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-slate-400">Your FXRP balance</div>
            <div className="font-mono text-slate-100">{fxrpStr}</div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTab("bridge")}
              className={`px-3 py-2 rounded-lg text-sm font-bold border ${
                tab === "bridge"
                  ? "bg-helix-teal text-[#020617] border-helix-teal"
                  : "bg-[#0B1221] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              Bridge XRP → FXRP
            </button>
            <button
              onClick={() => setTab("swap")}
              className={`px-3 py-2 rounded-lg text-sm font-bold border ${
                tab === "swap"
                  ? "bg-helix-teal text-[#020617] border-helix-teal"
                  : "bg-[#0B1221] text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              Swap to FXRP
            </button>
          </div>

          {/* Content */}
          {tab === "bridge" ? (
            <div className="space-y-3">
              <p className="text-slate-400 text-sm">
                FXRP is an ERC‑20 representation of XRP on Flare. Bridge your XRP from XRPL to FXRP via a trusted bridge to use it in Helix.
              </p>
              <div className="bg-[#0B1221] border border-slate-800 rounded-xl p-4 text-sm">
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>Ensure you’re connected to Flare/Coston2 in the header network dropdown.</li>
                  <li>Use an XRPL wallet (e.g., Xumm) to initiate the bridge.</li>
                  <li>On completion, you’ll receive FXRP in your EVM wallet.</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <a
                  href={BRIDGE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700"
                >
                  Open Bridge <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-slate-400 text-sm">
                Already on Flare? Swap to FXRP on a DEX. We’ll preselect FXRP for convenience.
              </p>
              <div className="flex gap-3">
                <a
                  href={DEX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700"
                >
                  Open DEX <ArrowRight size={16} />
                </a>
              </div>

              {demoMintEnabled && (
                <div className="pt-3">
                  <button
                    onClick={onMintDemo}
                    disabled={minting || !walletClient}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg ${
                      minting ? "bg-helix-teal/40 cursor-not-allowed" : "bg-helix-teal hover:bg-emerald-400"
                    } text-[#020617] font-bold`}
                  >
                    {minting ? (
                      <>
                        <RefreshCcw className="animate-spin" size={16} /> Minting…
                      </>
                    ) : (
                      <>
                        <FlaskConical size={16} /> Mint Demo FXRP (1000)
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500 mt-2">
                    Demo only. Requires a Mock FXRP token with mint().
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}