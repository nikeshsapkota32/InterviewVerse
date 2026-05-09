"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/lib/stores/interviewStore";

export default function TranscriptPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const { transcript, sendTranscriptMessage } = useInterviewStore();
  const [input, setInput] = useState("");

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [transcript]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    sendTranscriptMessage(text);
    setInput("");
  }

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
        {transcript.length === 0 && (
          <p className="text-[11px] italic text-muted-foreground">
            Waiting for AI recruiter...
          </p>
        )}
        {transcript.map((m, i) => (
          <div key={i} className="flex items-start gap-2">
            {m.who === "ai" ? (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-lime-400 text-[8px] font-bold text-neutral-950">
                AI
              </div>
            ) : (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary text-[9px] font-medium text-foreground">
                U
              </div>
            )}
            <div className="min-w-0 flex-1">
              {m.time && (
                <span className="mr-1 font-mono text-[10px] text-muted-foreground">{m.time}</span>
              )}
              <span
                className={`leading-relaxed ${
                  m.who === "ai" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {m.text}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Text input for typing responses (fallback for no mic) */}
      <div className="border-t border-border bg-card/40 px-3 py-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a response..."
            className="flex-1 rounded-md border border-border bg-secondary/30 px-2.5 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground outline-none focus:border-lime-400/40"
          />
          <button
            onClick={handleSend}
            className="rounded-md bg-lime-400/10 px-2.5 py-1.5 text-[11px] font-medium text-lime-400 hover:bg-lime-400/20"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
