"use client";

import { CheckoutButton } from "@/components/CheckoutButton";
import { useEffect, useState } from "react";

export function StickyCta({ href, label }: { href: string | null; label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const hero = document.getElementById("inicio");
      const offer = document.getElementById("oferta");
      if (!hero) return;

      const heroGone = hero.getBoundingClientRect().bottom <= 0;
      const offerRect = offer?.getBoundingClientRect();
      const offerVisible = Boolean(
        offerRect && offerRect.top < window.innerHeight && offerRect.bottom > 0,
      );
      setVisible(heroGone && !offerVisible);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("has-sticky-cta", visible);
    return () => document.documentElement.classList.remove("has-sticky-cta");
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Acesso ao material"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 pt-3 shadow-[0_-8px_24px_-18px_rgba(12,35,64,0.45)] backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <CheckoutButton href={href} label={label} fullWidth />
    </div>
  );
}
