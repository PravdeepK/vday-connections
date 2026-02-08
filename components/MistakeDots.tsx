"use client";

import { MAX_MISTAKES } from "@/lib/types";

interface MistakeDotsProps {
  mistakesRemaining: number;
}

export default function MistakeDots({ mistakesRemaining }: MistakeDotsProps) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <span className="text-sm font-medium text-[#5a594e] mr-1">
        Mistakes remaining:
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
          <div
            key={i}
            className={`mistake-dot ${i >= mistakesRemaining ? "used" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
