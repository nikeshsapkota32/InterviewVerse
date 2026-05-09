"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Video, VideoOff, Settings, X } from "lucide-react";
import { useInterviewStore } from "@/lib/stores/interviewStore";

export default function InterviewTopBar() {
  const router = useRouter();
  const { problem, micOn, cameraOn, toggleMic, toggleCamera, endInterview, elapsedSeconds, tickTimer } = useInterviewStore();

  const timeLimitSecs = (problem?.time_limit_minutes ?? 45) * 60;
  const remaining = Math.max(0, timeLimitSecs - elapsedSeconds);
  const lowTime = remaining < 5 * 60;

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const timeStr = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  useEffect(() => {
    const i = setInterval(() => tickTimer(), 1000);
    return () => clearInterval(i);
  }, [tickTimer]);

  const difficultyColor =
    problem?.difficulty === "Easy"
      ? "border-lime-400/20 bg-lime-400/10 text-lime-400"
      : problem?.difficulty === "Hard"
      ? "border-red-400/20 bg-red-400/10 text-red-400"
      : "border-amber-400/20 bg-amber-400/10 text-amber-400";

  async function handleEnd() {
    try {
      const resultId = await endInterview(elapsedSeconds);
      router.push(`/results?session=${resultId}`);
    } catch {
      router.push("/results");
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      {/* Left: logo + meta */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-400 text-neutral-950"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
            <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
          </svg>
        </Link>
        {problem && (
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${difficultyColor}`}>
            Coding · {problem.difficulty}
          </span>
        )}
        <div className="hidden sm:block">
          <div className="text-sm font-medium text-foreground">
            {problem?.title ?? "Loading..."}
          </div>
          <div className="text-[11px] text-muted-foreground">Senior SWE — Google</div>
        </div>
      </div>

      {/* Center: timer */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        <span
          className={`font-mono text-sm font-medium tabular-nums ${
            lowTime ? "text-red-400" : "text-foreground"
          }`}
        >
          {timeStr}
        </span>
        <span className="text-xs text-muted-foreground">remaining</span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1">
        <ControlButton onClick={toggleMic} muted={!micOn}>
          {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
        </ControlButton>
        <ControlButton onClick={toggleCamera} muted={!cameraOn}>
          {cameraOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
        </ControlButton>
        <ControlButton>
          <Settings className="h-4 w-4" />
        </ControlButton>
        <div className="mx-1 h-5 w-px bg-border" />
        <button
          onClick={handleEnd}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-500/10 px-3 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          <X className="h-3.5 w-3.5" />
          End interview
        </button>
      </div>
    </header>
  );
}

function ControlButton({
  children,
  onClick,
  muted,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  muted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
        muted
          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
