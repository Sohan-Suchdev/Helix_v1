"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useBalance, useAccount, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";
import { Activity, PlusCircle, Home, AlertTriangle } from "lucide-react";
import { GetFxrpModal } from "~~/components/helix/GetFxrpModal";

function shortAddr(addr?: string) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
function initialsFromAddr(addr?: string) {
  if (!addr) return "??";
  return addr.slice(2, 4).toUpperCase();
}

const FXRP = "0x2222222222222222222222222222222222222222" as `0x${string}`;

export const Header = () => {
  const pathname = usePathname();
  const { address } = useAccount();
  const [fxrpOpen, setFxrpOpen] = useState(false);

  // Native balance
  const { data: nativeBal } = useBalance({ address, watch: true });
  const balanceStr =
    nativeBal && nativeBal.formatted
      ? `${Number(nativeBal.formatted).toFixed(4)} ${nativeBal.symbol}`
      : "0.0000";

  // FXRP balance (if configured)
  const fxrpBal = useReadContract({
    abi: erc20Abi,
    address: FXRP,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!(FXRP && address) },
  });
  const fxrpStr = useMemo(() => {
    const v = fxrpBal.data as bigint | undefined;
    if (!v) return null;
    const n = Number(formatUnits(v, 18));
    return `${n.toFixed(2)} FXRP`;
  }, [fxrpBal.data]);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: Activity },
    { name: "Submit Proposal", href: "/create", icon: PlusCircle },
  ];

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-800 bg-helix-navy/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group mr-8">
          <div className="bg-helix-teal/10 p-2 rounded-lg group-hover:bg-helix-teal/20 transition-colors">
            <Activity className="text-helix-teal" size={24} />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-slate-100">
            HELIX <span className="text-helix-teal">SCIENCE</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex flex-1 items-center space-x-6">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                  isActive ? "text-helix-teal" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <link.icon size={16} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Network dropdown + FXRP + Wallet chip */}
        <div className="flex items-center gap-3">
          {/* Show Get FXRP button if we configured FXRP */}
          {FXRP && (
            <button
              onClick={() => setFxrpOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500 text-sm"
              title="Bridge or swap to FXRP"
            >
              Get FXRP
            </button>
          )}

          <ConnectButton.Custom>
            {({ account, chain, mounted, openChainModal, openConnectModal, openAccountModal }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors text-sm"
                  >
                    Connect
                  </button>
                );
              }

              // Network chip
              const networkUnsupported = chain?.unsupported;
              const networkName = chain?.name || "Unknown";
              const networkIconUrl = (chain as any)?.iconUrl as string | undefined;

              return (
                <>
                  <button
                    onClick={openChainModal}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
                      networkUnsupported
                        ? "bg-red-900/30 border-red-700 text-red-300 hover:bg-red-900/40"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                    title={networkUnsupported ? "Unsupported network" : "Change network"}
                  >
                    {networkIconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={networkIconUrl}
                        alt={networkName}
                        className="w-5 h-5 rounded-full"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-700" />
                    )}
                    <span className="font-mono">{networkName}</span>
                    {networkUnsupported && <AlertTriangle size={14} className="text-red-300" />}
                  </button>

                  {/* FXRP balance pill (if FXRP configured) */}
                  {FXRP && fxrpStr && (
                    <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono">
                      {fxrpStr}
                    </div>
                  )}

                  {/* Wallet chip */}
                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors"
                    title={`${shortAddr(account?.address)} — click for details`}
                  >
                    <div className="w-8 h-8 rounded-full bg-helix-teal/20 border border-helix-teal/40 flex items-center justify-center text-helix-teal text-xs font-bold">
                      {initialsFromAddr(account?.address)}
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-slate-200 text-sm font-mono">
                        {balanceStr}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {shortAddr(account?.address)}
                      </span>
                    </div>
                  </button>
                </>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>

      {/* FXRP modal */}
      {FXRP && (
        <GetFxrpModal
          open={fxrpOpen}
          onClose={() => setFxrpOpen(false)}
          demoMintEnabled={false} // set true only if your FXRP is a MockToken with mint()
        />
      )}
    </div>
  );
};
