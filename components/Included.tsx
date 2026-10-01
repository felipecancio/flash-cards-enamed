import { Section, SectionHeading } from "@/components/Section";
import { site } from "@/config/site";
import { getIncludedItems } from "@/lib/publication";

export function Included() {
  const items = getIncludedItems();

  return (
    <Section id="conteudo" labelledBy="titulo-conteudo" tone="paper">
      <SectionHeading id="titulo-conteudo" title="O que você leva para a prova">
        <p>Decisão, raciocínio e uma regra para revisar. É o que fica depois de cada caso.</p>
      </SectionHeading>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => (
          <li key={item.id} className="surface-card min-w-0 p-6 text-center">
            <p className="font-serif text-sm text-green">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 text-lg font-semibold text-navy">{item.title}</h3>
            <p className="mt-2 text-base leading-7 text-muted">{item.description}</p>
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-10 max-w-3xl">
        <h3 className="text-center text-lg font-semibold text-navy">Onde você treina a decisão</h3>
        <p className="mt-2 text-center text-base leading-7 text-pretty text-muted">{site.areasNote}</p>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {site.areas.map((area) => (
            <li key={area.name} className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-4 py-3">
              <p className="font-serif text-2xl text-navy">{area.cases}</p>
              <div className="min-w-0">
                <p className="text-base leading-6 text-ink">
                  <span className="font-semibold">{area.name}.</span>{" "}
                  <span className="text-muted">{area.detail}</span>
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#e1e7ee]" aria-hidden>
                  <div className="h-full bg-navy" style={{ width: `${(area.cases / 40) * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
