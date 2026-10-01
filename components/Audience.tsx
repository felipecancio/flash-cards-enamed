import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";

export function Audience() {
  return (
    <Section id="para-quem" labelledBy="titulo-publico" tone="paper">
      <SectionHeading id="titulo-publico" title={site.audience.title} />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <article className="surface-card min-w-0 p-6 text-center">
          <h3 className="text-lg font-semibold text-navy">{site.audience.studentsTitle}</h3>
          <p className="mt-3 text-base leading-7 text-muted">{site.audience.studentsText}</p>
        </article>
        <article className="surface-card min-w-0 p-6 text-center">
          <h3 className="text-lg font-semibold text-navy">{site.audience.doctorsTitle}</h3>
          <p className="mt-3 text-base leading-7 text-muted">{site.audience.doctorsText}</p>
        </article>
      </div>
      <div className="surface-card mx-auto mt-4 max-w-3xl p-6 text-center">
        <p className="text-base leading-7 text-ink">{site.audience.value}</p>
      </div>
    </Section>
  );
}
