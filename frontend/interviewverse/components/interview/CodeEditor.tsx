"use client";

import { useState, type ReactNode } from "react";
import { Play, Send, ChevronDown, FileCode, Check, X } from "lucide-react";

export default function CodeEditor() {
  const [tab, setTab] = useState<"solution" | "tests">("solution");

  return (
    <div className="flex min-h-0 flex-col overflow-hidden bg-background">
      {/* Tab bar */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-card/30 pr-2">
        <div className="flex h-full">
          <Tab active={tab === "solution"} onClick={() => setTab("solution")}>
            solution.ts
          </Tab>
          <Tab active={tab === "tests"} onClick={() => setTab("tests")}>
            tests.ts
          </Tab>
        </div>
        <button className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-secondary/60 hover:text-foreground">
          TypeScript <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Code body */}
      <div className="flex-1 overflow-auto bg-background py-2 font-mono text-[12.5px] leading-[1.7]">
        <Line n={1}>
          <Kw>function</Kw> <Fn>twoSum</Fn>(nums: <Tp>number</Tp>[], target: <Tp>number</Tp>): <Tp>number</Tp>[] {`{`}
        </Line>
        <Line n={2} indent={1}>
          <Kw>const</Kw> seen = <Kw>new</Kw> <Fn>Map</Fn>&lt;<Tp>number</Tp>, <Tp>number</Tp>&gt;();
        </Line>
        <Line n={3} indent={1}>
          <Kw>for</Kw> (<Kw>let</Kw> i = <Num>0</Num>; i {"<"} nums.length; i++) {`{`}
        </Line>
        <Line n={4} indent={2}>
          <Kw>const</Kw> diff = target - nums[i];
        </Line>
        <Line n={5} indent={2}>
          <Kw>if</Kw> (seen.has(diff)) {`{`}
        </Line>
        <Line n={6} indent={3} highlight>
          <Kw>return</Kw> [seen.get(diff)<Kw>!</Kw>, i];
        </Line>
        <Line n={7} indent={2}>{`}`}</Line>
        <Line n={8} indent={2}>seen.set(nums[i], i);</Line>
        <Line n={9} indent={1}>{`}`}</Line>
        <Line n={10}>{`}`}</Line>
        <Line n={11} cursor />
      </div>

      {/* Output panel */}
      <div className="border-t border-border bg-card/30">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Output
          </span>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary/70">
              <Play className="h-3 w-3" />
              Run
            </button>
            <button className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-2.5 text-[11px] font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(163,230,53,0.35)]">
              <Send className="h-3 w-3" />
              Submit
            </button>
          </div>
        </div>
        <div className="space-y-0.5 px-4 py-3 font-mono text-[11px]">
          <TestRow status="pass" name="basic [2,7,11,15]" time="0.4ms" />
          <TestRow status="pass" name="negatives [-3,4,3,90]" time="0.3ms" />
          <TestRow status="pass" name="duplicates [3,3]" time="0.5ms" />
          <TestRow status="fail" name="large input n=10000" time="—" />
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

function Line({
  n,
  indent = 0,
  highlight = false,
  cursor = false,
  children,
}: {
  n: number;
  indent?: number;
  highlight?: boolean;
  cursor?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`flex ${highlight ? "bg-lime-400/[0.04]" : ""}`}>
      <span className="w-12 shrink-0 select-none border-r border-border/40 pr-3 text-right text-[11px] text-muted-foreground/60">
        {n}
      </span>
      <div
        className="text-foreground/90"
        style={{ paddingLeft: `${12 + indent * 16}px`, paddingRight: 12 }}
      >
        {children}
        {cursor && (
          <span className="ml-0 inline-block h-3.5 w-0.5 animate-pulse bg-lime-400 align-middle" />
        )}
      </div>
    </div>
  );
}

const Kw = ({ children }: { children: ReactNode }) => (
  <span className="text-fuchsia-400">{children}</span>
);
const Fn = ({ children }: { children: ReactNode }) => (
  <span className="text-sky-300">{children}</span>
);
const Tp = ({ children }: { children: ReactNode }) => (
  <span className="text-amber-300">{children}</span>
);
const Num = ({ children }: { children: ReactNode }) => (
  <span className="text-orange-400">{children}</span>
);

function TestRow({
  status,
  name,
  time,
}: {
  status: "pass" | "fail";
  name: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <div className="flex items-center gap-2">
        {status === "pass" ? (
          <Check className="h-3.5 w-3.5 text-lime-400" />
        ) : (
          <X className="h-3.5 w-3.5 text-red-400" />
        )}
        <span className={status === "pass" ? "text-foreground/80" : "text-red-400"}>
          {name}
        </span>
      </div>
      <span className="text-muted-foreground">{time}</span>
    </div>
  );
}