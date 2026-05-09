import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-lime-400 text-neutral-950">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm9.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" />
              </svg>
            </div>
            <span className="text-[15px] font-medium tracking-tight text-foreground">
              Interview<span className="text-lime-400">Verse</span>
            </span>
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Privacy Policy →
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-medium tracking-tight text-foreground">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: May 9, 2025</p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-muted-foreground">
          <Section title="1. Acceptance of Terms">
            By accessing or using InterviewVerse, you agree to be bound by these Terms of Service and our Privacy Policy.
            If you do not agree to these terms, please do not use the platform.
          </Section>

          <Section title="2. Description of Service">
            InterviewVerse provides an AI-powered interview practice platform including mock technical interviews,
            behavioral interview simulations, coding challenges, resume analysis, and performance analytics.
            The service uses large language models to generate questions and evaluate responses.
          </Section>

          <Section title="3. User Accounts">
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>You must be at least 13 years old to create an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You agree to provide accurate and complete information during registration.</li>
              <li>You may not share your account with others or create multiple accounts.</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            You agree not to:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>Use the platform for any unlawful purpose.</li>
              <li>Attempt to reverse engineer or extract our AI models or proprietary technology.</li>
              <li>Use automated tools to scrape or abuse the platform.</li>
              <li>Share, sell, or distribute platform content without written permission.</li>
              <li>Upload malicious content or attempt to compromise platform security.</li>
            </ul>
          </Section>

          <Section title="5. AI-Generated Content">
            InterviewVerse uses AI to generate interview questions and provide feedback. This content is:
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>For educational and practice purposes only.</li>
              <li>Not guaranteed to reflect questions asked by any specific company.</li>
              <li>Not a substitute for professional career coaching or advice.</li>
              <li>Generated using third-party AI services (Anthropic Claude).</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            InterviewVerse and its original content, features, and functionality are owned by InterviewVerse and protected
            by international copyright and trademark laws. You retain ownership of any content you upload to the platform.
            By uploading content, you grant us a limited license to process it to provide the service.
          </Section>

          <Section title="7. Free & Paid Plans">
            We offer both free and paid subscription tiers. Free plan usage is subject to rate limits.
            Paid subscriptions are billed monthly or annually and can be cancelled at any time. Refunds
            are provided within 7 days of purchase for first-time subscribers.
          </Section>

          <Section title="8. Disclaimers">
            The platform is provided &quot;as is&quot; without warranties of any kind. We do not guarantee job placement
            or interview success. AI feedback is an approximation and may not perfectly predict real interview outcomes.
          </Section>

          <Section title="9. Limitation of Liability">
            To the maximum extent permitted by law, InterviewVerse shall not be liable for any indirect,
            incidental, special, or consequential damages resulting from your use of the platform.
          </Section>

          <Section title="10. Changes to Terms">
            We may update these terms at any time. Continued use of the platform after changes constitutes
            acceptance of the new terms. We will notify users of material changes via email.
          </Section>

          <Section title="11. Contact">
            For questions about these terms, contact us at:{" "}
            <a href="mailto:legal@interviewverse.io" className="text-primary hover:underline">
              legal@interviewverse.io
            </a>
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
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}
