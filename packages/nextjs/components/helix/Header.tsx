"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Activity, PlusCircle, Home } from "lucide-react";

export const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Marketplace", href: "/", icon: Home },
    { name: "Submit Proposal", href: "/create", icon: PlusCircle },
  ];

  return (
    <div className="sticky top-0 z-50 w-full border-b border-slate-800 bg-helix-navy/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
        
        {/* 1. Logo */}
        <Link href="/" className="flex items-center space-x-2 group mr-8">
           <div className="bg-helix-teal/10 p-2 rounded-lg group-hover:bg-helix-teal/20 transition-colors">
             <Activity className="text-helix-teal" size={24} />
           </div>
           <span className="font-serif text-xl font-bold tracking-tight text-slate-100">
             HELIX <span className="text-helix-teal">SCIENCE</span>
           </span>
        </Link>

        {/* 2. Navigation Links (The part you were missing!) */}
        <nav className="hidden md:flex flex-1 items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-helix-teal" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <link.icon size={16} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Wallet Button */}
        <div className="flex items-center">
            <ConnectButton accountStatus="address" showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </div>
  );
};
