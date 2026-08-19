import { StatusCard, ThemeToggle } from "@cfta/ui";

export default function Home() {
  return (
    <>
      {/* Responsive header: stacks on mobile, row on sm+ */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 border-b border-border">
        <span className="font-heading text-lg font-bold text-text-primary">
          CFTA
        </span>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center gap-8 p-6 sm:p-12">
        <div className="text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary">
            CFTA
          </h1>
          <p className="font-body text-text-secondary mt-2 text-sm sm:text-base">
            Crypto Flow &amp; Fraud Analytics — Phase 1 wiring check
          </p>
        </div>

        {/* Mobile-first grid: 1 col on phones, 3 cols from sm breakpoint up */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <StatusCard label="Workspace" value="Linked" />
          <StatusCard label="Theme" value="Dark / Light" />
          <StatusCard label="Database" value="Prisma 7 Ready" />
        </div>
      </main>
    </>
  );
}