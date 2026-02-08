"use client";

import { motion } from "framer-motion";
import { Group, DIFFICULTY_COLORS } from "@/lib/types";

interface SolvedGroupProps {
  group: Group;
}

export default function SolvedGroup({ group }: SolvedGroupProps) {
  const bgColor = DIFFICULTY_COLORS[group.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.6 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="w-full rounded-[8px] py-[14px] px-4 text-center origin-top"
      style={{ backgroundColor: bgColor }}
    >
      <div className="font-extrabold text-[15px] sm:text-base uppercase tracking-[0.05em] text-[#000]">
        {group.category}
      </div>
      <div className="text-[14px] sm:text-[15px] text-[#000] mt-[2px]">
        {group.words.join(", ")}
      </div>
    </motion.div>
  );
}
