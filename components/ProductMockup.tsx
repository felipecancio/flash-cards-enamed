import { site, type ClinicalSample } from "@/config/site";

export function ProductMockup({ sample }: { sample: ClinicalSample | null }) {
  const preview = site.notebookPreview;
  const live = sample !== null;

  return (
    <figure className="mx-auto w-full min-w-0 max-w-[22rem] lg:mx-0 lg:max-w-[26rem] lg:justify-self-end">
      <div className="relative lg:pr-3">
        <div
          aria-hidden
          className="absolute top-5 right-0 hidden h-[88%] w-[94%] rounded-[1.6rem] bg-[#e4ebf2] lg:block"
        />
        <div className="relative rounded-[1.7rem] border border-[#c5d0dc] bg-navy p-2 shadow-[0_22px_44px_-28px_rgba(8,22,38,0.85)] sm:p-2.5">
          <div aria-hidden className="mx-auto mb-2 h-1.5 w-1.5 rounded-full bg-white/40" />
          <div className="overflow-hidden rounded-[1.15rem] bg-[#f7f8fa] text-navy">
            <div className="flex items-center justify-between border-b border-line bg-white px-4 py-2.5">
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase">{site.shortName}</p>
              <p className="text-[10px] text-muted">PDF</p>
            </div>
            <div className="space-y-2.5 px-4 py-3.5">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-green uppercase">
                {live ? sample.area : preview.kicker}
              </p>
              <p className="font-serif text-lg leading-tight">{live ? "Caso" : preview.hook}</p>
              {live ? (
                <p className="line-clamp-4 text-[12px] leading-5 text-ink">{sample.stem}</p>
              ) : (
                <p className="text-[12px] leading-5 text-ink">{preview.theme}</p>
              )}
              <ul className="space-y-1.5 pt-1">
                {(live ? sample.alternatives : preview.alternatives).slice(0, 4).map((item) => (
                  <li key={item.letter} className="flex min-w-0 items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-semibold shadow-[inset_0_0_0_1px_#d9e0e8]">
                      {item.letter}
                    </span>
                    <span className="line-clamp-2 min-w-0 text-[11px] leading-4 text-ink">{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-white px-3 py-2.5 shadow-[inset_0_0_0_1px_#e1e7ee]">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-green uppercase">
                  {live ? "Resolução" : "Regra para a prova"}
                </p>
                <p className="mt-1 line-clamp-3 text-[12px] leading-5 text-ink">
                  {live
                    ? `Resposta ${sample.answerLetter}. ${sample.reasoning}`
                    : `Gabarito ${preview.answerLetter}. ${preview.rule}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center text-sm leading-6 text-pretty text-muted">
        {live
          ? `Trecho de um caso aprovado para esta página por ${sample.approvedBy}.`
          : site.hero.mockupCaption}
      </figcaption>
    </figure>
  );
}
