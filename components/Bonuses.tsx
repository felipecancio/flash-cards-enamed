import { FlashcardVisual, MobileReadingVisual, SimuladoVisual } from "@/components/BonusVisuals";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";

const visuals = {
  simulado: SimuladoVisual,
  flashcards: FlashcardVisual,
  mobile: MobileReadingVisual,
} as const;

export function Bonuses({ href, label }: { href: string | null; label: string }) {
  return (
    <Section id="bonus" labelledBy="titulo-bonus">
      <SectionHeading id="titulo-bonus" title={site.studyBonuses.title}>
        <p>{site.studyBonuses.intro}</p>
      </SectionHeading>
      <ul className="mt-10 grid gap-5 lg:grid-cols-3">
        {site.studyBonuses.items.map((item, index) => {
          const Visual = visuals[item.id as keyof typeof visuals];
          return (
            <li key={item.id} className="surface-card flex min-w-0 flex-col p-4 sm:p-5">
              <Visual />
              <h3 className="mt-5 flex items-start justify-center gap-3 text-center font-serif text-2xl leading-tight text-navy">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-navy/10 bg-paper font-serif text-base text-navy">
                  {index + 1}
                </span>
                <span className="pt-0.5">{item.title}</span>
              </h3>
              <p className="mt-2 text-center text-base leading-7 text-pretty text-ink">{item.lead}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      <div className="mx-auto mt-8 max-w-sm">
        <CheckoutButton href={href} label={label} fullWidth />
      </div>
    </Section>
  );
}
