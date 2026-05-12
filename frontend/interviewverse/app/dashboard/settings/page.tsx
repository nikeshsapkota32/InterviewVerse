"use client";

import { useState, useEffect } from "react";
import { Save, User, Bell, Shield, Trash2, Eye, EyeOff, Loader2, CreditCard, Crown, Zap, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/authStore";

const PLAN_META: Record<string, { label: string; color: string; icon: typeof Crown; desc: string }> = {
  free: {
    label: "Free",
    color: "text-muted-foreground",
    icon: Zap,
    desc: "3 interviews/month · Basic feedback",
  },
  pro: {
    label: "Pro",
    color: "text-primary",
    icon: Sparkles,
    desc: "20 interviews/month · Advanced analytics",
  },
  premium: {
    label: "Premium",
    color: "text-amber-400",
    icon: Crown,
    desc: "Unlimited interviews · All features",
  },
};

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { user } = useAuthStore();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
  });

  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    sessionReminders: true,
    tipsAndTricks: false,
    productUpdates: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("iv_user");
      if (stored) {
        const u = JSON.parse(stored);
        setProfile((p) => ({ ...p, name: u.name || "", email: u.email || "" }));
      }
    } catch {}
  }, []);

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const currentPlan = user?.plan ?? "free";
  const planInfo = PLAN_META[currentPlan] ?? PLAN_META.free;
  const PlanIcon = planInfo.icon;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account preferences</p>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar */}
        <nav className="flex shrink-0 flex-row gap-1 lg:w-44 lg:flex-col">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                tab === id
                  ? "bg-secondary/60 text-foreground"
                  : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1 rounded-2xl border border-border bg-card/40 p-6">
          {tab === "profile" && (
            <div className="space-y-5">
              <h2 className="text-sm font-medium text-foreground">Profile Information</h2>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 text-xl font-medium text-neutral-950">
                  {profile.name ? profile.name[0].toUpperCase() : "U"}
                </div>
                <div>
                  <button className="text-xs text-primary hover:underline">Change avatar</button>
                  <p className="mt-0.5 text-xs text-muted-foreground">JPG, PNG or GIF · Max 2 MB</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
                <Field label="Email" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} type="email" />
                <Field label="Location" value={profile.location} onChange={(v) => setProfile((p) => ({ ...p, location: v }))} placeholder="San Francisco, CA" />
                <Field label="Website" value={profile.website} onChange={(v) => setProfile((p) => ({ ...p, website: v }))} placeholder="https://yoursite.com" />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border bg-secondary/20 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <SaveButton saving={saving} saved={saved} onClick={save} />
            </div>
          )}

          {tab === "subscription" && (
            <div className="space-y-6">
              <h2 className="text-sm font-medium text-foreground">Subscription</h2>

              {/* Current plan card */}
              <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/20 p-4">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/60 ${planInfo.color}`}>
                  <PlanIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${planInfo.color}`}>{planInfo.label} plan</span>
                    <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground uppercase tracking-wide">
                      Active
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{planInfo.desc}</p>
                </div>
              </div>

              {/* Usage limits */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Usage this month</h3>
                <UsageBar
                  label="Mock interviews"
                  used={currentPlan === "free" ? 2 : currentPlan === "pro" ? 14 : null}
                  max={currentPlan === "free" ? 3 : currentPlan === "pro" ? 20 : null}
                />
                <UsageBar
                  label="Resume analyses"
                  used={currentPlan === "free" ? 1 : null}
                  max={currentPlan === "free" ? 2 : null}
                />
              </div>

              {/* Upgrade CTA */}
              {currentPlan !== "premium" && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {currentPlan === "free"
                      ? "Upgrade to Pro or Premium for unlimited practice"
                      : "Upgrade to Premium for unlimited interviews + coaching"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {currentPlan === "free"
                      ? "Get advanced analytics, video analysis, and speech feedback."
                      : "Remove all limits and get 1-on-1 monthly coaching sessions."}
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    View plans
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}

              {currentPlan === "premium" && (
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-4">
                  <p className="text-sm font-medium text-amber-400">You have full access</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    All features are unlocked. Enjoy unlimited mock interviews and monthly coaching.
                  </p>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  To cancel or manage billing, contact{" "}
                  <a href="mailto:support@interviewverse.com" className="text-foreground hover:underline">
                    support@interviewverse.com
                  </a>
                </p>
              </div>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-5">
              <h2 className="text-sm font-medium text-foreground">Email Notifications</h2>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, val]) => {
                  const labels: Record<string, { title: string; desc: string }> = {
                    weeklyReport: { title: "Weekly report", desc: "Your performance summary every Monday" },
                    sessionReminders: { title: "Session reminders", desc: "Reminders to practice when your streak is at risk" },
                    tipsAndTricks: { title: "Tips & tricks", desc: "Occasional interview tips from our AI coach" },
                    productUpdates: { title: "Product updates", desc: "New features, improvements, and announcements" },
                  };
                  const item = labels[key];
                  return (
                    <div key={key} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                      <button
                        onClick={() => setNotifications((n) => ({ ...n, [key]: !val }))}
                        className={`relative h-5 w-9 rounded-full transition-colors ${val ? "bg-primary" : "bg-secondary/60"}`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${val ? "translate-x-4" : "translate-x-0.5"}`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
              <SaveButton saving={saving} saved={saved} onClick={save} />
            </div>
          )}

          {tab === "security" && (
            <div className="space-y-5">
              <h2 className="text-sm font-medium text-foreground">Change Password</h2>
              <div className="space-y-3">
                <Field label="Current password" value="" onChange={() => {}} type={showPw ? "text" : "password"} placeholder="••••••••" />
                <Field label="New password" value="" onChange={() => {}} type={showPw ? "text" : "password"} placeholder="••••••••" />
                <Field label="Confirm new password" value="" onChange={() => {}} type={showPw ? "text" : "password"} placeholder="••••••••" />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPw ? "Hide" : "Show"} password
                </button>
              </div>
              <SaveButton saving={saving} saved={saved} onClick={save} label="Update password" />

              <div className="mt-8 border-t border-border pt-6">
                <h2 className="text-sm font-medium text-foreground">Danger Zone</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
                <button className="mt-3 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-400/20">
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UsageBar({ label, used, max }: { label: string; used: number | null; max: number | null }) {
  if (used === null || max === null) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="text-lime-400 text-xs font-medium">Unlimited</span>
      </div>
    );
  }
  const pct = Math.min(100, Math.round((used / max) * 100));
  const fill = pct >= 90 ? "bg-red-400" : pct >= 60 ? "bg-amber-400" : "bg-primary";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">{used} / {max}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary/60">
        <div className={`h-full rounded-full transition-all ${fill}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-border bg-secondary/20 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function SaveButton({ saving, saved, onClick, label = "Save changes" }: {
  saving: boolean;
  saved: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
    >
      {saving ? (
        <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
      ) : saved ? (
        <><Save className="h-4 w-4" /> Saved!</>
      ) : (
        <><Save className="h-4 w-4" /> {label}</>
      )}
    </button>
  );
}
