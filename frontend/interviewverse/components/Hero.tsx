import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      {/* Dot grid, faded toward edges */}
      <div className="pointer-events-none absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      {/* Lime glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <div className="h-[500px] w-[700px] rounded-full bg-lime-400/[0.10] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Eyebrow with pulse */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-400" />
          </span>
          Now in private beta
        </div>

        {/* Headline with serif italic accent */}
        <h1 className="text-balance text-5xl font-medium tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Practice interviews{" "}
          <span className="font-serif font-normal italic text-muted-foreground">
            that actually
          </span>{" "}
          feel real.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
          AI recruiters that ask, listen, and grade. Live speech analysis,
          webcam coaching, and a coding environment — all in one room.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="group relative inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_32px_rgba(163,230,53,0.35)]"
          >
            Start free practice
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M3 8h10m-4-4 4 4-4 4" />
            </svg>
          </Link>
          <Link
            href="#demo"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-secondary/40 px-6 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-secondary/70"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden
            >
              <path d="M5 3.5v9l7-4.5-7-4.5z" />
            </svg>
            Watch demo
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-14 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          Trusted by candidates from
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
          <span>Google</span>
          <span>Meta</span>
          <span>Amazon</span>
          <span>Stripe</span>
          <span>Netflix</span>
          <span>Microsoft</span>
        </div>
      </div>
    </section>
  );
}