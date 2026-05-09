"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    // Simulate sending reset email
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-400 text-neutral-950">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
              <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
            </svg>
          </div>
          <span className="text-[15px] font-medium tracking-tight text-foreground">
            Interview<span className="text-lime-400">Verse</span>
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-8">
          {!sent ? (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-medium text-foreground">Reset your password</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="h-10 w-full rounded-lg border border-border bg-secondary/20 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    "Send reset link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-lime-400" />
              <h2 className="text-lg font-medium text-foreground">Check your inbox</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a password reset link to <span className="text-foreground">{email}</span>.
                Check your spam folder if you don&apos;t see it.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-4 text-xs text-muted-foreground hover:text-foreground"
              >
                Try a different email
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
