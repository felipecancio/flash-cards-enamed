export type FlashcardSource = {
  title: string;
  url: string;
};

export type Flashcard = {
  id: string;
  caseId: number;
  volume: number;
  area: string;
  topic: string;
  front: string;
  answer: string;
  why: string;
  decisive: string;
  rule: string;
  needsClinicalReview: boolean;
  reviewLabel: string;
  source: FlashcardSource;
};

export type FlashcardDeck = {
  title: string;
  sourceFile: string;
  sourceVersion: string;
  disclaimer: string;
  schedule: {
    missedDays: number;
    unsureDays: number;
    rememberedDays: number;
    nextRememberedDays: number;
    description: string;
  };
  cards: Flashcard[];
};

export const AREA_LABELS: Record<string, string> = {
  "CLÍNICA MÉDICA": "Clínica médica",
  "CIRURGIA GERAL": "Cirurgia geral",
  "GINECOLOGIA E OBSTETRÍCIA": "Ginecologia e obstetrícia",
  PEDIATRIA: "Pediatria",
  "MEDICINA DE FAMÍLIA E COMUNIDADE": "Medicina de família e comunidade",
  "SAÚDE COLETIVA": "Saúde coletiva",
  "SAÚDE MENTAL": "Saúde mental",
};

export const AREA_ORDER = [
  "CLÍNICA MÉDICA",
  "CIRURGIA GERAL",
  "GINECOLOGIA E OBSTETRÍCIA",
  "PEDIATRIA",
  "MEDICINA DE FAMÍLIA E COMUNIDADE",
  "SAÚDE COLETIVA",
  "SAÚDE MENTAL",
] as const;

export function areaLabel(area: string): string {
  return AREA_LABELS[area] ?? area;
}

export function volumeLabel(volume: number): string {
  return `Volume ${String(volume).padStart(2, "0")}`;
}

export function filterCards(
  cards: readonly Flashcard[],
  area: string,
  volume: string,
): Flashcard[] {
  return cards.filter((card) => {
    if (area !== "all" && card.area !== area) return false;
    if (volume !== "all" && String(card.volume) !== volume) return false;
    return true;
  });
}
