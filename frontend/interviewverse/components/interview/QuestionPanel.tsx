import { Lightbulb } from "lucide-react";

export default function QuestionPanel() {
  return (
    <aside className="flex min-h-0 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-400">
            Medium
          </span>
          <span className="text-[10px] text-muted-foreground">Hash Map · Array</span>
        </div>
        <h1 className="mt-3 text-lg font-medium text-foreground">Two Sum</h1>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4 text-sm">
        <p className="leading-relaxed text-muted-foreground">
          Given an array of integers{" "}
          <Code>nums</Code> and an integer <Code>target</Code>, return the
          indices of the two numbers that add up to <Code>target</Code>.
        </p>

        <div>
          <Label>Example 1</Label>
          <pre className="mt-2 rounded-md border border-border bg-secondary/30 p-3 font-mono text-[11px] leading-relaxed text-foreground">
{`Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Why:    nums[0] + nums[1] == 9`}
          </pre>
        </div>

        <div>
          <Label>Constraints</Label>
          <ul className="mt-2 space-y-1 text-[12px] text-muted-foreground">
            <li>• 2 ≤ nums.length ≤ 10⁴</li>
            <li>• −10⁹ ≤ nums[i] ≤ 10⁹</li>
            <li>• Exactly one valid answer exists.</li>
          </ul>
        </div>

        <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-lime-400/20 bg-lime-400/5 py-2 text-xs font-medium text-lime-400 transition-colors hover:bg-lime-400/10">
          <Lightbulb className="h-3.5 w-3.5" />
          Ask AI for a hint
        </button>
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

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-secondary/60 px-1 py-0.5 font-mono text-[12px] text-foreground">
    {children}
  </code>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
    {children}
  </div>
);