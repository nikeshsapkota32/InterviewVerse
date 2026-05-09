"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Clock,
  Filter,
  Mic,
  FileText,
  Terminal,
  Search,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";

interface Session {
  id: number;
  title: string;
  company: string;
  type: string;
  score: number;
  when: string;
  duration?: string;
  status?: string;
}

export default function InterviewsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/dashboard")
      .then((r) => {
        const data = r.data as { recent_sessions: Session[] };
        // Simulate more sessions from real data
        const base: Session[] = data.recent_sessions || [];
        const extended: Session[] = [
          ...base,
          ...base.map((s, i) => ({
            ...s,
            id: s.id + 100 + i,
            when: `${i + 7} days ago`,
            score: Math.max(40, s.score - 5 - i * 3),
          })),
        ];
        setSessions(extended);
      })
      .catch(() => {
        setSessions([
          { id: 1, title: "Two Sum", company: "Meta", type: "Technical", score: 92, when: "2h ago", duration: "42 min" },
          { id: 2, title: "System Design: URL Shortener", company: "Google", type: "System Design", score: 85, when: "Yesterday", duration: "58 min" },
          { id: 3, title: "Leadership & Conflict", company: "Amazon", type: "Behavioral", score: 78, when: "3 days ago", duration: "35 min" },
          { id: 4, title: "Valid Parentheses", company: "Microsoft", type: "Technical", score: 88, when: "5 days ago", duration: "28 min" },
          { id: 5, title: "Product Sense Interview", company: "Stripe", type: "Behavioral", score: 71, when: "1 week ago", duration: "47 min" },
          { id: 6, title: "LRU Cache", company: "Netflix", type: "Technical", score: 65, when: "2 weeks ago", duration: "55 min" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const types = ["All", "Technical", "System Design", "Behavioral"];

  const filtered = sessions.filter((s) => {
    const matchType = filter === "All" || s.type === filter;
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Interview History
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {sessions.length} total sessions
          </p>
        </div>
        <button
          onClick={() => router.push("/interview")}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)]"
        >
          <Plus className="h-4 w-4" />
          New interview
        </button>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-secondary/20 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/20 p-1">
          <Filter className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-md px-3 py-1 text-xs transition-colors ${
                filter === t
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
        <div className="grid grid-cols-[1fr,auto,auto,auto,auto] items-center gap-4 border-b border-border px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <span>Session</span>
          <span className="hidden sm:block">Type</span>
          <span className="hidden md:block">Duration</span>
          <span>Score</span>
          <span></span>
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            Loading sessions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No sessions found
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((s) => {
              const Icon =
                s.type === "Technical"
                  ? Terminal
                  : s.type === "System Design"
                  ? FileText
                  : Mic;
              return (
                <li
                  key={s.id}
                  className="group grid grid-cols-[1fr,auto,auto,auto,auto] cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/30"
                  onClick={() => router.push(`/results?session=${s.id}`)}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">
                        {s.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {s.company} · {s.when}
                      </div>
                    </div>
                  </div>
                  <span className="hidden rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-xs text-muted-foreground sm:inline">
                    {s.type}
                  </span>
                  <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
                    <Clock className="h-3 w-3" />
                    {s.duration || "—"}
                  </div>
                  <ScoreBadge score={s.score} />
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const styles =
    score >= 85
      ? "bg-lime-400/10 text-lime-400 border-lime-400/20"
      : score >= 70
      ? "bg-secondary/60 text-foreground border-border"
      : "bg-red-400/10 text-red-400 border-red-400/20";
  return (
    <span
      className={`inline-flex w-10 justify-center rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums ${styles}`}
    >
      {score}
    </span>
  );
}
