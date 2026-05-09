import {
  Check,
  Lightbulb,
  ThumbsUp,
  Clock,
  Mic,
  Eye,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <ScorecardHero />
      <SkillBreakdown />
      <div className="grid gap-5 lg:grid-cols-2">
        <AIFeedback />
        <KeyMoments />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <SpeechAnalytics />
        <BodyLanguage />
      </div>
      <TranscriptReplay />
      <RecommendedNext />
    </div>
  );
}

/* ─────────────────────── Scorecard hero ─────────────────────── */

function ScorecardHero() {
  return (
    <section className="rounded-2xl border border-border bg-card/40 p-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="flex flex-col items-center gap-4">
          <ScoreRing score={82} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-medium text-lime-400">
            <Check className="h-3 w-3" />
            Strong hire
          </span>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Coding · Medium
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-foreground">
            Two Sum
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Senior SWE at Google · Completed May 8, 2026
          </p>

          <p className="mt-6 text-base leading-relaxed text-foreground/90">
            Strong technical performance with a clean optimal solution delivered
            in 18 minutes. Communication was clear and confident, with thoughtful
            complexity analysis.{" "}
            <span className="text-muted-foreground">
              Small opportunity to ask clarifying questions earlier in the round.
            </span>
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-5 sm:grid-cols-4">
            <HeroStat label="Duration" value="18:42" />
            <HeroStat label="Questions" value="3" />
            <HeroStat label="Tests passed" value="11/12" />
            <HeroStat label="Percentile" value="Top 18%" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-foreground tabular-nums">
        {value}
      </div>
    </div>
  );
}

function ScoreRing({ score, size = 200 }: { score: number; size?: number }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color =
    score >= 70
      ? "rgb(163 230 53)"
      : score >= 60
        ? "rgb(251 191 36)"
        : "rgb(239 68 68)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="currentColor"
          className="text-secondary"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-medium tracking-tight text-foreground tabular-nums">
          {score}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          out of 100
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── Skill breakdown ─────────────────────── */

const skills = [
  { label: "Technical", score: 85, change: 6 },
  { label: "Communication", score: 78, change: 2 },
  { label: "Problem-solving", score: 82, change: 4 },
  { label: "Code quality", score: 75, change: -1 },
];

function SkillBreakdown() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {skills.map((s) => {
        const fill =
          s.score >= 85
            ? "bg-lime-400"
            : s.score >= 70
              ? "bg-foreground/70"
              : "bg-amber-400";
        return (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card/40 p-5"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-medium text-foreground tabular-nums">
                {s.score}
              </span>
              <span
                className={`text-xs ${
                  s.change >= 0 ? "text-lime-400" : "text-red-400"
                }`}
              >
                {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.change)}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/60">
              <div
                className={`h-full rounded-full ${fill}`}
                style={{ width: `${s.score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────── AI feedback ─────────────────────── */

function AIFeedback() {
  const strengths = [
    "Walked through brute force before optimizing — strong problem-solving discipline.",
    "Explained time and space complexity unprompted.",
    "Tested with a custom edge case before submitting.",
  ];
  const improvements = [
    "Wait until you've read the full prompt before starting to code.",
    "Ask clarifying questions about input constraints earlier.",
    "Slow down slightly during the explanation phase — pace was 145 wpm.",
  ];

  return (
    <Card title="AI feedback" subtitle="Detailed analysis from your interviewer">
      <div className="space-y-5">
        <div>
          <SectionLabel icon={ThumbsUp} tone="lime">
            Strengths
          </SectionLabel>
          <ul className="mt-2 space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border pt-5">
          <SectionLabel icon={Lightbulb} tone="amber">
            Areas to improve
          </SectionLabel>
          <ul className="mt-2 space-y-2">
            {improvements.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────── Key moments ─────────────────────── */

const moments = [
  { time: "01:24", tone: "good", text: "Asked clarifying question about negative numbers." },
  { time: "04:32", tone: "good", text: "Identified the hash map optimization unprompted." },
  { time: "08:15", tone: "neutral", text: "Discussed time/space complexity tradeoffs." },
  { time: "12:45", tone: "warn", text: "Brief hesitation on edge case handling." },
  { time: "15:20", tone: "good", text: "Tested with custom input before submitting." },
] as const;

function KeyMoments() {
  return (
    <Card title="Key moments" subtitle="Notable moments from the session">
      <ul className="space-y-2">
        {moments.map((m, i) => {
          const dot =
            m.tone === "good"
              ? "bg-lime-400"
              : m.tone === "warn"
                ? "bg-amber-400"
                : "bg-foreground/40";
          return (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3"
            >
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {m.time}
              </span>
              <span className="flex-1 text-sm leading-relaxed text-foreground/90">
                {m.text}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ─────────────────────── Speech analytics ─────────────────────── */

function SpeechAnalytics() {
  const pace = [120, 135, 142, 148, 155, 142, 138, 145, 150, 142, 138, 144];
  return (
    <Card title="Speech analytics" subtitle="How you sounded">
      <div className="grid grid-cols-3 gap-4">
        <Metric icon={Mic} label="Pace" value="142" suffix="wpm" tone="good" />
        <Metric label="Filler words" value="12" tone="warn" />
        <Metric label="Clarity" value="91%" tone="good" />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="uppercase tracking-wider text-muted-foreground">
            Speaking pace
          </span>
          <span className="text-muted-foreground">words / min over time</span>
        </div>
        <Sparkline data={pace} />
      </div>
    </Card>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 600;
  const h = 60;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const pts = data.map(
    (v, i) => [i * stepX, h - ((v - min) / range) * h] as const
  );
  const line = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-14 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(163 230 53)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="rgb(163 230 53)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkFill)" />
      <path
        d={line}
        fill="none"
        stroke="rgb(163 230 53)"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ─────────────────────── Body language ─────────────────────── */

function BodyLanguage() {
  const eyeContact = [85, 92, 88, 90, 75, 65, 80, 88, 92, 87, 90, 85, 80, 88, 92, 86];
  return (
    <Card title="Body language" subtitle="From the webcam analysis">
      <div className="grid grid-cols-3 gap-4">
        <Metric icon={Eye} label="Eye contact" value="87%" tone="good" />
        <Metric label="Posture" value="Stable" tone="good" />
        <Metric label="Energy" value="High" tone="good" />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="uppercase tracking-wider text-muted-foreground">
            Eye contact
          </span>
          <span className="text-muted-foreground">% over the session</span>
        </div>
        <div className="flex h-14 items-end gap-1">
          {eyeContact.map((v, i) => {
            const color =
              v >= 80
                ? "bg-lime-400"
                : v >= 65
                  ? "bg-amber-400"
                  : "bg-red-400";
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm ${color}`}
                style={{ height: `${v}%`, opacity: 0.5 + v / 200 }}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────── Transcript replay ─────────────────────── */

const transcript = [
  { time: "00:08", who: "ai", text: "Take a moment to read the prompt. Let me know when you're ready." },
  { time: "00:42", who: "user", text: "Got it. Quick question — can the input contain negative numbers?" },
  { time: "00:51", who: "ai", text: "Yes, anywhere from -10⁹ to 10⁹. Good clarification." },
  { time: "01:24", who: "user", text: "Okay. I'll start with brute force for correctness, then optimize." },
  { time: "04:32", who: "user", text: "Actually, I can do this in O(n) using a hash map." },
  { time: "04:48", who: "ai", text: "Walk me through the intuition." },
  { time: "05:10", who: "user", text: "For each number, I check if its complement is in the map. If yes, return both indices." },
  { time: "08:15", who: "ai", text: "Good. What's the space complexity?" },
  { time: "08:22", who: "user", text: "O(n) in the worst case — when no pair exists until the last element." },
] as const;

function TranscriptReplay() {
  return (
    <Card title="Transcript replay" subtitle="Full conversation, with timestamps">
      <div className="space-y-3">
        {transcript.map((m, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-12 shrink-0 pt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">
              {m.time}
            </span>
            {m.who === "ai" ? (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-lime-400 text-[9px] font-bold text-neutral-950">
                AI
              </div>
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary text-[10px] font-medium text-foreground">
                A
              </div>
            )}
            <p
              className={`flex-1 text-sm leading-relaxed ${
                m.who === "ai" ? "text-foreground/90" : "text-muted-foreground"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────── Recommended next ─────────────────────── */

const recs = [
  {
    title: "Graph algorithms",
    desc: "Build on your hash map skills with BFS and DFS patterns.",
    duration: "30 min",
    level: "Medium",
    icon: "🔗",
  },
  {
    title: "System design — Caching layer",
    desc: "Apply your problem-solving instincts to design rounds.",
    duration: "45 min",
    level: "Hard",
    icon: "🏗",
  },
  {
    title: "Behavioral — Tell me about a time",
    desc: "Practice STAR-method answers. Slow down your delivery.",
    duration: "20 min",
    level: "Easy",
    icon: "💬",
  },
];

function RecommendedNext() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-medium text-foreground">
          Practice these next
        </h2>
        <p className="text-sm text-muted-foreground">
          Picked for you based on this session.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {recs.map((r) => (
          <a
            key={r.title}
            href="#"
            className="group flex flex-col rounded-2xl border border-border bg-card/40 p-5 transition-all hover:border-lime-400/20 hover:shadow-[0_0_60px_-20px_rgba(163,230,53,0.25)]"
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{r.icon}</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-lime-400" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-foreground">
              {r.title}
            </h3>
            <p className="mt-1 flex-1 text-xs text-muted-foreground">
              {r.desc}
            </p>
            <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {r.duration}
              </span>
              <span>·</span>
              <span>{r.level}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────── Shared bits ─────────────────────── */

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="mb-5">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function SectionLabel({
  icon: Icon,
  tone,
  children,
}: {
  icon: LucideIcon;
  tone: "lime" | "amber";
  children: ReactNode;
}) {
  const color = tone === "lime" ? "text-lime-400" : "text-amber-400";
  return (
    <div
      className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${color}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  suffix,
  tone,
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  suffix?: string;
  tone?: "good" | "warn";
}) {
  const color =
    tone === "good"
      ? "text-lime-400"
      : tone === "warn"
        ? "text-amber-400"
        : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`text-xl font-medium tabular-nums ${color}`}>
          {value}
        </span>
        {suffix && (
          <span className="text-[10px] text-muted-foreground">{suffix}</span>
        )}
      </div>
    </div>
  );
}