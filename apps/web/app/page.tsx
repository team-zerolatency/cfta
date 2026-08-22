import Link from "next/link";
import { ThemeToggle } from "@cfta/ui";

const PILLARS = [
  {
    title: "TRACK",
    body: "Enter a wallet address or tx hash. The engine recursively walks outgoing TRC-20 transfers hop by hop via the TronGrid API, rendering a live transaction graph.",
  },
  {
    title: "FLAG",
    body: "Every wallet touched is checked against a persistent risk registry — auto-tagged by rule-based heuristics, or manually tied to an FIR number by an officer.",
  },
  {
    title: "ANALYZE",
    body: "Cross-case correlation surfaces patterns: a wallet flagged in one FIR is instantly recognized if it resurfaces in a completely unrelated investigation.",
  },
];

const FEATURES = [
  {
    title: "Live Multi-Hop Tracer",
    body: "Interactive node-link graph of wallet-to-wallet fund movement, laid out automatically with dagre so dense exchange convergence never overlaps.",
  },
  {
    title: "Off-Ramp Tagging",
    body: "Auto-flags when funds land in a known exchange wallet — freeze-eligible under Section 94 BNSS.",
  },
  {
    title: "Persistent Risk Registry",
    body: "Flagged wallets stay flagged. Any future case touching one triggers an instant cross-case alert, automatically.",
  },
  {
    title: "Rule-Based Heuristics",
    body: "Detects rapid peeling and off-ramp deposits with explainable, plain-English reasons — no black-box scoring a court can't examine.",
  },
  {
    title: "One-Click Evidence Export",
    body: "Generates a structured PDF dossier: wallet list, transfer history, timestamps, and flag reasons, ready for case submission.",
  },
  {
    title: "Built for Indian Cyber-Cells",
    body: "Zero training curve, self-hostable on internal infrastructure — not a SaaS tool that never heard of an FIR number.",
  },
];

export default function LandingPage() {
  return (
    <>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-b border-border">
        <span className="font-heading text-lg font-bold text-text-primary">CFTA</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/trace"
            className="rounded-card bg-accent px-4 py-2 text-sm font-mono font-bold text-bg-page hover:opacity-90 transition-opacity"
          >
            Try Live Demo →
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="flex flex-col items-center text-center gap-6 px-4 sm:px-8 py-16 sm:py-24 max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-widest text-accent">
            CHANDIGARH POLICE HACKATHON 2026
          </p>
          <h1 className="font-heading text-5xl sm:text-7xl font-bold text-text-primary">
            CFTA
          </h1>
          <p className="font-heading text-xl sm:text-2xl italic text-text-secondary">
            Crypto Flow & Fraud Analytics
          </p>
          <p className="font-body text-text-secondary text-base sm:text-lg max-w-2xl">
            Track illicit crypto flow, flag fraudulent accounts, and analyze suspicious
            transactions — a purpose-built investigation tool for Indian cyber-cells,
            not a generic block explorer.
          </p>
          <Link
            href="/trace"
            className="mt-2 rounded-card bg-accent px-8 py-3 text-base font-mono font-bold text-bg-page hover:opacity-90 transition-opacity"
          >
            Try Live Demo →
          </Link>
        </section>

        {/* Problem */}
        <section className="px-4 sm:px-8 py-12 border-t border-border">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            <p className="font-mono text-xs tracking-widest text-accent">THE PROBLEM</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Fraud money moves in minutes. Investigations take weeks.
            </h2>
            <p className="font-body text-text-secondary max-w-3xl">
              Scam proceeds are converted to USDT and pushed through multiple wallets to
              break the trail before a cyber-cell can respond. Enterprise forensic suites
              exist, but they&apos;re expensive, complex, and built for global compliance
              teams — not district-level police units working FIR by FIR.
            </p>
          </div>
        </section>

        {/* Solution — 3 pillars */}
        <section className="px-4 sm:px-8 py-12 border-t border-border">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <p className="font-mono text-xs tracking-widest text-accent">THE APPROACH</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Three pillars, one investigation tool
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PILLARS.map((p) => (
                <div key={p.title} className="rounded-card border border-border bg-card p-5">
                  <h3 className="font-heading text-xl font-bold text-text-primary mb-2">
                    {p.title}
                  </h3>
                  <p className="font-body text-sm text-text-secondary">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key features */}
        <section className="px-4 sm:px-8 py-12 border-t border-border">
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <p className="font-mono text-xs tracking-widest text-accent">WHAT IT DOES</p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              Key features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <div key={f.title} className="rounded-card border border-border bg-card p-5">
                  <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                    {f.title}
                  </h3>
                  <p className="font-body text-sm text-text-secondary">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-8 py-16 border-t border-border text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
              See it trace a real wallet
            </h2>
            <p className="font-body text-text-secondary">
              No login, no setup — paste a Tron address and watch the graph build live.
            </p>
            <Link
              href="/trace"
              className="rounded-card bg-accent px-8 py-3 text-base font-mono font-bold text-bg-page hover:opacity-90 transition-opacity"
            >
              Try Live Demo →
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-4 sm:px-8 py-6 border-t border-border text-center">
        <p className="font-mono text-xs text-text-secondary">
          CFTA — Chandigarh Police Hackathon 2026
        </p>
      </footer>
    </>
  );
}