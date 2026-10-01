import type { ClinicalAlternative, ClinicalNote } from "@/config/site";

export function ResolutionView({
  demo,
  title,
  area,
  stem,
  alternatives,
  answer,
  reasoning,
  incorrect,
  footer,
  banner,
}: {
  demo?: boolean;
  title: string;
  area: string;
  stem: string;
  alternatives: ClinicalAlternative[];
  answer: string;
  reasoning: string;
  incorrect: ClinicalNote[];
  footer: string;
  banner?: string;
}) {
  return (
    <article className="mt-8 max-w-3xl overflow-hidden rounded-3xl border border-line bg-white shadow-[0_16px_40px_-32px_rgba(12,35,64,0.45)]">
      {demo && banner ? (
        <p className="bg-navy px-5 py-3 text-sm font-semibold leading-6 text-white sm:px-8">{banner}</p>
      ) : null}
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-green uppercase">{area}</p>
        <h3 className="mt-2 font-serif text-2xl tracking-tight text-navy">{title}</h3>
        <div className="mt-6">
          <h4 className="text-sm font-semibold tracking-[0.12em] text-navy uppercase">Caso</h4>
          <p className="mt-2 text-base leading-7 whitespace-pre-line text-ink">{stem}</p>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold tracking-[0.12em] text-navy uppercase">Alternativas</h4>
          <ul className="mt-3 space-y-3">
            {alternatives.map((item) => (
              <li key={item.letter} className="flex gap-3 text-base leading-7 text-ink">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper text-sm font-semibold text-navy">
                  {item.letter}
                </span>
                <span className="min-w-0">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold tracking-[0.12em] text-navy uppercase">Resposta</h4>
          <p className="mt-2 inline-flex rounded-full bg-green-soft px-3 py-1 text-sm font-semibold text-green">
            {answer}
          </p>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold tracking-[0.12em] text-navy uppercase">Raciocínio</h4>
          <p className="mt-2 text-base leading-7 whitespace-pre-line text-ink">{reasoning}</p>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-semibold tracking-[0.12em] text-navy uppercase">Demais alternativas</h4>
          <ul className="mt-3 space-y-4">
            {incorrect.map((item) => (
              <li key={item.letter}>
                <p className="font-semibold text-navy">Alternativa {item.letter}</p>
                <p className="mt-1 text-base leading-7 text-muted">{item.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-5 py-4 text-sm leading-6 text-muted sm:px-8">{footer}</p>
    </article>
  );
}
