import { CheckoutButton } from "@/components/CheckoutButton";
import { PriceTag } from "@/components/PriceTag";
import { ProductShot } from "@/components/ProductShot";
import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";
import { getIncludedItems } from "@/lib/publication";

export function Offer({ href, label }: { href: string | null; label: string }) {
  const items = getIncludedItems();

  return (
    <Section id="oferta" labelledBy="titulo-oferta" tone="navy">
      <div className="mx-auto flex max-w-3xl flex-col items-center">
        <SectionHeading id="titulo-oferta" title={site.offer.title} tone="dark">
          <p>{site.offer.intro}</p>
        </SectionHeading>

        <div className="mt-10 w-full rounded-[1.75rem] bg-white px-5 py-6 text-navy shadow-[0_24px_50px_-28px_rgba(0,0,0,0.55)] sm:px-8 sm:py-8">
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 text-sm leading-6 text-ink sm:text-base">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                <span>
                  <span className="font-semibold text-navy">{item.title}.</span> {item.description}
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-6 space-y-3 border-t border-line pt-6">
            {site.studyBonuses.items.map((item, index) => (
              <li key={item.id} className="text-sm leading-6 font-bold text-navy sm:text-base">
                Bônus {index + 1}: {item.title}. {item.lead}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line pt-8 text-center">
            <p className="font-serif text-2xl leading-tight tracking-tight text-balance text-navy sm:text-3xl">
              200 Motivos para sua Aprovação e Sucesso!
            </p>
            <ProductShot className="mt-6" />
            <div className="mt-6">
              <PriceTag />
            </div>
            <div className="mx-auto mt-8 max-w-sm">
              <CheckoutButton href={href} label={label} fullWidth />
            </div>
            <p className="mt-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-navy">
              <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-green">
                <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Zm-1 14-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6Z" />
              </svg>
              {site.offer.trustLine}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
