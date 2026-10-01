import { Audience } from "@/components/Audience";
import { Bonuses } from "@/components/Bonuses";
import { Authors } from "@/components/Authors";
import { Delivery } from "@/components/Delivery";
import { Demonstration } from "@/components/Demonstration";
import { Difficulty } from "@/components/Difficulty";
import { Footer } from "@/components/Footer";
import { GuaranteeFaq } from "@/components/GuaranteeFaq";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowToStudy } from "@/components/HowToStudy";
import { Included } from "@/components/Included";
import { Offer } from "@/components/Offer";
import { ProductJsonLd } from "@/components/ProductJsonLd";
import { StickyCta } from "@/components/StickyCta";
import { getCheckoutUrl, getCtaLabel } from "@/lib/publication";

export default function Page() {
  const checkoutUrl = getCheckoutUrl();
  const label = getCtaLabel();

  return (
    <>
      {checkoutUrl ? <ProductJsonLd checkoutUrl={checkoutUrl} /> : null}
      <Header href={checkoutUrl} label={label} />
      <main id="conteudo-principal">
        <Hero href={checkoutUrl} label={label} />
        <Difficulty />
        <Demonstration />
        <Included />
        <HowToStudy />
        <Audience />
        <Authors />
        <Bonuses href={checkoutUrl} label={label} />
        <Delivery />
        <Offer href={checkoutUrl} label={label} />
        <GuaranteeFaq />
      </main>
      <Footer />
      <StickyCta href={checkoutUrl} label={label} />
    </>
  );
}
