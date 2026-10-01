import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";

export function Difficulty() {
  const [lead, ...rest] = site.difficulty.paragraphs;

  return (
    <Section id="estudo" labelledBy="titulo-estudo" tone="paper">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading id="titulo-estudo" title={site.difficulty.title} />
        <p className="mt-6 text-xl leading-8 text-pretty text-ink">{lead}</p>
        <div className="mt-4 space-y-4 text-base leading-7 text-pretty text-muted">
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </Section>
  );
}
