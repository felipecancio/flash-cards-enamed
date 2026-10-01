import { LegalDocument } from "@/components/LegalDocument";
import { site } from "@/config/site";
import { isTermsPublished } from "@/lib/publication";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const published = isTermsPublished();

export const metadata: Metadata = {
  title: "Termos de uso",
  robots: published ? { index: true, follow: true } : { index: false, follow: false },
};

export default function TermsPage() {
  if (!published) redirect("/");

  return <LegalDocument title="Termos de uso" paragraphs={site.legal.terms.paragraphs} published={published} />;
}
