import { Maximize2 } from "lucide-react";

const landmarks: [number, number][] = [
  [85, 60], [115, 60], [100, 75],
  [88, 92], [100, 95], [112, 92],
  [70, 65], [130, 65], [80, 45], [120, 45],
];

export default function WebcamPanel() {
  return (
    <div className="flex flex-col bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Self-view
        </span>
        <button className="text-muted-foreground hover:text-foreground">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="relative aspect-video overflow-hidden bg-black/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(163,230,53,0.10)_0%,transparent_55%)]" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 200 150"
          fill="none"
          aria-hidden
        >
          <ellipse
            cx="100" cy="75" rx="42" ry="50"
            stroke="rgba(163,230,53,0.35)"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          {landmarks.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.5" fill="#a3e635" />
          ))}
          <path
            d="M 85 60 L 115 60 M 88 92 L 112 92"
            stroke="rgba(163,230,53,0.4)"
            strokeWidth="0.5"
          />
        </svg>

        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-400" />
          </span>
          <span className="text-foreground">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
        <Metric label="Eye contact" value="87%" tone="good" />
        <Metric label="Posture" value="Stable" />
        <Metric label="Energy" value="High" tone="good" />
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "warn";
}) {
  const color =
    tone === "good"
      ? "text-lime-400"
      : tone === "warn"
        ? "text-amber-400"
        : "text-foreground";
  return (
    <div className="px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-0.5 text-sm font-medium ${color}`}>{value}</div>
    </div>
  );
}