"use client";

import { motion } from "framer-motion";

interface WordTileProps {
  word: string;
  isSelected: boolean;
  onClick: (word: string) => void;
  disabled: boolean;
  waveDelay?: number | null;
}

export default function WordTile({
  word,
  isSelected,
  onClick,
  disabled,
  waveDelay,
}: WordTileProps) {
  const isWaving = waveDelay !== null && waveDelay !== undefined;

  return (
    <motion.button
      layout
      onClick={() => !disabled && onClick(word)}
      disabled={disabled || isWaving}
      className={`
        w-full aspect-[2/1] sm:aspect-[2.2/1] rounded-lg font-semibold text-sm sm:text-base
        uppercase tracking-wide select-none cursor-pointer
        flex items-center justify-center
        px-2 text-center leading-tight
        ${
          isSelected
            ? "bg-[#5a594e] text-white"
            : "bg-[#efefe6] text-[#000] hover:bg-[#dedad0]"
        }
        ${disabled ? "cursor-not-allowed opacity-60" : ""}
      `}
      whileTap={!disabled && !isWaving ? { scale: 0.97 } : undefined}
      initial={false}
      animate={
        isWaving
          ? {
              y: [0, -8, 0],
            }
          : { y: 0 }
      }
      exit={{
        opacity: 0,
        scale: 0.6,
        transition: { duration: 0.15, ease: "easeIn" },
      }}
      transition={
        isWaving
          ? {
              y: {
                duration: 0.2,
                delay: waveDelay!,
                ease: [0.33, 0, 0.67, 1],
              },
              layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
            }
          : {
              layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
            }
      }
    >
      {word}
    </motion.button>
  );
}
