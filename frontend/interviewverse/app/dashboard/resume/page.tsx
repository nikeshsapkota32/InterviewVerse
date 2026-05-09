"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { resumeApi } from "@/lib/api";

interface ResumeResult {
  ats_score: number;
  keyword_score: number;
  format_score: number;
  impact_score: number;
  length_score: number;
  found_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  summary: string;
}

export default function ResumePage() {
  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let res;
      if (mode === "upload" && file) {
        res = await resumeApi.analyzeFile(file);
      } else if (mode === "paste" && text.trim()) {
        res = await resumeApi.analyze(text);
      } else {
        setError("Please provide a resume to analyze.");
        setLoading(false);
        return;
      }
      setResult(res.data as ResumeResult);
    } catch {
      setError("Analysis failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }

  const scoreColor = (s: number) =>
    s >= 80 ? "text-lime-400" : s >= 60 ? "text-amber-400" : "text-red-400";

  const scoreBarColor = (s: number) =>
    s >= 80 ? "bg-lime-400" : s >= 60 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">Resume Analyzer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get your ATS score and actionable feedback in seconds
        </p>
      </header>

      {!result ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Input panel */}
          <div className="space-y-4">
            {/* Mode toggle */}
            <div className="flex rounded-lg border border-border bg-secondary/20 p-1">
              {(["upload", "paste"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 rounded-md py-1.5 text-sm capitalize transition-colors ${
                    mode === m
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "upload" ? "Upload file" : "Paste text"}
                </button>
              ))}
            </div>

            {mode === "upload" ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
                  dragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-secondary/20"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <FileText className="h-10 w-10 text-lime-400" />
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-red-400"
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Drop your resume here</p>
                      <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, DOCX, or TXT · Max 10 MB</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={10}
                className="w-full resize-none rounded-2xl border border-border bg-secondary/20 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={analyze}
              disabled={loading || (mode === "upload" ? !file : !text.trim())}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card/40 p-5">
              <h3 className="mb-4 text-sm font-medium text-foreground">What we check</h3>
              {[
                { label: "ATS Compatibility", desc: "Keyword density and format parsing" },
                { label: "Impact Language", desc: "Action verbs and quantified achievements" },
                { label: "Section Structure", desc: "Required sections and proper ordering" },
                { label: "Length & Density", desc: "Optimal length for your experience level" },
                { label: "Skills Match", desc: "Alignment with top job descriptions" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-lime-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ResultView result={result} onReset={() => setResult(null)} />
      )}
    </div>
  );
}

function ResultView({ result, onReset }: { result: ResumeResult; onReset: () => void }) {
  const scoreColor = (s: number) =>
    s >= 80 ? "text-lime-400" : s >= 60 ? "text-amber-400" : "text-red-400";
  const barColor = (s: number) =>
    s >= 80 ? "bg-lime-400" : s >= 60 ? "bg-amber-400" : "bg-red-400";

  const scores = [
    { label: "Keyword Match", value: result.keyword_score },
    { label: "Format & Structure", value: result.format_score },
    { label: "Impact Language", value: result.impact_score },
    { label: "Length", value: result.length_score },
  ];

  return (
    <div className="space-y-5">
      {/* ATS score hero */}
      <div className="rounded-2xl border border-border bg-card/40 p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">ATS Score</p>
        <div className={`mt-2 text-7xl font-medium tabular-nums tracking-tight ${scoreColor(result.ats_score)}`}>
          {result.ats_score}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">/100</p>
        <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">{result.summary}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Score breakdown */}
        <div className="rounded-2xl border border-border bg-card/40 p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">Score Breakdown</h3>
          <div className="space-y-4">
            {scores.map((s) => (
              <div key={s.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-foreground">{s.label}</span>
                  <span className={`tabular-nums font-medium ${scoreColor(s.value)}`}>{s.value}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary/60">
                  <div className={`h-full rounded-full transition-all ${barColor(s.value)}`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div className="rounded-2xl border border-border bg-card/40 p-5 space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Found Keywords</h3>
            <div className="flex flex-wrap gap-1.5">
              {result.found_keywords.map((k) => (
                <span key={k} className="rounded-md border border-lime-400/20 bg-lime-400/10 px-2 py-0.5 text-xs text-lime-400">{k}</span>
              ))}
            </div>
          </div>
          {result.missing_keywords.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium text-foreground">Missing Keywords</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.missing_keywords.map((k) => (
                  <span key={k} className="rounded-md border border-red-400/20 bg-red-400/10 px-2 py-0.5 text-xs text-red-400">{k}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="rounded-2xl border border-border bg-card/40 p-5 lg:col-span-2">
          <h3 className="mb-3 text-sm font-medium text-foreground">Recommendations</h3>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <ChevronRight className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onReset}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Analyze another resume
      </button>
    </div>
  );
}
