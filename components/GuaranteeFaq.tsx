import { FaqList } from "@/components/FaqList";
import { Shell } from "@/components/Section";
import { getFaq, site } from "@/config/site";
import { getSupportEmail } from "@/lib/publication";

export function GuaranteeFaq() {
  const email = getSupportEmail();
  const items = getFaq(email);

  return (
    <section
      id="duvidas"
      aria-label="Garantia e dúvidas frequentes"
      className="scroll-mt-28 bg-white lg:scroll-mt-20"
    >
      <Shell className="py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-line bg-white p-6 text-center shadow-[0_18px_40px_-32px_rgba(8,22,38,0.55)] sm:p-10">
          <div className="flex flex-col items-center gap-5">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-green text-white" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
                <path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Zm-1.1 13.4-3.3-3.3 1.4-1.4 1.9 1.9 4.1-4.1 1.4 1.4-5.5 5.5Z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="inline-flex rounded-full bg-green-soft px-3 py-1 text-xs font-semibold tracking-wide text-green uppercase">
                {site.guarantee.badge}
              </p>
              <h2
                id="titulo-garantia"
                className="mt-3 font-serif text-[1.75rem] leading-tight tracking-tight text-balance text-navy sm:text-4xl"
              >
                {site.guarantee.title}
              </h2>
            </div>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-pretty text-ink sm:text-lg">{site.guarantee.body}</p>
          {email ? (
            <p className="mt-4 text-base leading-7 text-ink">
              Para solicitar, escreva para{" "}
              <a href={`mailto:${email}`} className="font-semibold break-words text-green underline underline-offset-4">
                {email}
              </a>
              .
            </p>
          ) : null}
        </div>
        <div className="mx-auto mt-14 max-w-3xl">
          <h2 id="titulo-faq" className="text-center font-serif text-[1.75rem] leading-tight tracking-tight text-navy sm:text-4xl">
            {site.faqTitle}
          </h2>
          <div className="mt-6">
            <FaqList items={items} />
          </div>
        </div>
      </Shell>
    </section>
  );
}
