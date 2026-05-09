"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Mic,
  Terminal,
  FileText,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Interviews", href: "/dashboard/interviews", icon: Mic },
  { label: "Coding", href: "/dashboard/coding", icon: Terminal },
  { label: "Resume", href: "/dashboard/resume", icon: FileText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-background lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-6">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-400 text-neutral-950">
            <svg
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
            </svg>
          </div>
          <span className="text-[15px] font-medium tracking-tight text-foreground">
            Interview<span className="text-lime-400">Verse</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Workspace
          </p>
          {nav.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-secondary/60 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-lime-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade card */}
        <div className="mx-3 mb-3 rounded-lg border border-lime-400/20 bg-lime-400/5 p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-lime-400" />
            <span className="text-xs font-medium text-foreground">
              Upgrade to Pro
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Unlimited interviews, advanced analytics, and a personal coach.
          </p>
          <button className="mt-2.5 w-full rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background transition-colors hover:bg-foreground/90">
            Upgrade
          </button>
        </div>

        {/* User card */}
        <div className="border-t border-border p-3">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-md p-2 hover:bg-secondary/40"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-xs font-medium text-neutral-950">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-foreground">
                Alex Morgan
              </div>
              <div className="truncate text-[10px] text-muted-foreground">
                Free plan
              </div>
            </div>
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </aside>
  );
}