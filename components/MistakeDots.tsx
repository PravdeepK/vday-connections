"use client";

import { MAX_MISTAKES } from "@/lib/types";

interface MistakeDotsProps {
  mistakesRemaining: number;
}

export default function MistakeDots({ mistakesRemaining }: MistakeDotsProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <span className="text-[15px] italic text-[#5a594e]">
        Mistakes remaining:
      </span>
      <div className="flex gap-[6px]">
        {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
          <div
            key={i}
            className="mistake-dot"
            style={{ opacity: i >= mistakesRemaining ? 0.2 : 1 }}
          />
        ))}
      </div>
    </div>
  );
}
