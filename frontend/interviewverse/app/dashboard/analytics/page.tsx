"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Award, Target, Zap } from "lucide-react";
import { api } from "@/lib/api";

interface AnalyticsData {
  performance_data: number[];
  skills: { label: string; score: number }[];
  stats: { sessions: number; avg_score: number; streak_days: number; practice_hours: number };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    api.get("/api/dashboard")
      .then((r) => setData(r.data as AnalyticsData))
      .catch(() => {
        setData({
          performance_data: [62, 68, 71, 65, 74, 78, 76, 82, 79, 85, 83, 88, 86, 92],
          skills: [
            { label: "Problem Solving", score: 88 },
            { label: "Communication", score: 74 },
            { label: "System Design", score: 65 },
            { label: "Code Quality", score: 82 },
            { label: "Time Management", score: 70 },
            { label: "Behavioral", score: 78 },
          ],
          stats: { sessions: 24, avg_score: 84, streak_days: 7, practice_hours: 18 },
        });
      });
  }, []);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Loading analytics...
      </div>
    );
  }

  const { performance_data, skills, stats } = data;

  // Calculate trend
  const recent = performance_data.slice(-5);
  const older = performance_data.slice(-10, -5);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
  const trend = recentAvg - olderAvg;

  // Interview type distribution (mock)
  const distribution = [
    { type: "Technical", count: Math.round(stats.sessions * 0.5), color: "bg-lime-400" },
    { type: "Behavioral", count: Math.round(stats.sessions * 0.3), color: "bg-blue-400" },
    { type: "System Design", count: Math.round(stats.sessions * 0.2), color: "bg-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your improvement over time
        </p>
      </header>

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Target} label="Total Sessions" value={String(stats.sessions)} sub="All time" />
        <KpiCard icon={TrendingUp} label="Avg Score" value={String(stats.avg_score)} sub={`${trend >= 0 ? "+" : ""}${trend.toFixed(1)} vs last 5`} positive={trend >= 0} />
        <KpiCard icon={Zap} label="Streak" value={`${stats.streak_days}d`} sub="Current streak" />
        <KpiCard icon={Award} label="Practice Time" value={`${stats.practice_hours}h`} sub="Last 30 days" />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main chart */}
        <div className="rounded-2xl border border-border bg-card/40 p-5 lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-sm font-medium text-foreground">Score Trend</h2>
            <p className="text-xs text-muted-foreground">Last {performance_data.length} sessions</p>
          </div>
          <AreaChart data={performance_data} />
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Session 1</span>
            <span>Latest</span>
          </div>
        </div>

        {/* Interview type dist */}
        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">Session Types</h2>
          <div className="space-y-3">
            {distribution.map((d) => (
              <div key={d.type}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-foreground">{d.type}</span>
                  <span className="tabular-nums text-muted-foreground">{d.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary/60">
                  <div
                    className={`h-full rounded-full ${d.color}`}
                    style={{ width: `${(d.count / stats.sessions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Radar-like skill summary */}
          <h2 className="mt-6 mb-3 text-sm font-medium text-foreground">Skills Radar</h2>
          <div className="space-y-2.5">
            {skills.map((s) => {
              const fill = s.score >= 80 ? "bg-lime-400" : s.score >= 65 ? "bg-amber-400" : "bg-red-400";
              return (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-foreground">{s.label}</span>
                    <span className="tabular-nums text-muted-foreground">{s.score}</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-secondary/60">
                    <div className={`h-full rounded-full ${fill}`} style={{ width: `${s.score}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score heatmap (mock) */}
      <div className="rounded-2xl border border-border bg-card/40 p-5">
        <h2 className="mb-4 text-sm font-medium text-foreground">Activity Heatmap</h2>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 91 }).map((_, i) => {
            const hasActivity = Math.random() > 0.65;
            const intensity = hasActivity ? Math.floor(Math.random() * 4) : 0;
            const colors = ["bg-secondary/30", "bg-lime-400/20", "bg-lime-400/50", "bg-lime-400/80", "bg-lime-400"];
            return (
              <div
                key={i}
                title={`Day ${i + 1}`}
                className={`h-3.5 w-3.5 rounded-sm ${colors[intensity]}`}
              />
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          {["bg-secondary/30", "bg-lime-400/20", "bg-lime-400/50", "bg-lime-400/80", "bg-lime-400"].map((c) => (
            <div key={c} className={`h-3.5 w-3.5 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, positive }: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  sub: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-3 text-3xl font-medium tracking-tight text-foreground">{value}</div>
      <div className={`mt-1.5 text-xs ${positive === true ? "text-lime-400" : positive === false ? "text-red-400" : "text-muted-foreground"}`}>
        {positive === true && "↑ "}{positive === false && "↓ "}{sub}
      </div>
    </div>
  );
}

function AreaChart({ data }: { data: number[] }) {
  const w = 800, h = 160, min = 50, max = 100;
  if (data.length < 2) return null;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * stepX;
    const y = h - ((v - min) / (max - min)) * h;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-40 w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="fill2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(163 230 53)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="rgb(163 230 53)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line key={p} x1="0" x2={w} y1={p * h} y2={p * h} stroke="rgb(63 63 70)" strokeDasharray="2 4" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={area} fill="url(#fill2)" />
      <path d={line} fill="none" stroke="rgb(163 230 53)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {(() => {
        const [lx, ly] = pts[pts.length - 1];
        return <>
          <circle cx={lx} cy={ly} r="8" fill="rgb(163 230 53)" opacity="0.2" />
          <circle cx={lx} cy={ly} r="3.5" fill="rgb(163 230 53)" />
        </>;
      })()}
    </svg>
  );
}
