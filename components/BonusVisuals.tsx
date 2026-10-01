import type { ReactNode } from "react";

function Frame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#f6f8fa]" role="img" aria-label={label}>
      <div className="flex h-56 items-center justify-center p-4 sm:h-60" aria-hidden>
        {children}
      </div>
    </div>
  );
}

export function SimuladoVisual() {
  return (
    <Frame label="Esquema do mini-simulado: uma questão com alternativas e o resultado ao final. Não é um caso clínico.">
      <div className="grid w-full max-w-[16rem] gap-2">
        <div className="rounded-xl border border-line bg-white px-3 py-2.5">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-green uppercase">Questão 4 de 40</p>
          <p className="mt-1 text-xs font-semibold text-navy">Enunciado do caso</p>
          <div className="mt-2 space-y-1">
            <div className="h-1.5 rounded-full bg-[#e1e7ee]" />
            <div className="h-1.5 w-4/5 rounded-full bg-[#e1e7ee]" />
          </div>
        </div>
        <ul className="grid grid-cols-4 gap-1.5">
          {["A", "B", "C", "D"].map((letter) => (
            <li
              key={letter}
              className={`grid h-8 place-items-center rounded-lg border text-xs font-semibold ${
                letter === "C" ? "border-navy bg-navy text-white" : "border-line bg-white text-navy"
              }`}
            >
              {letter}
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-line bg-white px-3 py-2">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">Resultado</p>
          <p className="font-serif text-xl leading-none text-navy">12 de 40</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e1e7ee]">
            <div className="h-full w-[30%] bg-green" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function FlashcardVisual() {
  return (
    <Frame label="Cartão quadrado de revisão: a situação na frente e o convite para virar e ver a conduta.">
      <div className="relative aspect-square w-40 rounded-[1.35rem] border-2 border-card-face-line bg-card-face px-4 py-4 shadow-[0_10px_24px_-16px_rgba(12,35,64,0.65)]">
        <span className="absolute top-3 right-3 h-3 w-3 rounded-full border border-card-face-line bg-white" />
        <p className="text-[10px] font-semibold tracking-[0.16em] text-navy uppercase">Flashcard</p>
        <p className="mt-4 text-center font-serif text-lg leading-tight text-navy">Pense na conduta</p>
        <div className="mx-auto mt-3 w-4/5 space-y-1.5">
          <div className="h-1.5 rounded-full bg-white" />
          <div className="mx-auto h-1.5 w-3/4 rounded-full bg-white" />
        </div>
        <p className="absolute right-0 bottom-3 left-0 text-center text-[10px] font-semibold tracking-wide text-navy/70 uppercase">
          Vire o cartão
        </p>
      </div>
    </Frame>
  );
}

export function MobileReadingVisual() {
  return (
    <Frame label="Esquema de leitura do material no celular: questão, resolução e regra. Não é uma captura do arquivo.">
      <div className="w-[9.5rem] rounded-[1.4rem] border border-[#c5d0dc] bg-navy p-1.5">
        <div className="overflow-hidden rounded-[1rem] bg-[#f7f8fa]">
          <div className="flex items-center justify-between border-b border-line bg-white px-2.5 py-1.5">
            <p className="text-[9px] font-semibold tracking-[0.12em] text-navy uppercase">200 Casos</p>
            <p className="text-[9px] text-muted">PDF</p>
          </div>
          <div className="space-y-2 px-2.5 py-2.5">
            <p className="text-[9px] font-semibold tracking-[0.12em] text-green uppercase">Questão</p>
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-[#e1e7ee]" />
              <div className="h-1.5 w-4/5 rounded-full bg-[#e1e7ee]" />
            </div>
            <p className="text-[9px] font-semibold tracking-[0.12em] text-green uppercase">Resolução</p>
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-[#e1e7ee]" />
              <div className="h-1.5 w-2/3 rounded-full bg-[#e1e7ee]" />
            </div>
            <div className="rounded-lg bg-white px-2 py-1.5">
              <p className="text-[9px] font-semibold text-navy">Regra</p>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
