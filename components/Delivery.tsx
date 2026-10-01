import { Section, SectionHeading } from "@/components/Section";
import { getDeliveryLead, getDeliverySteps, site } from "@/config/site";
import { getSupportEmail } from "@/lib/publication";

export function Delivery() {
  const email = getSupportEmail();
  const steps = getDeliverySteps();

  return (
    <Section id="entrega" labelledBy="titulo-entrega" tone="paper">
      <SectionHeading id="titulo-entrega" title={site.delivery.title}>
        <p>{getDeliveryLead()}</p>
      </SectionHeading>
      <ol className="mx-auto mt-8 max-w-xl list-none space-y-4 text-left">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-4">
            <span aria-hidden className="font-serif text-2xl leading-none text-green">
              {index + 1}
            </span>
            <p className="min-w-0 pt-1 text-base leading-7 text-ink">{step}</p>
          </li>
        ))}
      </ol>
      {email ? (
        <p className="mt-8 max-w-3xl text-base leading-7 text-muted">
          Qualquer dúvida sobre o acesso, escreva para{" "}
          <a href={`mailto:${email}`} className="font-semibold break-words text-green underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      ) : null}
    </Section>
  );
}
