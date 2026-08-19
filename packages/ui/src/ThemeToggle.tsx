"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  // Default assumption matches the server-rendered output (no .light class = dark).
  // The blocking script in layout.tsx has already set the real class before this
  // component mounts, so we just read it back — no flash, no mismatch.
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("cfta-theme", next ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark / light theme"
      className="flex items-center gap-2 rounded-card border border-border bg-card px-3 py-2 text-xs font-mono text-text-secondary hover:text-accent hover:border-accent transition-colors"
    >
      <span className="h-2 w-2 rounded-full bg-accent" />
      {isLight ? "LIGHT" : "DARK"}
    </button>
  );
}