"use client";

import { motion } from "framer-motion";
import { Group, DIFFICULTY_COLORS } from "@/lib/types";

interface SolvedGroupProps {
  group: Group;
  index: number;
}

export default function SolvedGroup({ group, index }: SolvedGroupProps) {
  const bgColor = DIFFICULTY_COLORS[group.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scaleY: 0.5 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full rounded-lg py-3 px-4 text-center"
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
