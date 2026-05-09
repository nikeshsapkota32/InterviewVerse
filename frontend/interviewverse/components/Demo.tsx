import Link from "next/link";
import { Play, Mic, Terminal, Eye, FileText } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "AI Recruiter kicks off",
    desc: "The AI greets you, checks your role preference, and starts the interview loop.",
  },
  {
    icon: Terminal,
    title: "Live coding challenge",
    desc: "You get a timed coding problem. Write your solution, run tests, get real feedback.",
  },
  {
    icon: Eye,
    title: "Webcam coaching",
    desc: "Your eye contact, posture, and energy are tracked frame by frame throughout.",
  },
  {
    icon: FileText,
    title: "Full debrief",
    desc: "Score breakdown, skill gaps, and a personalized action plan — ready in seconds.",
  },
];

export default function Demo() {
  return (
    <section id="demo" className="relative py-24 sm:py-32 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Left — text */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-lime-400/80">Demo</p>
            <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              See it in{" "}
              <span className="font-serif font-normal italic text-muted-foreground">action.</span>
            </h2>
            <p className="mt-5 text-base text-muted-foreground">
              A full mock interview — from intro to debrief — in about 40 minutes. Here&apos;s what happens inside.
            </p>

            <ol className="mt-10 space-y-6">
              {steps.map((step, i) => (
                <li key={step.title} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card/40 text-xs font-medium text-muted-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-lime-400" />
                      <h3 className="text-sm font-medium text-foreground">{step.title}</h3>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_32px_rgba(163,230,53,0.35)]"
              >
                <Play className="h-4 w-4" />
                Try it free
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-11 items-center rounded-lg border border-border px-6 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                How it works →
              </Link>
            </div>
          </div>

          {/* Right — mock interview terminal */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-card/40 overflow-hidden shadow-2xl">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/60" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/60" />
                  <span className="h-3 w-3 rounded-full bg-lime-400/60" />
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-secondary/40 px-3 py-1 text-xs text-muted-foreground">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-400" />
                  </span>
                  Live interview session
                </div>
                <div className="text-xs text-muted-foreground">38:24</div>
              </div>

              {/* Chat area */}
              <div className="space-y-4 p-5">
                <ChatBubble from="ai">
                  Let&apos;s start with system design. How would you design a URL shortener like bit.ly that handles 1B URLs?
                </ChatBubble>
                <ChatBubble from="user">
                  I&apos;d start with a hash function — base62 encoding of an auto-incrementing ID. For reads, a CDN + Redis cache in front of the DB…
                </ChatBubble>
                <ChatBubble from="ai">
                  Good call on caching. How would you handle cache invalidation when a URL expires?
                </ChatBubble>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-end gap-0.5">
                    {[3, 5, 2, 6, 4, 5, 2, 4].map((h, i) => (
                      <span
                        key={i}
                        className="w-0.5 animate-pulse rounded-full bg-lime-400"
                        style={{ height: `${h * 3}px`, animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                  Listening…
                </div>
              </div>

              {/* Bottom metrics bar */}
              <div className="flex items-center justify-between border-t border-border px-5 py-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-lime-400" />
                    Eye contact 84%
                  </span>
                  <span className="hidden sm:flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 text-lime-400" />
                    Speaking clearly
                  </span>
                </div>
                <div className="rounded-md bg-lime-400/10 px-2.5 py-1 text-xs font-medium text-lime-400">
                  Score 78 / 100
                </div>
              </div>
            </div>

            {/* Floating score card */}
            <div className="absolute -right-4 -bottom-4 rounded-xl border border-border bg-background p-3 shadow-xl sm:-right-8 sm:-bottom-6">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Problem solving</div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-2xl font-medium text-lime-400">91</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
              <div className="mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-secondary/60">
                <div className="h-full w-[91%] rounded-full bg-lime-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ from, children }: { from: "ai" | "user"; children: React.ReactNode }) {
  if (from === "ai") {
    return (
      <div className="flex items-start gap-2.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-lime-400 text-[10px] font-bold text-neutral-950">
          AI
        </div>
        <div className="rounded-lg rounded-tl-sm bg-secondary/60 px-3 py-2 text-sm text-foreground">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start justify-end gap-2.5">
      <div className="rounded-lg rounded-tr-sm bg-foreground/10 px-3 py-2 text-sm text-foreground max-w-[80%]">
        {children}
      </div>
    </div>
  );
}
