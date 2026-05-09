import Link from "next/link";
import { ArrowLeft, Download, Share2, RotateCcw } from "lucide-react";

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 text-xs text-foreground transition-colors hover:bg-secondary/70">
              <Download className="h-3.5 w-3.5" />
              PDF
            </button>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 text-xs text-foreground transition-colors hover:bg-secondary/70">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)]">
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}