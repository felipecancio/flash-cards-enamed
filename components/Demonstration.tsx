import { ResolutionView } from "@/components/ResolutionView";
import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";
import { isSamplePublishable } from "@/lib/publication";

export function Demonstration() {
  const sample = isSamplePublishable(site.clinicalSample) ? site.clinicalSample : null;
  const answer = sample?.answerLetter.trim().toUpperCase();
  const incorrect = sample
    ? sample.incorrect.filter(
        (item) => item.letter.trim().toUpperCase() !== answer && item.explanation.trim().length > 0,
      )
    : [];

  return (
    <Section id="material" labelledBy="titulo-material">
      <SectionHeading id="titulo-material" title={site.material.title}>
        <p>{site.material.intro}</p>
      </SectionHeading>

      {sample ? (
        <ResolutionView
          title="Amostra do material"
          area={sample.area}
          stem={sample.stem}
          alternatives={sample.alternatives}
          answer={`Resposta: letra ${sample.answerLetter.trim().toUpperCase()}`}
          reasoning={sample.reasoning}
          incorrect={incorrect}
          footer={`Comentário revisado para esta página por ${sample.approvedBy}.`}
        />
      ) : (
        <dl className="mx-auto mt-10 max-w-2xl divide-y divide-line border-y border-line text-center">
          {site.anatomy.map((part) => (
            <div key={part.title} className="py-6">
              <dt className="font-semibold text-navy">{part.title}</dt>
              <dd className="mt-2 text-base leading-7 text-pretty text-muted">{part.text}</dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  );
}
