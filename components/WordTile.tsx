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
        w-full rounded-[8px] font-bold text-[clamp(13px,3.5vw,16px)]
        uppercase tracking-[0.02em] select-none cursor-pointer
        flex items-center justify-center
        px-1 text-center leading-tight
        ${
          isSelected
            ? "bg-[#5a594e] text-white"
            : "bg-[#efefe6] text-[#000] hover:bg-[#dedad0] active:bg-[#dedad0]"
        }
        ${disabled && !isSelected ? "cursor-not-allowed opacity-60" : ""}
      `}
      style={{ aspectRatio: "1.2 / 1", transition: "background-color 0.1s ease" }}
      whileTap={!disabled && !isWaving ? { scale: 0.93 } : undefined}
      whileHover={!disabled && !isWaving ? { scale: 1.02 } : undefined}
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
