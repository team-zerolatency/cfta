import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CFTA — Crypto Flow & Fraud Analytics",
  description: "Chandigarh Police Hackathon 2026",
};

// Runs before React hydrates. Reads the saved preference (or falls back to
// the OS-level preference) and applies the `.light` class immediately —
// this is what prevents a flash of the wrong theme on page load.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('cfta-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    if (theme === 'light') document.documentElement.classList.add('light');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // suppressHydrationWarning: the script above mutates the class attribute
      // before React hydrates, which would otherwise trigger a false-positive
      // hydration mismatch warning on this element only.
      suppressHydrationWarning
      className={`${newsreader.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg-page text-text-primary">
        {children}
      </body>
    </html>
  );
}