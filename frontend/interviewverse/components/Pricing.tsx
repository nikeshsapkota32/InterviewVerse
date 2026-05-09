import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for getting started with interview prep.",
    features: [
      "5 mock interviews per month",
      "Basic AI recruiter",
      "Coding problems (Easy)",
      "Resume ATS score",
      "7-day session history",
    ],
    cta: "Get started",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Pro",
    price: "19",
    period: "per month",
    description: "For serious candidates prepping for top-tier roles.",
    features: [
      "Unlimited mock interviews",
      "Advanced AI recruiter with follow-ups",
      "All coding problems (Easy–Hard)",
      "Deep resume analysis & rewrite tips",
      "Video body language coaching",
      "Full analytics & skill trends",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/sign-up?plan=pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "49",
    period: "per seat/month",
    description: "For bootcamps and recruiting teams.",
    features: [
      "Everything in Pro",
      "Team dashboard & leaderboard",
      "Custom question banks",
      "Bulk seat management",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact us",
    href: "mailto:sales@interviewverse.io",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-lime-400/80">Pricing</p>
          <h2 className="mt-4 text-balance text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Start free.{" "}
            <span className="font-serif font-normal italic text-muted-foreground">
              Upgrade when you&apos;re ready.
            </span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            No credit card required. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
                plan.highlight
                  ? "border-lime-400/30 bg-lime-400/5 shadow-[0_0_60px_-20px_rgba(163,230,53,0.3)]"
                  : "border-border bg-card/40 hover:border-lime-400/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full border border-lime-400/30 bg-background px-3 py-0.5 text-[10px] font-medium uppercase tracking-widest text-lime-400">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-4xl font-medium tracking-tight text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="my-7 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)]"
                    : "border border-border bg-secondary/40 text-foreground hover:bg-secondary/60"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="mt-14 text-center text-sm text-muted-foreground">
          Questions? Check our{" "}
          <Link href="/docs" className="text-foreground underline underline-offset-2 hover:text-primary">
            documentation
          </Link>{" "}
          or email{" "}
          <a href="mailto:hello@interviewverse.io" className="text-foreground underline underline-offset-2 hover:text-primary">
            hello@interviewverse.io
          </a>
        </div>
      </div>
    </section>
  );
}
