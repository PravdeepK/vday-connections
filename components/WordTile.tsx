"use client";

import { motion } from "framer-motion";

interface WordTileProps {
  word: string;
  isSelected: boolean;
  onClick: (word: string) => void;
  disabled: boolean;
}

export default function WordTile({
  word,
  isSelected,
  onClick,
  disabled,
}: WordTileProps) {
  return (
    <motion.button
      layout
      onClick={() => !disabled && onClick(word)}
      disabled={disabled}
      className={`
        w-full aspect-[2/1] sm:aspect-[2.2/1] rounded-lg font-semibold text-sm sm:text-base
        uppercase tracking-wide select-none cursor-pointer
        transition-colors duration-150 flex items-center justify-center
        px-2 text-center leading-tight
        ${
          isSelected
            ? "bg-[#5a594e] text-white"
            : "bg-[#efefe6] text-[#000] hover:bg-[#dedad0]"
        }
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
      `}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {word}
    </motion.button>
  );
}
