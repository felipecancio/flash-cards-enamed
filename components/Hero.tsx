import { CheckoutButton } from "@/components/CheckoutButton";
import { ProductShot } from "@/components/ProductShot";
import { Shell } from "@/components/Section";
import { site } from "@/config/site";
import { canClaimExpertComments } from "@/lib/publication";

export function Hero({ href, label }: { href: string | null; label: string }) {
  return (
    <section id="inicio" aria-labelledby="titulo-principal" className="scroll-mt-28 border-b border-line bg-white lg:scroll-mt-20">
      <Shell className="grid items-center gap-8 py-6 sm:py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12 lg:py-16">
        <div className="mx-auto flex min-w-0 max-w-xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
          <p className="text-base font-semibold text-navy sm:text-lg">{site.name}</p>
          <h1
            id="titulo-principal"
            className="mt-2 font-serif text-[1.75rem] leading-[1.15] tracking-tight text-balance text-navy sm:text-5xl"
          >
            {site.hero.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-pretty text-muted sm:text-lg">{site.hero.subtitle}</p>
          {canClaimExpertComments() ? (
            <p className="mt-5 border-l-2 border-green pl-4 text-base font-semibold leading-7 text-navy">
              {site.hero.editorialClaim}
            </p>
          ) : null}
          <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-semibold text-ink lg:justify-start">
            {site.hero.facts.map((fact) => (
              <li key={fact} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                {fact}
              </li>
            ))}
          </ul>
          <div className="mt-6 w-full max-w-sm lg:mx-0">
            <CheckoutButton href={href} label={label} fullWidth />
          </div>
        </div>
        <ProductShot priority />
      </Shell>
    </section>
  );
}
