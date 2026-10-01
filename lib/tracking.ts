/**
 * Registra InitiateCheckout somente se um rastreador já estiver na página
 * (gtag ou dataLayer). Não instala pixel e não envia Purchase.
 * Purchase deve depender da confirmação real da venda, fora desta página.
 */
export function trackInitiateCheckout() {
  if (typeof window === "undefined") return;

  const candidate = window as Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  if (typeof candidate.gtag === "function") {
    candidate.gtag("event", "InitiateCheckout");
    return;
  }

  if (Array.isArray(candidate.dataLayer)) {
    candidate.dataLayer.push({ event: "InitiateCheckout" });
  }
}
