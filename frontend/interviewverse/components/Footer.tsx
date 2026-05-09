import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-lime-400 text-neutral-950">
                <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">
                Interview<span className="text-lime-400">Verse</span>
              </span>
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">
              AI-powered interview practice for engineers who want the job.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/#demo" className="hover:text-foreground transition-colors">Demo</Link></li>
              <li><Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How it works</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="/dashboard/coding" className="hover:text-foreground transition-colors">Problem bank</Link></li>
              <li><Link href="/sign-up" className="hover:text-foreground transition-colors">Get started</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><a href="mailto:hello@interviewverse.io" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2025 InterviewVerse. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <span className="text-foreground">Claude AI</span> · Built with Next.js &amp; FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
