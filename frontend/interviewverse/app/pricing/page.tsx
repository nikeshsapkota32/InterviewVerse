"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { authApi } from "@/lib/api";

const PLANS = [
  {
    id: "free",
    name: "Free",
    icon: Zap,
    price: { monthly: 0, annual: 0 },
    tagline: "Get started at no cost",
    color: "text-muted-foreground",
    border: "border-border",
    badge: null,
    features: [
      "3 mock interviews per month",
      "Basic AI feedback",
      "2 coding problems",
      "Community access",
      "Email support",
    ],
    missing: [
      "Unlimited interviews",
      "Advanced analytics",
      "Video body-language analysis",
      "Speech pacing & filler detection",
      "Resume ATS scorer",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Sparkles,
    price: { monthly: 19, annual: 15 },
    tagline: "For serious job seekers",
    color: "text-primary",
    border: "border-primary/60",
    badge: "Most popular",
    features: [
      "20 mock interviews per month",
      "Advanced AI feedback",
      "Full problem library",
      "Video body-language analysis",
      "Speech pacing & filler detection",
      "Resume ATS scorer",
      "Performance analytics",
      "Priority email support",
    ],
    missing: [
      "Unlimited interviews",
      "Custom interview scenarios",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    icon: Crown,
    price: { monthly: 39, annual: 29 },
    tagline: "Everything, no limits",
    color: "text-amber-400",
    border: "border-amber-400/50",
    badge: "Best value",
    features: [
      "Unlimited mock interviews",
      "Advanced AI feedback",
      "Full problem library",
      "Video body-language analysis",
      "Speech pacing & filler detection",
      "Resume ATS scorer",
      "Custom interview scenarios",
      "Performance analytics & trends",
      "1-on-1 coaching session / month",
      "Dedicated support",
    ],
    missing: [],
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const { user, token } = useAuthStore();
  const router = useRouter();

  async function handleSelect(planId: string) {
    if (planId === "free" && !user) {
      router.push("/sign-up");
      return;
    }
    if (!user) {
      router.push(`/sign-in?redirect=/pricing`);
      return;
    }
    if (user.plan === planId) return;

    setUpgrading(planId);
    try {
      const { data } = await authApi.upgradePlan(planId);
      // Update stored user
      const updated = { ...user, plan: data.plan };
      localStorage.setItem("iv_user", JSON.stringify(updated));
      useAuthStore.setState({ user: updated });
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setUpgrading(null);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← Back to home
        </Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Practice smarter. Land the job. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-border bg-card/40 p-1.5">
          <button
            onClick={() => setAnnual(false)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              !annual ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
              annual ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annual
            <span className="rounded-full bg-lime-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-lime-400">
              Save 25%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const price = annual ? plan.price.annual : plan.price.monthly;
          const isCurrent = user?.plan === plan.id;
          const isUpgrading = upgrading === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border ${plan.border} bg-card/40 p-6 transition-shadow hover:shadow-[0_0_32px_rgba(0,0,0,0.3)]`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-medium ${
                    plan.id === "pro"
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-amber-400/40 bg-amber-400/10 text-amber-400"
                  }`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-2.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 ${plan.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className={`text-base font-semibold ${plan.color}`}>{plan.name}</div>
                  <div className="text-xs text-muted-foreground">{plan.tagline}</div>
                </div>
              </div>

              {/* Price */}
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  ${price}
                </span>
                {price > 0 && (
                  <span className="text-sm text-muted-foreground">/ mo</span>
                )}
              </div>
              {price === 0 && (
                <span className="text-sm text-muted-foreground">Free forever</span>
              )}
              {annual && price > 0 && (
                <span className="mt-0.5 text-xs text-muted-foreground">
                  Billed ${price * 12}/year
                </span>
              )}

              {/* CTA */}
              <button
                onClick={() => handleSelect(plan.id)}
                disabled={isCurrent || isUpgrading}
                className={`mt-5 flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium transition-all disabled:cursor-default ${
                  isCurrent
                    ? "border border-border bg-secondary/30 text-muted-foreground"
                    : plan.id === "premium"
                    ? "bg-amber-400 text-neutral-950 hover:bg-amber-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.35)]"
                    : plan.id === "pro"
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)]"
                    : "border border-border bg-secondary/40 text-foreground hover:bg-secondary/60"
                }`}
              >
                {isUpgrading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Switching…
                  </span>
                ) : isCurrent ? (
                  "Current plan"
                ) : plan.id === "free" ? (
                  user ? "Downgrade to Free" : "Get started free"
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>

              <div className="my-5 h-px bg-border" />

              {/* Features */}
              <ul className="space-y-2.5 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 opacity-35">
                    <span className="mt-0.5 h-4 w-4 shrink-0 text-center text-xs leading-4">—</span>
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* FAQ note */}
      <p className="mt-14 text-center text-sm text-muted-foreground">
        All plans include a 14-day money-back guarantee.{" "}
        <Link href="/docs" className="text-foreground underline-offset-2 hover:underline">
          Read the FAQ
        </Link>
      </p>

      {/* Current user plan info */}
      {user && (
        <div className="mx-auto mt-8 max-w-sm rounded-xl border border-border bg-card/40 p-4 text-center text-sm">
          <span className="text-muted-foreground">You are on the </span>
          <span className="font-semibold capitalize text-foreground">{user.plan}</span>
          <span className="text-muted-foreground"> plan.</span>{" "}
          <Link href="/dashboard" className="text-primary hover:underline">
            Go to dashboard →
          </Link>
        </div>
      )}
    </div>
  );
}
