import Link from "next/link";
import Navbar from "@/components/Navbar";

const steps = [
  {
    number: "01",
    title: "Choose your interview type",
    description:
      "Select from Coding, System Design, or Behavioral interviews. Pick a difficulty level and the AI matches you with a relevant problem from our curated problem bank.",
    detail: "Supports Easy, Medium, and Hard problems across Data Structures, Algorithms, System Design, and Leadership topics.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Live interview with AI recruiter",
    description:
      "Sarah, your AI recruiter, opens the session with the problem and asks follow-up questions in real time as you solve and explain your approach.",
    detail: "Powered by Claude AI. Sarah adapts questions based on your answers — pushing back on weak explanations and praising strong insights.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Webcam & body language analysis",
    description:
      "Your webcam is analyzed in real time using computer vision. Eye contact percentage, posture stability, and energy level are tracked throughout the session.",
    detail: "All processing runs in your browser — no video is sent to our servers. Fully private and instant.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5 4.72 21.53M15.75 10.5H9m6.75 0V4.875c0-.621-.504-1.125-1.125-1.125H6.75a1.125 1.125 0 0 0-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h1.5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Write and run your code",
    description:
      "Use the built-in code editor to write your solution. Hit Run to execute it against real test cases — the backend runs your Python code in a sandboxed environment.",
    detail: "Supports Python, JavaScript, and TypeScript. Test results show pass/fail with execution times.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "End and get scored",
    description:
      "End the interview at any time. The AI evaluates your code, communication, problem-solving approach, and body language to generate a score out of 100.",
    detail: "Scores map to hiring decisions: Strong Hire (≥85), Hire (75–84), Maybe (60–74), No Hire (<60).",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.563.563 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Deep feedback & next steps",
    description:
      "Get a full breakdown: skill scores, AI-written strengths and improvements, key moments timeline, speech analytics, and personalized practice recommendations.",
    detail: "Every session improves your dashboard streak, avg score, and skill breakdown charts.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
];

const tech = [
  { name: "Next.js 16", role: "Frontend framework", color: "text-foreground" },
  { name: "FastAPI", role: "Backend API", color: "text-lime-400" },
  { name: "Claude AI", role: "AI recruiter & feedback", color: "text-lime-400" },
  { name: "WebSocket", role: "Real-time communication", color: "text-foreground" },
  { name: "MediaPipe", role: "In-browser face detection", color: "text-foreground" },
  { name: "Zustand", role: "State management", color: "text-foreground" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/5 px-3 py-1 text-xs font-medium text-lime-400">
            How InterviewVerse works
          </span>
          <h1 className="mt-6 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            From problem to feedback{" "}
            <span className="italic text-lime-400">in one session</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete mock interview loop — AI recruiter, code execution, webcam analysis, and
            scored feedback — all in your browser.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/interview"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)] transition-all"
            >
              Try it now
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden lg:block" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="relative flex gap-8">
                {/* Number bubble */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-background">
                  <div className="text-lime-400">{step.icon}</div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-muted-foreground">{step.number}</span>
                    <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-base text-muted-foreground leading-relaxed">{step.description}</p>
                  <div className="mt-3 rounded-lg border border-border/50 bg-secondary/20 px-4 py-2.5 text-sm text-muted-foreground">
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-t border-border bg-card/20 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-medium text-foreground">Built with</h2>
            <p className="mt-2 text-sm text-muted-foreground">The technology powering every session</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tech.map((t) => (
              <div key={t.name} className="rounded-xl border border-border bg-card/40 px-5 py-4">
                <div className={`text-sm font-medium ${t.color}`}>{t.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-medium text-foreground">Ready to practice?</h2>
          <p className="mt-3 text-muted-foreground">Start your first mock interview — no account required to try.</p>
          <Link
            href="/interview"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_32px_rgba(163,230,53,0.4)] transition-all"
          >
            Start a free interview
          </Link>
        </div>
      </section>
    </div>
  );
}
