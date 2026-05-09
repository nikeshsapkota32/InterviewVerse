"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Clock,
  FileText,
  Flame,
  Mic,
  Target,
  Terminal,
  TrendingUp,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { dashboardApi } from "@/lib/api";

interface DashboardData {
  user: { name: string; streak_days: number };
  stats: { sessions: number; avg_score: number; streak_days: number; practice_hours: number; sessions_delta: string; avg_score_delta: string };
  recent_sessions: { id: number; title: string; company: string; type: string; score: number; when: string }[];
  skills: { label: string; score: number }[];
  performance_data: number[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    dashboardApi.get().then((r) => setData(r.data)).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  const { user, stats, recent_sessions, skills, performance_data } = data;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re on a {stats.streak_days}-day streak.{" "}
            <span className="text-lime-400">Keep it up.</span>
          </p>
        </div>
        <button
          onClick={() => router.push("/interview")}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)]"
        >
          <Mic className="h-4 w-4" />
          Start mock interview
        </button>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Target} label="Sessions" value={String(stats.sessions)} delta={stats.sessions_delta} trend="up" />
        <Stat icon={TrendingUp} label="Avg score" value={String(stats.avg_score)} suffix="/100" delta={stats.avg_score_delta} trend="up" />
        <Stat icon={Flame} label="Streak" value={String(stats.streak_days)} suffix="days" delta="Personal best" trend="neutral" />
        <Stat icon={Clock} label="Practice" value={String(stats.practice_hours)} suffix="hrs" delta="Last 30 days" trend="neutral" />
      </div>

      {/* Two-column: sessions + skill panel */}
      <div className="grid gap-5 lg:grid-cols-3">
        <RecentSessions sessions={recent_sessions} />
        <SkillPanel skills={skills} />
      </div>

      {/* Performance chart */}
      <PerformanceChart data={performance_data} />
    </div>
  );
}

/* ─────────────────────── Stat card ─────────────────────── */

function Stat({
  icon: Icon, label, value, suffix, delta, trend,
}: {
  icon: LucideIcon; label: string; value: string; suffix?: string; delta: string; trend: "up" | "down" | "neutral";
}) {
  const trendColor = trend === "up" ? "text-lime-400" : trend === "down" ? "text-red-400" : "text-muted-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-medium tracking-tight text-foreground">{value}</span>
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      <div className={`mt-2 text-xs ${trendColor}`}>
        {trend === "up" && "↑ "}
        {delta}
      </div>
    </div>
  );
}

/* ─────────────────────── Recent sessions ─────────────────────── */

function RecentSessions({ sessions }: { sessions: { id: number; title: string; company: string; type: string; score: number; when: string }[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 lg:col-span-2">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-medium text-foreground">Recent sessions</h2>
          <p className="text-xs text-muted-foreground">Your last {sessions.length} interviews</p>
        </div>
        <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">View all →</button>
      </div>
      <ul className="divide-y divide-border">
        {sessions.map((s) => {
          const Icon = s.type === "Technical" ? Terminal : s.type === "Behavioral" ? Mic : FileText;
          return (
            <li key={s.id} className="group flex cursor-pointer items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/30">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/60 text-muted-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.company} · {s.type} · {s.when}</div>
              </div>
              <ScoreBadge score={s.score} />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const styles = score >= 85
    ? "bg-lime-400/10 text-lime-400 border-lime-400/20"
    : score >= 70
    ? "bg-secondary/60 text-foreground border-border"
    : "bg-red-400/10 text-red-400 border-red-400/20";
  return (
    <span className={`inline-flex w-10 justify-center rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums ${styles}`}>{score}</span>
  );
}

/* ─────────────────────── Skill panel ─────────────────────── */

function SkillPanel({ skills }: { skills: { label: string; score: number }[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="mb-5">
        <h2 className="text-sm font-medium text-foreground">Skill breakdown</h2>
        <p className="text-xs text-muted-foreground">Last 30 days</p>
      </div>
      <div className="space-y-4">
        {skills.map((s) => {
          const fill = s.score >= 85 ? "bg-lime-400" : s.score >= 70 ? "bg-foreground/70" : "bg-amber-400";
          return (
            <div key={s.label}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-foreground">{s.label}</span>
                <span className="tabular-nums text-muted-foreground">{s.score}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-secondary/60">
                <div className={`h-full rounded-full ${fill}`} style={{ width: `${s.score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────── Performance chart ─────────────────────── */

function PerformanceChart({ data }: { data: number[] }) {
  const w = 800, h = 200, min = 50, max = 100;
  const stepX = w / (data.length - 1);
  const points = data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / (max - min)) * h;
    return [x, y] as const;
  });
  const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">Performance over time</h2>
          <p className="text-xs text-muted-foreground">Last {data.length} sessions</p>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/30 p-0.5 text-xs">
          {["7D", "14D", "30D", "All"].map((t, i) => (
            <button key={t} className={`rounded px-2.5 py-1 transition-colors ${i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(163 230 53)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(163 230 53)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="text-border">
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line key={p} x1="0" x2={w} y1={p * h} y2={p * h} stroke="currentColor" strokeDasharray="2 4" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke="rgb(163 230 53)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {(() => {
          const [lx, ly] = points[points.length - 1];
          return (
            <>
              <circle cx={lx} cy={ly} r="8" fill="rgb(163 230 53)" opacity="0.2" />
              <circle cx={lx} cy={ly} r="3.5" fill="rgb(163 230 53)" />
            </>
          );
        })()}
      </svg>
      <div className="mt-3 flex justify-between text-[10px] text-muted-foreground">
        <span>Apr 24</span>
        <span>May 1</span>
        <span>May 8</span>
      </div>
    </div>
  );
}
