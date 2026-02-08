"use client";
import { motion } from "framer-motion";

export const DNAHelix = () => {
  const dots = Array.from({ length: 20 });

  return (
    <div className="relative flex items-center justify-center h-[300px] w-full perspective-1000">
      {dots.map((_, i) => (
        <DNAStrand key={i} index={i} />
      ))}
    </div>
  );
};

const DNAStrand = ({ index }: { index: number }) => {
  return (
    <motion.div
      className="absolute w-[2px] h-[120px]"
      style={{ left: `calc(50% - 100px + ${index * 12}px)` }}
      animate={{ rotateX: [0, 360] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: -index * 0.4 }}
    >
      {/* Top Dot */}
      <motion.div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-helix-teal shadow-[0_0_10px_#1FAE9F]"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: -index * 0.2 }}
      />
      {/* Connecting Line */}
      <div className="absolute top-1.5 bottom-1.5 left-1/2 -translate-x-1/2 w-[1px] bg-helix-teal/20" />
      {/* Bottom Dot */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, delay: -index * 0.2 }}
      />
    </motion.div>
  );
};