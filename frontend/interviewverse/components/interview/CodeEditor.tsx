"use client";

import { useState, type ReactNode } from "react";
import { Play, Send, ChevronDown, FileCode, Check, X, Loader2 } from "lucide-react";
import { useInterviewStore } from "@/lib/stores/interviewStore";

const STARTER_CODE: Record<string, string> = {
  python: `def twoSum(nums: list[int], target: int) -> list[int]:
    # Your solution here
    pass`,
  javascript: `function twoSum(nums, target) {
    // Your solution here
}`,
  typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your solution here
}`,
};

export default function CodeEditor() {
  const [tab, setTab] = useState<"solution" | "tests">("solution");
  const { code, setCode, language, setLanguage, submitCode, testResults, isSubmitting, allPassed, passedCount, totalCount } = useInterviewStore();

  const displayCode = code || STARTER_CODE[language] || STARTER_CODE.python;

  return (
    <div className="flex min-h-0 flex-col overflow-hidden bg-background">
      {/* Tab bar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-card/30 pr-2">
        <div className="flex h-full">
          <Tab active={tab === "solution"} onClick={() => setTab("solution")}>
            solution.{language === "python" ? "py" : language === "javascript" ? "js" : "ts"}
          </Tab>
          <Tab active={tab === "tests"} onClick={() => setTab("tests")}>
            tests
          </Tab>
        </div>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => { setLanguage(e.target.value); setCode(""); }}
            className="appearance-none flex items-center gap-1 rounded-md px-2 py-1 pr-6 text-[11px] text-muted-foreground bg-transparent hover:bg-secondary/60 hover:text-foreground cursor-pointer border-0 outline-none"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* Code textarea */}
      <div className="flex-1 overflow-auto bg-background">
        <textarea
          value={displayCode}
          onChange={(e) => setCode(e.target.value)}
          className="h-full w-full resize-none bg-background p-4 font-mono text-[12.5px] leading-[1.7] text-foreground/90 outline-none"
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          placeholder="Write your solution here..."
        />
      </div>

      {/* Output panel */}
      <div className="border-t border-border bg-card/30">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {testResults.length > 0
              ? `${passedCount}/${totalCount} tests passed`
              : "Output"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={submitCode}
              disabled={isSubmitting}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary/70 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
              Run
            </button>
            <button
              onClick={submitCode}
              disabled={isSubmitting}
              className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(163,230,53,0.35)] disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              Submit
            </button>
          </div>
        </div>
        <div className="space-y-0.5 px-4 py-3 font-mono text-[11px]">
          {testResults.length > 0 ? (
            testResults.map((r, i) => (
              <TestRow
                key={i}
                status={r.status as "pass" | "fail"}
                name={r.name}
                time={r.execution_time}
                error={r.error}
              />
            ))
          ) : (
            <span className="text-muted-foreground">Run your code to see test results</span>
          )}
        </div>
      </div>
    </div>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-full items-center gap-2 border-r border-border px-4 text-xs transition-colors ${
        active
          ? "bg-background text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <FileCode className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}

function TestRow({
  status,
  name,
  time,
  error,
}: {
  status: "pass" | "fail";
  name: string;
  time: string;
  error?: string | null;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <div className="flex items-center gap-2 min-w-0">
        {status === "pass" ? (
          <Check className="h-3.5 w-3.5 shrink-0 text-lime-400" />
        ) : (
          <X className="h-3.5 w-3.5 shrink-0 text-red-400" />
        )}
        <span className={`truncate ${status === "pass" ? "text-foreground/80" : "text-red-400"}`}>
          {name}
          {error ? ` — ${error}` : ""}
        </span>
      </div>
      <span className="ml-2 shrink-0 text-muted-foreground">{time}</span>
    </div>
  );
}
