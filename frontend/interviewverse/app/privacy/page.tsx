import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-400 text-neutral-950">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H9V2zM2 9h5v5H2V9zm9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
              </svg>
            </div>
            <span className="text-[15px] font-medium tracking-tight text-foreground">
              Interview<span className="text-lime-400">Verse</span>
            </span>
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Terms of Service →
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: May 9, 2025</p>
        </div>

        <div className="space-y-8 text-muted-foreground">
          <Section title="1. Information We Collect">
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-foreground">Account data:</strong> Name, email address, and password (hashed).</li>
              <li><strong className="text-foreground">Interview data:</strong> Code submissions, transcripts, and session recordings.</li>
              <li><strong className="text-foreground">Resume data:</strong> Resume text or files you submit for analysis.</li>
              <li><strong className="text-foreground">Usage data:</strong> Pages visited, features used, and performance metrics.</li>
              <li><strong className="text-foreground">Device data:</strong> Browser type, IP address, and operating system.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
              <li>To provide, maintain, and improve the InterviewVerse service.</li>
              <li>To generate personalized AI feedback and recommendations.</li>
              <li>To analyze usage patterns and improve platform performance.</li>
              <li>To send service-related notifications and (with consent) marketing emails.</li>
              <li>To detect and prevent fraud or security incidents.</li>
            </ul>
          </Section>

          <Section title="3. AI Processing">
            <p className="text-sm leading-relaxed">
              Your interview transcripts and resume content are processed by Anthropic&apos;s Claude AI. This data
              is sent to Anthropic&apos;s API to generate feedback. Anthropic&apos;s privacy policy governs their
              processing of this data. We do not sell your data to train AI models.
            </p>
          </Section>

          <Section title="4. Data Sharing">
            <p className="text-sm leading-relaxed">We do not sell your personal information. We may share data with:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-foreground">Service providers:</strong> Hosting (Render, Vercel), AI (Anthropic) — under strict data processing agreements.</li>
              <li><strong className="text-foreground">Legal requirements:</strong> If required by law or to protect our rights.</li>
              <li><strong className="text-foreground">Business transfers:</strong> In connection with a merger or acquisition (with notice).</li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <p className="text-sm leading-relaxed">
              We retain your account data as long as your account is active. Session transcripts and code submissions
              are retained for 12 months. You may request deletion of your data at any time by emailing us.
            </p>
          </Section>

          <Section title="6. Your Rights">
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
              <li><strong className="text-foreground">Access:</strong> Request a copy of your personal data.</li>
              <li><strong className="text-foreground">Correction:</strong> Update inaccurate or incomplete data.</li>
              <li><strong className="text-foreground">Deletion:</strong> Request deletion of your account and data.</li>
              <li><strong className="text-foreground">Portability:</strong> Export your session history and results.</li>
              <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications at any time.</li>
            </ul>
          </Section>

          <Section title="7. Security">
            <p className="text-sm leading-relaxed">
              We implement industry-standard security measures including HTTPS encryption, hashed passwords,
              and access controls. However, no method of transmission over the internet is 100% secure.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p className="text-sm leading-relaxed">
              We use only essential cookies for authentication (JWT tokens stored in localStorage).
              We do not use tracking or advertising cookies.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p className="text-sm leading-relaxed">
              InterviewVerse is not directed to children under 13. We do not knowingly collect personal
              information from children under 13. If you believe a child has provided us with their information,
              please contact us immediately.
            </p>
          </Section>

          <Section title="10. Contact">
            <p className="text-sm leading-relaxed">
              For privacy inquiries or data requests:{" "}
              <a href="mailto:privacy@interviewverse.io" className="text-primary hover:underline">
                privacy@interviewverse.io
              </a>
            </p>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-base font-medium text-foreground">{title}</h2>
      {children}
    </section>
  );
}
