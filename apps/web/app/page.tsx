"use client";

import { useEffect, useState } from "react";

type HealthResponse = {
  healthy: boolean;
  timestamp: string;
};

export default function Home() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [data, setData] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/health")
      .then((res) => res.json())
      .then((json: HealthResponse) => {
        setData(json);
        setStatus("ok");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-center">
      <h1 className="text-4xl font-bold text-white">
        Turborepo + pnpm + <span className="text-sky-400">Tailwind CSS</span>
      </h1>
      <p className="max-w-md text-slate-400">
        If this text is styled (dark background, blue accent, centered), Tailwind CSS is working.
      </p>

      <div className="rounded-lg border border-slate-800 bg-slate-900 px-6 py-4 text-sm">
        {status === "loading" && <p className="text-slate-400">Checking Express API…</p>}
        {status === "ok" && (
          <p className="text-emerald-400">
            ✅ Express API is reachable — healthy: {String(data?.healthy)}
          </p>
        )}
        {status === "error" && (
          <p className="text-red-400">
            ❌ Could not reach the API. Make sure it&apos;s running on port 4000.
          </p>
        )}
      </div>
    </main>
  );
}