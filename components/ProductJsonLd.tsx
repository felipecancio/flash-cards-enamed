import { site } from "@/config/site";

export function ProductJsonLd({ checkoutUrl }: { checkoutUrl: string }) {
  const seller = site.seller.legalName.trim();
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: site.name,
    description: site.seo.description,
    category: "Material educacional",
    ...(seller ? { brand: { "@type": "Brand", name: seller } } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: site.pricing.current.toFixed(2),
      url: checkoutUrl,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
