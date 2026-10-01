import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";
import { getCompleteAuthors } from "@/lib/publication";

export function Authors() {
  const authors = getCompleteAuthors();
  if (authors.length === 0) return null;

  return (
    <Section id="autores" labelledBy="titulo-autores">
      <SectionHeading id="titulo-autores" title={site.authorsSection.title}>
        <p>{site.authorsSection.intro}</p>
      </SectionHeading>
      {authors.length > 0 ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {authors.map((author) => (
            <li key={`${author.crm}-${author.name}`} className="min-w-0 rounded-2xl bg-paper p-6">
              <h3 className="font-serif text-2xl break-words text-navy">{author.name}</h3>
              <p className="mt-2 text-sm font-semibold break-words text-ink">
                {author.crm} · {author.specialty}
              </p>
              <p className="mt-4 text-sm leading-6 break-words text-muted">{author.practice}</p>
              <p className="mt-4 text-sm leading-6 break-words text-ink">
                <span className="font-semibold">Contribuição neste material. </span>
                {author.contribution}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
