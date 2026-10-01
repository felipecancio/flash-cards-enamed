"use client";

import { useEffect, useState } from "react";

const SUFFIXES = [
  "pra Passar",
  "pra Estudar",
  "pra Acreditar",
  "pra Vencer",
  "pra ter Sucesso",
] as const;

const HOLD_MS = 3000;
const TYPE_MS = 55;
const DELETE_MS = 32;

export function BrandLetreiro() {
  const [suffix, setSuffix] = useState("");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setReduced(true);
      setSuffix(SUFFIXES[0]);
      return;
    }

    let index = 0;
    let length = 0;
    let phase: "typing" | "holding" | "deleting" = "typing";
    let timer = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      const full = SUFFIXES[index];

      if (phase === "typing") {
        length += 1;
        setSuffix(full.slice(0, length));
        if (length >= full.length) {
          phase = "holding";
          timer = window.setTimeout(step, HOLD_MS);
          return;
        }
        timer = window.setTimeout(step, TYPE_MS);
        return;
      }

      if (phase === "holding") phase = "deleting";

      length -= 1;
      setSuffix(full.slice(0, Math.max(0, length)));
      if (length <= 0) {
        index = (index + 1) % SUFFIXES.length;
        phase = "typing";
        timer = window.setTimeout(step, TYPE_MS);
        return;
      }
      timer = window.setTimeout(step, DELETE_MS);
    };

    timer = window.setTimeout(step, TYPE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <a
      href="#inicio"
      className="inline-flex shrink-0 items-baseline font-serif text-lg tracking-tight whitespace-nowrap text-navy sm:text-xl"
      aria-label="200 Motivos pra Passar"
    >
      <span>200 Motivos{"\u00A0"}</span>
      <span className="relative inline-block">
        <span className="invisible" aria-hidden>
          pra ter Sucesso
        </span>
        <span className="absolute inset-y-0 left-0">
          {suffix}
          {reduced ? null : <span className="brand-caret" aria-hidden />}
        </span>
      </span>
    </a>
  );
}
