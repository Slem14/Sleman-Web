"use client";

import { useEffect, useState } from "react";

/**
 * "Welcome" cycling through the languages of the people we serve — the brand
 * introduces itself in yours. Screen readers get one stable label (no spam);
 * users with reduced-motion get a static greeting.
 */
const GREETINGS: ReadonlyArray<{ text: string; dir: "ltr" | "rtl"; lang: string }> = [
  { text: "Welcome", dir: "ltr", lang: "en" },
  { text: "خوش آمدید", dir: "rtl", lang: "prs" },
  { text: "Willkommen", dir: "ltr", lang: "de" },
  { text: "أهلاً وسهلاً", dir: "rtl", lang: "ar" },
  { text: "Hoş geldiniz", dir: "ltr", lang: "tr" },
  { text: "Ласкаво просимо", dir: "ltr", lang: "uk" },
  { text: "Добро пожаловать", dir: "ltr", lang: "ru" },
  { text: "ښه راغلاست", dir: "rtl", lang: "ps" },
  { text: "Bi xêr hatî", dir: "ltr", lang: "ku" },
  { text: "እንኳዕ ደሓን መጻእኩም", dir: "ltr", lang: "ti" },
];

const INTERVAL_MS = 2200;

export function LiveGreeting() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % GREETINGS.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const g = GREETINGS[index] ?? GREETINGS[0]!;

  return (
    <h1 aria-label="Welcome Deutschland — choose your language" className="text-center">
      <span
        aria-hidden="true"
        className="block h-[1.3em] text-4xl sm:text-5xl font-bold text-ink overflow-hidden"
      >
        <span key={g.text} lang={g.lang} dir={g.dir} className="greeting-in inline-block">
          {g.text}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="mt-3 block font-mono text-sm font-bold uppercase tracking-[0.35em] text-primary"
      >
        Welcome Deutschland
      </span>
    </h1>
  );
}
