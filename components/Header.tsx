import { BrandLetreiro } from "@/components/BrandLetreiro";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Shell } from "@/components/Section";
import { site } from "@/config/site";

const linkClass = "shrink-0 py-1 text-sm font-semibold text-navy underline-offset-4 hover:underline";

export function Header({ href, label }: { href: string | null; label: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <Shell className="flex items-center justify-between gap-4 py-2.5">
        <BrandLetreiro />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Seções da página">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <CheckoutButton href={href} label={label} compact />
        </div>
      </Shell>
      <nav
        className="flex gap-5 overflow-x-auto border-t border-line px-5 py-2 [scrollbar-width:none] sm:px-8 lg:hidden [&::-webkit-scrollbar]:hidden"
        aria-label="Seções da página"
      >
        {site.nav.map((item) => (
          <a key={item.href} href={item.href} className={linkClass}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
