import { StatusCard } from "@cfta/ui";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 p-12">
      <div className="text-center">
        <h1 className="font-heading text-5xl font-bold text-text-primary">
          CFTA
        </h1>
        <p className="font-body text-text-secondary mt-2">
          Crypto Flow &amp; Fraud Analytics — Phase 1 wiring check
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        <StatusCard label="Workspace" value="Linked" />
        <StatusCard label="Theme" value="Anthropic Dark" />
        <StatusCard label="Database" value="Prisma 7 Ready" />
      </div>
    </main>
  );
}