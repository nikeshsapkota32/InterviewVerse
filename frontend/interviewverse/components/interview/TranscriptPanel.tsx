"use client";

import { useEffect, useRef } from "react";

const transcript = [
  { who: "ai", text: "Let's start. Take your time reading the problem." },
  { who: "user", text: "Okay so we need indices of two numbers summing to target…" },
  { who: "ai", text: "Right. What's your first approach?" },
  { who: "user", text: "Brute force nested loop, then optimize with a hash map." },
  { who: "ai", text: "Good instinct. What's the time complexity of the optimized version?" },
  { who: "user", text: "O(n) — single pass, hash ops are O(1) average." },
] as const;

export default function TranscriptPanel() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Live transcript
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-400" />
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">Auto-saved</span>
      </div>

      <div
        ref={ref}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-[12px]"
      >
        {transcript.map((m, i) => (
          <div key={i} className="flex items-start gap-2">
            {m.who === "ai" ? (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-lime-400 text-[8px] font-bold text-neutral-950">
                AI
              </div>
            ) : (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary text-[9px] font-medium text-foreground">
                A
              </div>
            )}
            <p
              className={`flex-1 leading-relaxed ${
                m.who === "ai" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}

        {/* Currently transcribing */}
        <div className="flex items-start gap-2 opacity-70">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary text-[9px] font-medium text-foreground">
            A
          </div>
          <div className="flex flex-1 items-center gap-2 italic leading-relaxed text-muted-foreground">
            <span>So we iterate through and check the map…</span>
            <span className="inline-block h-3 w-px animate-pulse bg-foreground" />
          </div>
        </div>
      </div>

      {/* Footer: speaking indicator */}
      <div className="flex items-center justify-between border-t border-border bg-card/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-0.5">
            {[3, 6, 4, 7, 5, 8, 4, 6, 3].map((h, i) => (
              <span
                key={i}
                className="w-0.5 animate-pulse rounded-full bg-lime-400"
                style={{ height: `${h * 1.5}px`, animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">You&apos;re speaking</span>
        </div>
        <span className="text-[10px] text-muted-foreground">en-US</span>
      </div>
    </div>
  );
}