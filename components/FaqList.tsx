"use client";

import { useId, useState } from "react";

export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        const open = openIndex === index;

        return (
          <div key={item.question}>
            <h3 className="text-base font-semibold text-ink">
              <button
                id={buttonId}
                type="button"
                data-faq-trigger
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                onKeyDown={(event) => {
                  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
                  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-faq-trigger]"));
                  const current = buttons.indexOf(event.currentTarget);
                  let next = current;
                  if (event.key === "ArrowDown") next = current + 1;
                  if (event.key === "ArrowUp") next = current - 1;
                  if (event.key === "Home") next = 0;
                  if (event.key === "End") next = buttons.length - 1;
                  if (!buttons[next]) return;
                  event.preventDefault();
                  buttons[next]?.focus();
                }}
              >
                <span className="min-w-0">{item.question}</span>
                <span aria-hidden className="w-6 shrink-0 text-center font-serif text-2xl leading-none text-green">
                  {open ? "–" : "+"}
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open} className="pr-8 pb-4">
              <p className="text-base leading-7 text-pretty text-muted">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
