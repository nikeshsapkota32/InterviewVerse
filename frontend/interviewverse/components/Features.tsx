import type { ReactNode } from "react";

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-lime-400/80">
            Features
          </p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Everything you need to{" "}
            <span className="font-serif font-normal italic text-muted-foreground">
              crack
            </span>{" "}
            the next round.
          </h2>
          <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
            One platform. Four interview surfaces. All driven by an AI that
            actually pays attention.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-16 grid gap-4 sm:gap-5 lg:grid-cols-3">
          <FeatureCard
            className="lg:col-span-2"
            tag="AI Recruiter"
            title="Interviews that listen back."
            description="A natural voice AI that asks follow-ups, probes for detail, and adapts to your answers in real time — just like a real loop."
          >
            <ChatPreview />
          </FeatureCard>

          <FeatureCard
            tag="Vision"
            title="Body language coach."
            description="Posture, eye contact, hand movement — scored frame by frame."
          >
            <WebcamPreview />
          </FeatureCard>

          <FeatureCard
            tag="Editor"
            title="Real coding rounds."
            description="Timed problems, hidden test cases, live hints. Browser-based."
          >
            <CodePreview />
          </FeatureCard>

          <FeatureCard
            className="lg:col-span-2"
            tag="ATS Score"
            title="Resume that lands the loop."
            description="Drop your resume, get a recruiter-grade breakdown — keyword gaps, weak bullets, ATS-readiness — mapped to the exact role you want."
          >
            <ResumePreview />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────── Card shell ─────────────────────── */

function FeatureCard({
  tag,
  title,
  description,
  children,
  className = "",
}: {
  tag: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:border-lime-400/20 hover:shadow-[0_0_60px_-20px_rgba(163,230,53,0.25)] ${className}`}
    >
      <div className="space-y-2.5">
        <span className="inline-flex items-center rounded-full border border-lime-400/20 bg-lime-400/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] text-lime-400">
          {tag}
        </span>
        <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-6 flex-1">{children}</div>
    </article>
  );
}

/* ─────────────────────── 1. AI Chat ─────────────────────── */

function ChatPreview() {
  return (
    <div className="relative h-full min-h-[200px] rounded-xl border border-border/60 bg-background/50 p-4">
      <div className="flex flex-col gap-3">
        {/* AI bubble */}
        <div className="flex items-start gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-lime-400 text-[10px] font-bold text-neutral-950">
            AI
          </div>
          <div className="rounded-lg rounded-tl-sm bg-secondary/60 px-3 py-2 text-sm text-foreground">
            Walk me through your most challenging system design project.
          </div>
        </div>
        {/* User bubble */}
        <div className="flex items-start justify-end gap-2.5">
          <div className="rounded-lg rounded-tr-sm bg-foreground/10 px-3 py-2 text-sm text-foreground">
            Sure — last year I built a distributed cache that…
          </div>
        </div>
        {/* Listening waveform */}
        <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
          <div className="flex items-end gap-0.5">
            {[3, 5, 2, 6, 4, 5, 2].map((h, i) => (
              <span
                key={i}
                className="w-0.5 animate-pulse rounded-full bg-lime-400"
                style={{ height: `${h * 3}px`, animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
          Listening · transcribing in real time
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── 2. Webcam ─────────────────────── */

function WebcamPreview() {
  const landmarks: [number, number][] = [
    [85, 60], [115, 60], [100, 75],
    [88, 92], [100, 95], [112, 92],
    [70, 65], [130, 65], [80, 45], [120, 45],
  ];

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-background/80">
      {/* Soft glow behind face */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(163,230,53,0.08)_0%,transparent_55%)]" />

      {/* Face landmark overlay */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 150"
        fill="none"
        aria-hidden
      >
        <ellipse
          cx="100" cy="75" rx="42" ry="50"
          stroke="rgba(163,230,53,0.3)"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
        {landmarks.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="#a3e635" />
        ))}
        <path
          d="M 85 60 L 115 60 M 88 92 L 112 92"
          stroke="rgba(163,230,53,0.4)"
          strokeWidth="0.5"
        />
      </svg>

      {/* LIVE pill */}
      <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-400" />
        </span>
        <span className="text-foreground">LIVE</span>
      </div>

      {/* Metrics */}
      <div className="absolute inset-x-2 bottom-2 flex justify-between gap-2 text-[10px]">
        <div className="rounded-md bg-background/80 px-2 py-1 backdrop-blur">
          <div className="text-muted-foreground">Eye contact</div>
          <div className="font-medium text-lime-400">87%</div>
        </div>
        <div className="rounded-md bg-background/80 px-2 py-1 backdrop-blur">
          <div className="text-muted-foreground">Posture</div>
          <div className="font-medium text-foreground">Stable</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── 3. Code editor ─────────────────────── */

function CodePreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background/80 font-mono text-[11px]">
      {/* Tab bar */}
      <div className="flex items-center gap-2 border-b border-border/60 px-3 py-1.5">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
        </div>
        <span className="ml-1 text-muted-foreground">two-sum.ts</span>
      </div>
      {/* Code */}
      <div className="p-3 leading-relaxed">
        <div><span className="text-fuchsia-400">function</span> <span className="text-sky-300">twoSum</span>(nums, target) {`{`}</div>
        <div className="pl-3"><span className="text-fuchsia-400">const</span> map = <span className="text-fuchsia-400">new</span> <span className="text-sky-300">Map</span>();</div>
        <div className="pl-3"><span className="text-fuchsia-400">for</span> (<span className="text-fuchsia-400">let</span> i = 0; i {"<"} nums.length; i++) {`{`}</div>
        <div className="pl-6"><span className="text-fuchsia-400">const</span> diff = target - nums[i];</div>
        <div className="pl-6"><span className="text-fuchsia-400">if</span> (map.has(diff)) <span className="text-fuchsia-400">return</span> [map.get(diff), i];</div>
        <div className="pl-6">map.set(nums[i], i);</div>
        <div className="pl-3">{`}`}</div>
        <div>{`}`}</div>
      </div>
      {/* Status */}
      <div className="flex items-center justify-between border-t border-border/60 bg-background/60 px-3 py-1.5 text-[10px]">
        <span className="flex items-center gap-1.5 text-lime-400">
          <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M13 4 6 11l-3-3 1-1 2 2 6-6 1 1z" />
          </svg>
          12/12 tests passed
        </span>
        <span className="text-muted-foreground">64ms</span>
      </div>
    </div>
  );
}

/* ─────────────────────── 4. Resume + Score ─────────────────────── */

function ResumePreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
      {/* Resume mock */}
      <div className="rounded-xl border border-border/60 bg-background/50 p-4">
        <div className="space-y-2.5">
          <div className="flex items-baseline justify-between border-b border-border/40 pb-2">
            <div>
              <div className="text-sm font-medium text-foreground">Alex Morgan</div>
              <div className="text-[11px] text-muted-foreground">
                Senior Software Engineer
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground">resume.pdf</div>
          </div>
          <ul className="space-y-1.5 text-[11px] text-muted-foreground">
            <li>
              • Built a{" "}
              <span className="rounded bg-lime-400/15 px-1 text-foreground/90">
                distributed system
              </span>{" "}
              serving 2M req/s
            </li>
            <li>
              • Led migration to{" "}
              <span className="rounded bg-lime-400/15 px-1 text-foreground/90">
                Kubernetes
              </span>
              , cutting infra cost 40%
            </li>
            <li>
              • Mentored 6 engineers across{" "}
              <span className="rounded bg-lime-400/15 px-1 text-foreground/90">
                React
              </span>{" "}
              and{" "}
              <span className="rounded bg-lime-400/15 px-1 text-foreground/90">
                TypeScript
              </span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-1 pt-1">
            {["Go", "AWS", "GraphQL", "Postgres", "Kafka"].map((s) => (
              <span
                key={s}
                className="rounded-md border border-border/60 bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Score panel */}
      <div className="flex flex-col justify-between rounded-xl border border-border/60 bg-background/50 p-4 sm:w-32">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            ATS Score
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-3xl font-medium text-lime-400">87</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary/60">
            <div className="h-full w-[87%] rounded-full bg-lime-400" />
          </div>
        </div>
        <div className="mt-3 space-y-1 text-[10px]">
          <Row label="Keywords" value="23/28" tone="good" />
          <Row label="Format" value="✓" tone="good" />
          <Row label="Length" value="!" tone="warn" />
        </div>
      </div>
    </div>
  );
}

function Row({
  label, value, tone,
}: {
  label: string;
  value: string;
  tone: "good" | "warn";
}) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          tone === "good" ? "text-lime-400" : "text-amber-400"
        }
      >
        {value}
      </span>
    </div>
  );
}