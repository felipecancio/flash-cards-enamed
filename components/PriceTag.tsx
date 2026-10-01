import { site } from "@/config/site";
import { formatBrl } from "@/lib/format";
import { hasVerifiedReferencePrice } from "@/lib/publication";

export function PriceTag() {
  const current = formatBrl(site.pricing.current);
  const mode = hasVerifiedReferencePrice() ? "reference" : "launch";

  if (mode === "reference") {
    const previous = formatBrl(site.pricing.reference);
    return (
      <div data-price-mode={mode} className="text-center">
        <p className="text-base font-semibold text-[#c46a6a]">
          De <span className="line-through decoration-2">{previous}</span>
        </p>
        <p className="mt-1 font-serif text-6xl leading-none tracking-tight text-navy sm:text-7xl">
          <span className="sr-only">por </span>
          {current}
        </p>
        <p className="mt-4 text-sm font-semibold text-[#c46a6a]">Oferta válida hoje no lançamento</p>
      </div>
    );
  }

  return (
    <p data-price-mode={mode} className="text-center">
      <span className="text-sm font-semibold text-muted">{site.pricing.launchLabel}</span>
      <span className="mt-2 block font-serif text-6xl leading-none tracking-tight text-navy">{current}</span>
    </p>
  );
}
