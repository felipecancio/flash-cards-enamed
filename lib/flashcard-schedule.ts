export const INTERVALS = {
  missed: 1,
  unsure: 2,
  remembered: 7,
  rememberedAgain: 21,
} as const;

export type Rating = "remembered" | "unsure" | "missed";

export type CardProgress = {
  rating: Rating;
  due: string;
  successes: number;
  seen: true;
  updatedAt: string;
};

export function todayISO(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return todayISO(date);
}

/**
 * Lembrei grava "remembered": 7 dias no primeiro acerto e 21 nos seguintes.
 * Rever grava "unsure": 2 dias, sem zerar a contagem de acertos.
 * Registros antigos "missed" permanecem: dia seguinte e acertos zerados.
 */
export function applyRating(
  previousSuccesses: number,
  rating: Rating,
  today: string,
): { successes: number; due: string; days: number } {
  if (rating === "missed") {
    return { successes: 0, days: INTERVALS.missed, due: addDays(today, INTERVALS.missed) };
  }

  if (rating === "unsure") {
    return {
      successes: previousSuccesses,
      days: INTERVALS.unsure,
      due: addDays(today, INTERVALS.unsure),
    };
  }

  const successes = previousSuccesses + 1;
  const days = successes >= 2 ? INTERVALS.rememberedAgain : INTERVALS.remembered;
  return { successes, days, due: addDays(today, days) };
}

export function buildReviewQueue<T extends { id: string }>(
  cards: readonly T[],
  progress: Readonly<Record<string, CardProgress | undefined>>,
  today: string,
): T[] {
  const missed: T[] = [];
  const unsure: T[] = [];
  const remembered: T[] = [];
  const unseen: T[] = [];

  for (const card of cards) {
    const state = progress[card.id];
    if (!state?.seen) {
      unseen.push(card);
      continue;
    }
    if (state.due > today) continue;
    if (state.rating === "missed") missed.push(card);
    else if (state.rating === "unsure") unsure.push(card);
    else remembered.push(card);
  }

  return [...missed, ...unsure, ...remembered, ...unseen];
}

export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function feedbackFor(rating: Rating, successes: number): string {
  if (rating === "missed") {
    return "Erro registrado. Próxima revisão: amanhã.";
  }
  if (rating === "unsure") {
    return `Dúvida registrada. Próxima revisão: em ${INTERVALS.unsure} dias.`;
  }
  if (successes >= 2) {
    return `Novo acerto. Próxima revisão: em ${INTERVALS.rememberedAgain} dias.`;
  }
  return `Acerto registrado. Próxima revisão: em ${INTERVALS.remembered} dias.`;
}
