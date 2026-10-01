import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";

export function HowToStudy() {
  return (
    <Section id="metodo" labelledBy="titulo-metodo">
      <SectionHeading id="titulo-metodo" title={site.method.title}>
        <p>{site.method.intro}</p>
      </SectionHeading>
      <ol className="mt-10 grid list-none gap-8 sm:grid-cols-2">
        {site.method.steps.map((step, index) => {
          const text =
            step.id === "record" && site.bonuses.errorNotebook.ready
              ? `${step.text} ${site.method.errorNotebookNote}`
              : step.text;

          return (
            <li key={step.id} className="surface-card flex min-w-0 flex-col items-center p-5 text-center">
              <span aria-hidden className="font-serif text-4xl leading-none text-green">
                {index + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-navy">{step.title}</h3>
              <p className="mt-2 text-base leading-7 text-pretty text-muted">{text}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
