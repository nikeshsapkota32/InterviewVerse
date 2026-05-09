"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Lightbulb,
  ThumbsUp,
  Clock,
  Mic,
  Eye,
  ArrowUpRight,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { useInterviewStore } from "@/lib/stores/interviewStore";

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const { loadResults, results, isLoadingResults } = useInterviewStore();

  useEffect(() => {
    if (sessionId) {
      loadResults(sessionId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (isLoadingResults) return <LoadingState />;

  const r = results as ResultData | null;

  // Fall back to static data if no results yet
  const score = r?.score ?? 82;
  const rating = r?.rating ?? "Strong hire";
  const problemTitle = r?.problem_title ?? "Two Sum";
  const problemType = r?.problem_type ?? "Coding · Medium";
  const duration = r?.duration ?? "18:42";
  const summary = r?.summary ?? "Strong technical performance with a clean optimal solution. Communication was clear and confident.";
  const skillBreakdown = r?.skill_breakdown ?? [
    { label: "Technical", score: 85, change: 6 },
    { label: "Communication", score: 78, change: 2 },
    { label: "Problem-solving", score: 82, change: 4 },
    { label: "Code quality", score: 75, change: -1 },
  ];
  const strengths = r?.strengths ?? [
    "Walked through brute force before optimizing — strong problem-solving discipline.",
    "Explained time and space complexity unprompted.",
    "Tested with a custom edge case before submitting.",
  ];
  const improvements = r?.improvements ?? [
    "Wait until you've read the full prompt before starting to code.",
    "Ask clarifying questions about input constraints earlier.",
    "Slow down slightly during the explanation phase.",
  ];
  const keyMoments = r?.key_moments ?? [
    { time: "01:24", tone: "good", text: "Asked clarifying question about negative numbers." },
    { time: "04:32", tone: "good", text: "Identified the hash map optimization unprompted." },
    { time: "08:15", tone: "neutral", text: "Discussed time/space complexity tradeoffs." },
    { time: "12:45", tone: "warn", text: "Brief hesitation on edge case handling." },
    { time: "15:20", tone: "good", text: "Tested with custom input before submitting." },
  ];
  const speech = r?.speech ?? { pace_wpm: 142, filler_words: 12, clarity_percent: 91, pace_over_time: [120, 135, 142, 148, 155, 142, 138, 145, 150, 142, 138, 144] };
  const bodyLang = r?.body_language ?? { eye_contact_percent: 87, posture: "Stable", energy: "High", eye_contact_over_time: [85, 92, 88, 90, 75, 65, 80, 88, 92, 87, 90, 85, 80, 88, 92, 86] };
  const transcript = r?.transcript ?? [];
  const recommendations = r?.recommendations ?? [
    { title: "Graph algorithms", description: "Build on your hash map skills with BFS and DFS patterns.", duration: "30 min", level: "Medium", icon: "🔗" },
    { title: "System design — Caching layer", description: "Apply your problem-solving instincts to design rounds.", duration: "45 min", level: "Hard", icon: "🏗" },
    { title: "Behavioral — Tell me about a time", description: "Practice STAR-method answers. Slow down your delivery.", duration: "20 min", level: "Easy", icon: "💬" },
  ];

  return (
    <div className="space-y-6">
      <ScorecardHero
        score={score}
        rating={rating}
        problemTitle={problemTitle}
        problemType={problemType}
        duration={duration}
        summary={summary}
        questionsCount={r?.questions_count ?? 3}
        testsPassed={r?.tests_passed ?? "N/A"}
        percentile={r?.percentile ?? "Top 20%"}
      />
      <SkillBreakdown skills={skillBreakdown} />
      <div className="grid gap-5 lg:grid-cols-2">
        <AIFeedback strengths={strengths} improvements={improvements} />
        <KeyMoments moments={keyMoments} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <SpeechAnalytics data={speech} />
        <BodyLanguage data={bodyLang} />
      </div>
      {transcript.length > 0 && <TranscriptReplay transcript={transcript} />}
      <RecommendedNext recommendations={recommendations} />
    </div>
  );
}

interface ResultData {
  score: number;
  rating: string;
  problem_title: string;
  problem_type: string;
  duration: string;
  summary: string;
  skill_breakdown: { label: string; score: number; change: number }[];
  strengths: string[];
  improvements: string[];
  key_moments: { time: string; tone: string; text: string }[];
  speech: { pace_wpm: number; filler_words: number; clarity_percent: number; pace_over_time: number[] };
  body_language: { eye_contact_percent: number; posture: string; energy: string; eye_contact_over_time: number[] };
  transcript: { time: string; who: string; text: string }[];
  recommendations: { title: string; description: string; duration: string; level: string; icon: string }[];
  questions_count: number;
  tests_passed: string;
  percentile: string;
}

function LoadingState() {
  return (
    <div className="flex h-64 items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>Loading results...</span>
    </div>
  );
}

/* ─────────────────────── Scorecard hero ─────────────────────── */

function ScorecardHero({
  score, rating, problemTitle, problemType, duration, summary, questionsCount, testsPassed, percentile,
}: {
  score: number; rating: string; problemTitle: string; problemType: string;
  duration: string; summary: string; questionsCount: number; testsPassed: string; percentile: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/40 p-8">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="flex flex-col items-center gap-4">
          <ScoreRing score={score} />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1 text-xs font-medium text-lime-400">
            <Check className="h-3 w-3" />
            {rating}
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{problemType}</p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-foreground">{problemTitle}</h1>
          <p className="mt-6 text-base leading-relaxed text-foreground/90">{summary}</p>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-5 sm:grid-cols-4">
            <HeroStat label="Duration" value={duration} />
            <HeroStat label="Questions" value={String(questionsCount)} />
            <HeroStat label="Tests passed" value={testsPassed} />
            <HeroStat label="Percentile" value={percentile} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground tabular-nums">{value}</div>
    </div>
  );
}

function ScoreRing({ score, size = 200 }: { score: number; size?: number }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color = score >= 70 ? "rgb(163 230 53)" : score >= 60 ? "rgb(251 191 36)" : "rgb(239 68 68)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-secondary" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-medium tracking-tight text-foreground tabular-nums">{score}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">out of 100</div>
      </div>
    </div>
  );
}

/* ─────────────────────── Skill breakdown ─────────────────────── */

function SkillBreakdown({ skills }: { skills: { label: string; score: number; change: number }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {skills.map((s) => {
        const fill = s.score >= 85 ? "bg-lime-400" : s.score >= 70 ? "bg-foreground/70" : "bg-amber-400";
        return (
          <div key={s.label} className="rounded-2xl border border-border bg-card/40 p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-medium text-foreground tabular-nums">{s.score}</span>
              <span className={`text-xs ${s.change >= 0 ? "text-lime-400" : "text-red-400"}`}>
                {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.change)}
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/60">
              <div className={`h-full rounded-full ${fill}`} style={{ width: `${s.score}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────── AI feedback ─────────────────────── */

function AIFeedback({ strengths, improvements }: { strengths: string[]; improvements: string[] }) {
  return (
    <Card title="AI feedback" subtitle="Detailed analysis from your interviewer">
      <div className="space-y-5">
        <div>
          <SectionLabel icon={ThumbsUp} tone="lime">Strengths</SectionLabel>
          <ul className="mt-2 space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" /><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-border pt-5">
          <SectionLabel icon={Lightbulb} tone="amber">Areas to improve</SectionLabel>
          <ul className="mt-2 space-y-2">
            {improvements.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /><span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────── Key moments ─────────────────────── */

function KeyMoments({ moments }: { moments: { time: string; tone: string; text: string }[] }) {
  return (
    <Card title="Key moments" subtitle="Notable moments from the session">
      <ul className="space-y-2">
        {moments.map((m, i) => {
          const dot = m.tone === "good" ? "bg-lime-400" : m.tone === "warn" ? "bg-amber-400" : "bg-foreground/40";
          return (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
              <span className="font-mono text-xs text-muted-foreground tabular-nums">{m.time}</span>
              <span className="flex-1 text-sm leading-relaxed text-foreground/90">{m.text}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ─────────────────────── Speech analytics ─────────────────────── */

function SpeechAnalytics({ data }: { data: { pace_wpm: number; filler_words: number; clarity_percent: number; pace_over_time: number[] } }) {
  return (
    <Card title="Speech analytics" subtitle="How you sounded">
      <div className="grid grid-cols-3 gap-4">
        <Metric icon={Mic} label="Pace" value={String(data.pace_wpm)} suffix="wpm" tone="good" />
        <Metric label="Filler words" value={String(data.filler_words)} tone={data.filler_words > 15 ? "warn" : "good"} />
        <Metric label="Clarity" value={`${data.clarity_percent}%`} tone="good" />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="uppercase tracking-wider text-muted-foreground">Speaking pace</span>
          <span className="text-muted-foreground">words / min over time</span>
        </div>
        <Sparkline data={data.pace_over_time} />
      </div>
    </Card>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 600, h = 60;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, h - ((v - min) / range) * h] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
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
      <path d={line} fill="none" stroke="rgb(163 230 53)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ─────────────────────── Body language ─────────────────────── */

function BodyLanguage({ data }: { data: { eye_contact_percent: number; posture: string; energy: string; eye_contact_over_time: number[] } }) {
  return (
    <Card title="Body language" subtitle="From the webcam analysis">
      <div className="grid grid-cols-3 gap-4">
        <Metric icon={Eye} label="Eye contact" value={`${data.eye_contact_percent}%`} tone="good" />
        <Metric label="Posture" value={data.posture} tone="good" />
        <Metric label="Energy" value={data.energy} tone="good" />
      </div>
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className="uppercase tracking-wider text-muted-foreground">Eye contact</span>
          <span className="text-muted-foreground">% over the session</span>
        </div>
        <div className="flex h-14 items-end gap-1">
          {data.eye_contact_over_time.map((v, i) => {
            const color = v >= 80 ? "bg-lime-400" : v >= 65 ? "bg-amber-400" : "bg-red-400";
            return <div key={i} className={`flex-1 rounded-sm ${color}`} style={{ height: `${v}%`, opacity: 0.5 + v / 200 }} />;
          })}
        </div>
      </div>
    </Card>
  );
}

/* ─────────────────────── Transcript replay ─────────────────────── */

function TranscriptReplay({ transcript }: { transcript: { time: string; who: string; text: string }[] }) {
  return (
    <Card title="Transcript replay" subtitle="Full conversation, with timestamps">
      <div className="space-y-3">
        {transcript.map((m, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-12 shrink-0 pt-0.5 font-mono text-[11px] text-muted-foreground tabular-nums">{m.time}</span>
            {m.who === "ai" ? (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-lime-400 text-[9px] font-bold text-neutral-950">AI</div>
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-secondary text-[10px] font-medium text-foreground">U</div>
            )}
            <p className={`flex-1 text-sm leading-relaxed ${m.who === "ai" ? "text-foreground/90" : "text-muted-foreground"}`}>{m.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─────────────────────── Recommended next ─────────────────────── */

function RecommendedNext({ recommendations }: { recommendations: { title: string; description: string; duration: string; level: string; icon: string }[] }) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-medium text-foreground">Practice these next</h2>
        <p className="text-sm text-muted-foreground">Picked for you based on this session.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {recommendations.map((r) => (
          <a key={r.title} href="/interview" className="group flex flex-col rounded-2xl border border-border bg-card/40 p-5 transition-all hover:border-lime-400/20 hover:shadow-[0_0_60px_-20px_rgba(163,230,53,0.25)]">
            <div className="flex items-start justify-between">
              <span className="text-2xl">{r.icon}</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-lime-400" />
            </div>
            <h3 className="mt-4 text-sm font-medium text-foreground">{r.title}</h3>
            <p className="mt-1 flex-1 text-xs text-muted-foreground">{r.description}</p>
            <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{r.duration}</span>
              <span>·</span><span>{r.level}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────── Shared ─────────────────────── */

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="mb-5">
        <h2 className="text-sm font-medium text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function SectionLabel({ icon: Icon, tone, children }: { icon: LucideIcon; tone: "lime" | "amber"; children: ReactNode }) {
  const color = tone === "lime" ? "text-lime-400" : "text-amber-400";
  return (
    <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${color}`}>
      <Icon className="h-3.5 w-3.5" />{children}
    </div>
  );
}

function Metric({ icon: Icon, label, value, suffix, tone }: { icon?: LucideIcon; label: string; value: string; suffix?: string; tone?: "good" | "warn" }) {
  const color = tone === "good" ? "text-lime-400" : tone === "warn" ? "text-amber-400" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}{label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className={`text-xl font-medium tabular-nums ${color}`}>{value}</span>
        {suffix && <span className="text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
