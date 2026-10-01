import { site, type Author, type ClinicalSample, type IncludedItem, type LegalDocument } from "@/config/site";

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function getCheckoutUrl() {
  const raw = process.env.NEXT_PUBLIC_CHECKOUT_URL?.trim() ?? "";
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") return null;
    return raw;
  } catch {
    return null;
  }
}

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url;
  } catch {
    return null;
  }
}

export function getSupportEmail() {
  const email = site.delivery.supportEmail.trim();
  if (!EMAIL_PATTERN.test(email)) return null;
  return email;
}

export function getCtaLabel() {
  return site.cta.label;
}

export function hasVerifiedReferencePrice() {
  return site.pricing.referenceVerified && site.pricing.reference > site.pricing.current;
}

function isCompleteAuthor(author: Author) {
  return [author.name, author.crm, author.specialty, author.practice, author.contribution].every(
    (field) => field.trim().length > 0,
  );
}

export function getCompleteAuthors() {
  return site.authors.filter(isCompleteAuthor);
}

export function canClaimExpertComments() {
  return site.editorial.commentsReviewedByIdentifiedPhysicians && getCompleteAuthors().length > 0;
}

export function isSamplePublishable(sample: ClinicalSample) {
  if (!sample.validated) return false;
  if (sample.approvedBy.trim().length < 5) return false;
  if (sample.area.trim().length < 3) return false;
  if (sample.stem.trim().length < 40) return false;
  if (sample.reasoning.trim().length < 40) return false;
  if (sample.alternatives.length < 4) return false;
  if (sample.alternatives.some((item) => item.letter.trim().length === 0 || item.text.trim().length < 2)) {
    return false;
  }

  const answer = sample.answerLetter.trim().toUpperCase();
  const letters = sample.alternatives.map((item) => item.letter.trim().toUpperCase());
  if (!answer || !letters.includes(answer)) return false;

  return letters
    .filter((letter) => letter !== answer)
    .every((letter) =>
      sample.incorrect.some(
        (item) => item.letter.trim().toUpperCase() === letter && item.explanation.trim().length > 0,
      ),
    );
}

export function isLegalReady(document: LegalDocument) {
  return (
    document.ready &&
    document.paragraphs.length > 0 &&
    document.paragraphs.every(
      (paragraph) => paragraph.trim().length > 40 && !paragraph.includes("TEXTO PENDENTE"),
    )
  );
}

export function isPrivacyPublished() {
  return isLegalReady(site.legal.privacy);
}

export function isTermsPublished() {
  return isLegalReady(site.legal.terms);
}

export function getIncludedItems(): IncludedItem[] {
  const items: IncludedItem[] = [...site.included];

  if (site.bonuses.errorNotebook.ready) {
    items.push({
      id: "error-notebook",
      title: site.bonuses.errorNotebook.title,
      description: site.bonuses.errorNotebook.description,
    });
  }

  if (site.bonuses.reviewGuide.ready) {
    items.push({
      id: "review-guide",
      title: site.bonuses.reviewGuide.title,
      description: site.bonuses.reviewGuide.description,
    });
  }

  return items;
}

export function getDeveloperStatus() {
  const missing: string[] = [];
  const held: string[] = [];

  if (!getCheckoutUrl()) {
    missing.push(
      "Defina NEXT_PUBLIC_CHECKOUT_URL com a URL HTTPS do checkout. Sem isso os botões de compra ficam inativos.",
    );
  }

  if (!getSupportEmail()) {
    missing.push("Preencha delivery.supportEmail com o e-mail real de suporte.");
  }

  if (!site.seller.legalName.trim()) {
    missing.push("Preencha seller.legalName com o responsável pela venda.");
  }

  if (getCompleteAuthors().length === 0) {
    missing.push(
      "Preencha authors com nome, CRM, especialidade, atuação e contribuição. Não use dados fictícios.",
    );
  }

  if (site.authors.length > getCompleteAuthors().length) {
    missing.push("Há itens incompletos em authors. Eles não aparecem na página.");
  }

  if (!isSamplePublishable(site.clinicalSample)) {
    missing.push(
      "Inclua em clinicalSample uma questão real aprovada por médico e marque validated como true somente depois dessa aprovação.",
    );
  }

  if (!isPrivacyPublished()) {
    missing.push("Substitua o texto da privacidade, remova “TEXTO PENDENTE” e marque legal.privacy.ready como true.");
  }

  if (!isTermsPublished()) {
    missing.push("Substitua o texto dos termos, remova “TEXTO PENDENTE” e marque legal.terms.ready como true.");
  }

  if (!getSiteUrl()) {
    missing.push("Defina NEXT_PUBLIC_SITE_URL com o domínio público para canonical e compartilhamento.");
  }

  if (site.editorial.commentsReviewedByIdentifiedPhysicians && getCompleteAuthors().length === 0) {
    missing.push(
      "A flag editorial está ligada, mas não há médico identificado. A frase sobre comentários exclusivos continua oculta.",
    );
  } else if (!canClaimExpertComments()) {
    held.push(
      "A frase de autoria médica exclusiva fica oculta até a revisão pelos médicos identificados.",
    );
  }

  if (site.pricing.referenceVerified && site.pricing.reference <= site.pricing.current) {
    missing.push(
      "pricing.referenceVerified está true, mas o preço de referência não é maior que o atual. O valor riscado não será exibido.",
    );
  } else if (!hasVerifiedReferencePrice()) {
    held.push(
      "O preço aparece como “Preço de lançamento”. O valor riscado só entra se pricing.referenceVerified for true e o preço anterior for comprovável.",
    );
  }

  if (!site.bonuses.errorNotebook.ready) {
    held.push("O caderno de erros não entra na oferta enquanto bonuses.errorNotebook.ready for false.");
  }

  if (!site.bonuses.reviewGuide.ready) {
    held.push("O roteiro de 21 dias não entra na oferta enquanto bonuses.reviewGuide.ready for false.");
  }

  if (!site.seller.document.trim()) {
    held.push("seller.document está vazio, então o documento do vendedor não é exibido.");
  }

  return { missing, held };
}
