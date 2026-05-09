"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Zap, Lock, CheckCircle2, Clock, Star } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  acceptance: number;
  solved?: boolean;
  premium?: boolean;
}

const PROBLEMS: Problem[] = [
  { id: "two-sum", title: "Two Sum", difficulty: "Easy", topic: "Array", acceptance: 49, solved: true },
  { id: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", acceptance: 41, solved: true },
  { id: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", acceptance: 73, solved: false },
  { id: "lru-cache", title: "LRU Cache", difficulty: "Medium", topic: "Design", acceptance: 41, solved: false },
  { id: "merge-intervals", title: "Merge Intervals", difficulty: "Medium", topic: "Array", acceptance: 46, solved: false },
  { id: "word-search", title: "Word Search", difficulty: "Medium", topic: "Backtracking", acceptance: 40, solved: false },
  { id: "binary-tree-inorder", title: "Binary Tree Inorder Traversal", difficulty: "Easy", topic: "Tree", acceptance: 72, solved: false },
  { id: "clone-graph", title: "Clone Graph", difficulty: "Medium", topic: "Graph", acceptance: 54, solved: false },
  { id: "course-schedule", title: "Course Schedule", difficulty: "Medium", topic: "Graph", acceptance: 45, solved: false },
  { id: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", topic: "Array", acceptance: 60, solved: false },
  { id: "serialize-deserialize", title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Tree", acceptance: 56, solved: false, premium: true },
  { id: "sliding-window-max", title: "Sliding Window Maximum", difficulty: "Hard", topic: "Sliding Window", acceptance: 47, solved: false },
];

const TOPICS = ["All", "Array", "Stack", "Linked List", "Tree", "Graph", "Design", "Backtracking", "Sliding Window"];
const DIFFS = ["All", "Easy", "Medium", "Hard"];

export default function CodingPage() {
  const router = useRouter();
  const [diff, setDiff] = useState("All");
  const [topic, setTopic] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = PROBLEMS.filter((p) => {
    const matchDiff = diff === "All" || p.difficulty === diff;
    const matchTopic = topic === "All" || p.topic === topic;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchTopic && matchSearch;
  });

  const solved = PROBLEMS.filter((p) => p.solved).length;

  function startProblem(problem: Problem) {
    router.push(`/interview?problem=${problem.id}&difficulty=${problem.difficulty}`);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Coding Problems</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {solved}/{PROBLEMS.length} solved · Practice with real interview questions
          </p>
        </div>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="rounded-md border border-lime-400/20 bg-lime-400/10 px-2.5 py-1 text-lime-400">
            {PROBLEMS.filter((p) => p.difficulty === "Easy").length} Easy
          </span>
          <span className="rounded-md border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-amber-400">
            {PROBLEMS.filter((p) => p.difficulty === "Medium").length} Medium
          </span>
          <span className="rounded-md border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-red-400">
            {PROBLEMS.filter((p) => p.difficulty === "Hard").length} Hard
          </span>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 rounded-lg border border-border bg-secondary/20 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/20 p-1">
          {DIFFS.map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={`rounded-md px-3 py-1 text-xs transition-colors ${
                diff === d ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/20 p-1 flex-wrap">
          {TOPICS.slice(0, 5).map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`rounded-md px-3 py-1 text-xs transition-colors ${
                topic === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Problem list */}
      <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
        <div className="grid grid-cols-[auto,1fr,auto,auto,auto] items-center gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Status</span>
          <span>Title</span>
          <span>Topic</span>
          <span className="hidden sm:block">Acceptance</span>
          <span></span>
        </div>
        <ul className="divide-y divide-border">
          {filtered.map((p) => (
            <li
              key={p.id}
              className="group grid grid-cols-[auto,1fr,auto,auto,auto] cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/30"
              onClick={() => !p.premium && startProblem(p)}
            >
              <div className="flex items-center justify-center w-5">
                {p.solved ? (
                  <CheckCircle2 className="h-4 w-4 text-lime-400" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-border" />
                )}
              </div>
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">{p.title}</span>
                {p.premium && <Lock className="h-3 w-3 text-amber-400 shrink-0" />}
              </div>
              <span className="hidden rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-xs text-muted-foreground sm:inline">
                {p.topic}
              </span>
              <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
                <Clock className="h-3 w-3" />
                {p.acceptance}%
              </div>
              <DiffBadge diff={p.difficulty} />
            </li>
          ))}
        </ul>
      </div>

      {/* Random challenge card */}
      <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-lime-400" />
              <span className="text-sm font-medium text-foreground">Daily Challenge</span>
              <Star className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Solve a random problem every day to build consistency. Streaks unlock XP bonuses.
            </p>
          </div>
          <button
            onClick={() => router.push("/interview")}
            className="shrink-0 rounded-lg bg-lime-400 px-4 py-2 text-xs font-medium text-neutral-950 transition-all hover:bg-lime-300"
          >
            Random problem
          </button>
        </div>
      </div>
    </div>
  );
}

function DiffBadge({ diff }: { diff: "Easy" | "Medium" | "Hard" }) {
  const styles =
    diff === "Easy"
      ? "text-lime-400 border-lime-400/20 bg-lime-400/10"
      : diff === "Medium"
      ? "text-amber-400 border-amber-400/20 bg-amber-400/10"
      : "text-red-400 border-red-400/20 bg-red-400/10";
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${styles}`}>
      {diff}
    </span>
  );
}
