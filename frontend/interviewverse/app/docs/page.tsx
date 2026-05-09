import Link from "next/link";
import Navbar from "@/components/Navbar";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        title: "Quick start",
        content: `InterviewVerse runs two services locally:

**Frontend** (Next.js) on http://localhost:3000
**Backend** (FastAPI) on http://localhost:8080

**Option 1 — One-click launch (Windows):**
Double-click \`start.bat\` in the root of the project.

**Option 2 — Manual:**
\`\`\`bash
# Terminal 1 — Backend
cd backend
python -m uvicorn main:app --port 8080 --reload

# Terminal 2 — Frontend
cd frontend/interviewverse
npm run dev
\`\`\`

Then open http://localhost:3000.`,
      },
      {
        title: "Environment variables",
        content: `Create \`backend/.env\` (copy from \`backend/.env.example\`):

\`\`\`
SECRET_KEY=your-random-secret-key
ANTHROPIC_API_KEY=sk-ant-api03-...   # optional
\`\`\`

Create \`frontend/interviewverse/.env.local\`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080
\`\`\`

**SECRET_KEY** — Used to sign JWT auth tokens. Generate one with:
\`\`\`bash
python -c "import secrets; print(secrets.token_hex(32))"
\`\`\`

**ANTHROPIC_API_KEY** — Optional. If set, the AI recruiter uses Claude to generate contextual questions and feedback. If omitted, scripted responses are used (still functional).

Get a key at https://console.anthropic.com`,
      },
    ],
  },
  {
    id: "api",
    title: "API Reference",
    items: [
      {
        title: "Authentication",
        content: `**POST /api/auth/signup**
\`\`\`json
{ "name": "string", "email": "string", "password": "string" }
\`\`\`
Returns: \`{ access_token, token_type, user }\`

**POST /api/auth/login**
\`\`\`json
{ "email": "string", "password": "string" }
\`\`\`
Returns: \`{ access_token, token_type, user }\`

Pass the token as: \`Authorization: Bearer <token>\``,
      },
      {
        title: "Interviews",
        content: `**POST /api/interviews**
Create a new session.
\`\`\`json
{
  "problem_id": "two-sum",        // optional
  "difficulty": "Medium",          // Easy | Medium | Hard
  "interview_type": "Coding"       // Coding | System Design | Behavioral
}
\`\`\`

**POST /api/interviews/{id}/submit-code**
Run code against test cases.
\`\`\`json
{ "code": "def twoSum(...): ...", "language": "python" }
\`\`\`

**POST /api/interviews/{id}/hint**
Get an AI hint.
\`\`\`json
{ "code": "...", "question": "How do I optimize this?" }
\`\`\`

**POST /api/interviews/{id}/end**
End session and generate results.
\`\`\`json
{ "code": "...", "transcript": [...], "duration_seconds": 900 }
\`\`\``,
      },
      {
        title: "Results & Dashboard",
        content: `**GET /api/results/{session_id}**
Returns full interview results including score, feedback, transcript, speech analytics, and body language.

**GET /api/dashboard**
Returns user stats: sessions count, avg score, streak, skills, and performance data.

**Interactive docs:** http://localhost:8080/docs (Swagger UI)`,
      },
      {
        title: "WebSocket",
        content: `Connect to: \`ws://localhost:8080/ws/{session_id}\`

**Messages you send:**
\`\`\`json
{ "type": "transcript", "text": "I'd use a hash map here", "elapsed_seconds": 45 }
{ "type": "ping" }
{ "type": "end" }
\`\`\`

**Messages you receive:**
\`\`\`json
{ "type": "ai_message", "text": "Walk me through the intuition", "who": "ai" }
{ "type": "transcript_update", "transcript": [...] }
{ "type": "pong" }
\`\`\``,
      },
    ],
  },
  {
    id: "features",
    title: "Features",
    items: [
      {
        title: "AI Recruiter",
        content: `The AI recruiter (Sarah) conducts the interview via WebSocket. She:
- Opens with the problem statement
- Asks follow-up questions based on what you say
- Probes complexity analysis, edge cases, and alternative approaches

**With Anthropic API key:** Uses Claude claude-haiku-4-5 for contextual, adaptive questions.
**Without key:** Uses a curated question bank per problem type.`,
      },
      {
        title: "Webcam Analysis",
        content: `Real-time body language tracking using MediaPipe Face Detection running entirely in your browser:

- **Eye contact %** — Is your face centered and looking forward?
- **Posture** — Head tilt and stability
- **Energy level** — Movement and engagement indicators

No video is sent to any server. All analysis runs locally via WebAssembly.`,
      },
      {
        title: "Code Execution",
        content: `Python code is executed server-side in a subprocess with:
- 5-second timeout (prevents infinite loops)
- Test case validation (expected vs actual output)
- Execution time measurement per test case

Currently supported: **Python**, **JavaScript** (mock), **TypeScript** (mock).
Full JS/TS execution requires a Node.js sandbox — coming soon.`,
      },
      {
        title: "Resume ATS",
        content: `POST /api/resume/analyze with your resume as plain text.

Scoring breakdown:
- **Keywords (40%)** — Technical skills, frameworks, tools matched
- **Format (25%)** — Sections, contact info, structure
- **Length (15%)** — 400–800 words is optimal
- **Impact (20%)** — Action verbs + quantified results

Returns an ATS score 0–100 with matched keywords, missing keywords, and suggestions.`,
      },
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    items: [
      {
        title: "Free tier deployment",
        content: `**Frontend → Vercel (free)**
1. Push to GitHub (already done)
2. Go to vercel.com → New Project → Import your repo
3. Set root directory: \`frontend/interviewverse\`
4. Add env var: \`NEXT_PUBLIC_API_URL=https://your-backend.onrender.com\`
5. Deploy — Vercel auto-deploys on every push to main

**Backend → Render (free)**
1. Go to render.com → New Web Service
2. Connect your GitHub repo
3. Root directory: \`backend\`
4. Build command: \`pip install -r requirements.txt\`
5. Start command: \`uvicorn main:app --host 0.0.0.0 --port $PORT\`
6. Add env vars: \`SECRET_KEY\`, \`ANTHROPIC_API_KEY\`

> Note: Render free tier spins down after 15 min of inactivity. First request takes ~30s to wake up. Upgrade to $7/mo Starter to keep it always-on.`,
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-24 lg:flex lg:gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-28 space-y-6">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Contents
            </div>
            {sections.map((s) => (
              <div key={s.id}>
                <a href={`#${s.id}`} className="text-sm font-medium text-foreground hover:text-lime-400 transition-colors">
                  {s.title}
                </a>
                <ul className="mt-2 space-y-1">
                  {s.items.map((item) => (
                    <li key={item.title}>
                      <a href={`#${s.id}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="mb-10">
            <h1 className="text-3xl font-medium text-foreground">Documentation</h1>
            <p className="mt-2 text-muted-foreground">
              Everything you need to run, configure, and extend InterviewVerse.
            </p>
          </div>

          <div className="space-y-16">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="mb-6 text-xl font-medium text-foreground border-b border-border pb-3">
                  {section.title}
                </h2>
                <div className="space-y-8">
                  {section.items.map((item) => (
                    <div key={item.title}>
                      <h3 className="mb-3 text-base font-medium text-foreground">{item.title}</h3>
                      <div className="prose-custom text-sm text-muted-foreground leading-relaxed space-y-3">
                        {item.content.split("\n").map((line, i) => {
                          if (line.startsWith("```")) return null;
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return <p key={i} className="font-medium text-foreground">{line.replace(/\*\*/g, "")}</p>;
                          }
                          if (line.startsWith("- ")) {
                            return <p key={i} className="flex gap-2"><span className="text-lime-400 shrink-0">·</span><span>{line.slice(2).replace(/\*\*/g, "")}</span></p>;
                          }
                          if (line.trim() === "") return <div key={i} className="h-1" />;
                          if (line.startsWith("> ")) {
                            return <div key={i} className="border-l-2 border-amber-400/40 pl-3 text-amber-400/80 italic">{line.slice(2)}</div>;
                          }
                          if (/^\d+\. /.test(line)) {
                            return <p key={i}>{line}</p>;
                          }
                          // Inline code
                          const parts = line.split(/(`[^`]+`)/g);
                          return (
                            <p key={i}>
                              {parts.map((part, j) =>
                                part.startsWith("`") && part.endsWith("`")
                                  ? <code key={j} className="rounded bg-secondary/60 px-1 py-0.5 font-mono text-[11px] text-lime-400">{part.slice(1, -1)}</code>
                                  : <span key={j}>{part.replace(/\*\*/g, "")}</span>
                              )}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-lime-400/20 bg-lime-400/5 p-6">
            <h3 className="text-sm font-medium text-lime-400">Need help?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Open an issue on{" "}
              <a href="https://github.com/nikeshsapkota32/InterviewVerse" className="text-lime-400 hover:underline" target="_blank" rel="noreferrer">
                GitHub
              </a>{" "}
              or start a discussion. Pull requests are welcome.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
