"use client";

import { Lightbulb, Loader2 } from "lucide-react";
import { useInterviewStore } from "@/lib/stores/interviewStore";

export default function QuestionPanel() {
  const { problem, requestHint, hint, isLoadingHint } = useInterviewStore();

  const difficultyColor =
    problem?.difficulty === "Easy"
      ? "border-lime-400/20 bg-lime-400/10 text-lime-400"
      : problem?.difficulty === "Hard"
      ? "border-red-400/20 bg-red-400/10 text-red-400"
      : "border-amber-400/20 bg-amber-400/10 text-amber-400";

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          {problem ? (
            <>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${difficultyColor}`}>
                {problem.difficulty}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {problem.tags.join(" · ")}
              </span>
            </>
          ) : (
            <span className="text-[10px] text-muted-foreground">Loading problem...</span>
          )}
        </div>
        <h1 className="mt-3 text-lg font-medium text-foreground">
          {problem?.title ?? "Loading..."}
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4 text-sm">
        {problem ? (
          <>
            <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {problem.description}
            </p>

            {problem.examples.slice(0, 2).map((ex, i) => (
              <div key={i}>
                <Label>Example {i + 1}</Label>
                <pre className="mt-2 rounded-md border border-border bg-secondary/30 p-3 font-mono text-[11px] leading-relaxed text-foreground overflow-x-auto">
                  {`Input:  ${ex.input}\nOutput: ${ex.output}${ex.explanation ? `\nWhy:    ${ex.explanation}` : ""}`}
                </pre>
              </div>
            ))}

            <div>
              <Label>Constraints</Label>
              <ul className="mt-2 space-y-1 text-[12px] text-muted-foreground">
                {problem.constraints.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>

            {hint && (
              <div className="rounded-lg border border-lime-400/20 bg-lime-400/5 p-3 text-xs text-lime-400">
                <span className="font-medium">Hint: </span>{hint}
              </div>
            )}

            <button
              onClick={() => requestHint()}
              disabled={isLoadingHint}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-lime-400/20 bg-lime-400/5 py-2 text-xs font-medium text-lime-400 transition-colors hover:bg-lime-400/10 disabled:opacity-50"
            >
              {isLoadingHint ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Lightbulb className="h-3.5 w-3.5" />
              )}
              Ask AI for a hint
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading problem...</span>
          </div>
        )}
      </div>

      {/* Footer: AI status */}
      <div className="border-t border-border bg-card/40 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-400 text-[10px] font-bold text-neutral-950">
            AI
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-medium text-foreground">
              Sarah · Senior Recruiter
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-0.5">
                {[3, 5, 2, 6, 4].map((h, i) => (
                  <span
                    key={i}
                    className="w-0.5 animate-pulse rounded-full bg-lime-400"
                    style={{ height: `${h * 2}px`, animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">Listening</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
    {children}
  </div>
);
