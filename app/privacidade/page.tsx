import { LegalDocument } from "@/components/LegalDocument";
import { site } from "@/config/site";
import { isPrivacyPublished } from "@/lib/publication";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

const published = isPrivacyPublished();

export const metadata: Metadata = {
  title: "Política de privacidade",
  robots: published ? { index: true, follow: true } : { index: false, follow: false },
};

export default function PrivacyPage() {
  if (!published) redirect("/");

  return (
    <LegalDocument
      title="Política de privacidade"
      paragraphs={site.legal.privacy.paragraphs}
      published={published}
    />
  );
}
