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
      className="w-full rounded-lg py-3 px-4 text-center origin-top"
      style={{ backgroundColor: bgColor }}
    >
      <div className="font-extrabold text-sm sm:text-base uppercase tracking-wide text-[#000]">
        {group.category}
      </div>
      <div className="text-sm sm:text-base text-[#000] mt-0.5">
        {group.words.join(", ")}
      </div>
    </motion.div>
  );
}
