import { Search, Bell, Plus } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-6 backdrop-blur-xl lg:px-10">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search sessions, problems, companies…"
          className="h-9 w-full rounded-md border border-border bg-secondary/30 pl-9 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-border/80 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-lime-400" />
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)]">
          <Plus className="h-3.5 w-3.5" />
          New interview
        </button>
      </div>
    </header>
  );
}