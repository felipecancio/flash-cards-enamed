import { Shell } from "@/components/Section";
import { site } from "@/config/site";
import Link from "next/link";

export function LegalDocument({
  title,
  paragraphs,
  published,
}: {
  title: string;
  paragraphs: string[];
  published: boolean;
}) {
  return (
    <>
      <header className="border-b border-line">
        <Shell className="flex items-center justify-between gap-4 py-4">
          <p className="font-serif text-lg text-navy">{site.shortName}</p>
          <Link href="/" className="text-sm font-semibold text-navy underline-offset-4 hover:underline">
            Voltar ao material
          </Link>
        </Shell>
      </header>
      <main id="conteudo-principal" className="py-12">
        <Shell>
          <h1 className="max-w-3xl font-serif text-4xl tracking-tight text-balance text-navy">{title}</h1>
          {published ? (
            <div className="mt-8 max-w-3xl space-y-4 text-base leading-7 text-ink">
              {paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted">
              Este texto ainda não foi publicado. O link só entra no rodapé da página de venda quando o conteúdo
              estiver pronto na configuração.
            </p>
          )}
        </Shell>
      </main>
    </>
  );
}
