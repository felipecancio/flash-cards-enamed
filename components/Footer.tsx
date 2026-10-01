import { Shell } from "@/components/Section";
import { site } from "@/config/site";
import { getSupportEmail, isPrivacyPublished, isTermsPublished } from "@/lib/publication";
import Link from "next/link";

export function Footer() {
  const email = getSupportEmail();
  const seller = site.seller.legalName.trim();
  const document = site.seller.document.trim();
  const links = [
    isPrivacyPublished() ? { href: "/privacidade", label: "Privacidade" } : null,
    isTermsPublished() ? { href: "/termos", label: "Termos" } : null,
  ].filter((item): item is { href: string; label: string } => item !== null);

  return (
    <footer className="theme-dark bg-navy-deep text-white">
      <Shell className="py-12 text-center">
        <p className="mx-auto max-w-xl font-serif text-2xl leading-tight tracking-tight">{site.name}</p>
        {seller || email ? (
          <div className="mt-5 space-y-2 text-sm leading-6 text-white/75">
            {seller ? (
              <p className="break-words">
                Venda realizada por {seller}
                {document ? ` · ${document}` : ""}.
              </p>
            ) : null}
            {email ? (
              <p>
                Suporte:{" "}
                <a href={`mailto:${email}`} className="break-words font-semibold text-white underline underline-offset-4">
                  {email}
                </a>
              </p>
            ) : null}
          </div>
        ) : null}
        {links.length > 0 ? (
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-semibold">
            {links.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mx-auto mt-8 max-w-3xl border-t border-white/15 pt-6 text-sm leading-6 text-white/70">
          {site.footer.disclaimer}
        </p>
      </Shell>
    </footer>
  );
}
