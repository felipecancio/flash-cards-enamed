import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { INTERVALS, addDays, applyRating, buildReviewQueue } from "../lib/flashcard-schedule.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = JSON.parse(
  fs.readFileSync(path.join(root, "data", "enamed_cases_200_source_for_cursor.json"), "utf8"),
);
const deck = JSON.parse(fs.readFileSync(path.join(root, "data", "flashcards.json"), "utf8"));

const errors = [];
const fail = (message) => errors.push(message);

const NUMBER_RE = /(?<![A-Za-z0-9])(?:\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)%?/gu;

function tokens(text) {
  return [...String(text).matchAll(NUMBER_RE)].map((match) => match[0]);
}

function norm(text) {
  return String(text).normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase();
}

function sentenceCount(text) {
  return text
    .trim()
    .split(/(?<!\d)[.!?](?!\d)\s+/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

if (!Array.isArray(deck.cards)) fail("cards ausente");
if (deck.cards.length !== 100) fail(`esperados 100 cartões, veio ${deck.cards?.length}`);

if (
  deck.schedule?.missedDays !== 1 ||
  deck.schedule?.unsureDays !== 2 ||
  deck.schedule?.rememberedDays !== 7 ||
  deck.schedule?.nextRememberedDays !== 21
) {
  fail("agenda do JSON diferente de 1, 2, 7 e 21 dias");
}

if (
  INTERVALS.missed !== deck.schedule.missedDays ||
  INTERVALS.unsure !== deck.schedule.unsureDays ||
  INTERVALS.remembered !== deck.schedule.rememberedDays ||
  INTERVALS.rememberedAgain !== deck.schedule.nextRememberedDays
) {
  fail("INTERVALS do código não bate com flashcards.json");
}

const byId = new Map(source.cases.map((item) => [item.case_id, item]));
const ids = new Set();
const perVolume = {};

for (const card of deck.cards) {
  if (ids.has(card.id)) fail(`ID repetido: ${card.id}`);
  ids.add(card.id);

  const expectedId = `fc-c${String(card.caseId).padStart(3, "0")}`;
  if (card.id !== expectedId) fail(`${card.id} deveria ser ${expectedId}`);

  const item = byId.get(card.caseId);
  if (!item) {
    fail(`${card.id} aponta para caso inexistente ${card.caseId}`);
    continue;
  }

  perVolume[card.volume] = (perVolume[card.volume] ?? 0) + 1;
  if (card.volume !== item.volume) fail(`${card.id} volume ${card.volume} ≠ fonte ${item.volume}`);
  if (card.area !== item.area) fail(`${card.id} área diferente da fonte`);
  if (card.topic !== item.topic) fail(`${card.id} tema diferente da fonte`);

  const correct = item.options.find((option) => option.letter === item.correct_letter);
  if (!correct) {
    fail(`${card.id} sem gabarito na fonte`);
    continue;
  }

  if (typeof card.answer !== "string" || card.answer.trim().length < 2) fail(`${card.id} resposta ausente`);
  if (typeof card.why !== "string" || !card.why.endsWith(".")) fail(`${card.id} justificativa ausente ou sem ponto final`);
  if (card.why.includes("?")) fail(`${card.id} justificativa contém pergunta`);
  if (sentenceCount(card.why) !== 1) fail(`${card.id} justificativa tem ${sentenceCount(card.why)} frases`);
  if (norm(card.why).includes(norm(card.answer))) fail(`${card.id} justificativa repete a resposta`);
  if (norm(card.front).includes(norm(card.why))) fail(`${card.id} frente repete a justificativa`);
  if (typeof card.needsClinicalReview !== "boolean") fail(`${card.id} sem marca de revisão clínica`);
  if (card.decisive !== item.decisive_detail) fail(`${card.id} dado decisivo diferente da fonte`);
  if (card.rule !== item.exam_rule) fail(`${card.id} regra diferente da fonte`);
  if (card.source?.title !== item.reference.title || card.source?.url !== item.reference.url) {
    fail(`${card.id} fonte técnica diferente do JSON`);
  }

  const review = `Rever caso ${String(card.caseId).padStart(3, "0")} — Volume ${String(card.volume).padStart(2, "0")}`;
  if (card.reviewLabel !== review) fail(`${card.id} rótulo de revisão inesperado: ${card.reviewLabel}`);

  if (!card.front.endsWith("?")) fail(`${card.id} frente não termina em pergunta`);
  if ((card.front.match(/\?/g) ?? []).length !== 1) fail(`${card.id} frente sem uma única pergunta`);
  const sentences = sentenceCount(card.front);
  if (sentences < 1 || sentences > 3) fail(`${card.id} frente tem ${sentences} frases`);

  if (norm(card.front).includes(norm(card.answer))) {
    fail(`${card.id} frente contém a resposta literal`);
  }
  if (norm(card.front).includes(norm(card.decisive))) {
    fail(`${card.id} frente contém o dado decisivo inteiro`);
  }
  if (norm(card.front).includes(norm(card.rule))) {
    fail(`${card.id} frente contém a regra inteira`);
  }

  for (const option of item.options) {
    if (option.is_correct || option.letter === item.correct_letter) continue;
    if (option.text.trim().length >= 24 && norm(card.front).includes(norm(option.text))) {
      fail(`${card.id} frente copia alternativa incorreta ${option.letter}`);
    }
    if (option.text.trim().length >= 24 && norm(card.answer).includes(norm(option.text))) {
      fail(`${card.id} resposta copia alternativa incorreta ${option.letter}`);
    }
  }

  const blob = [item.stem, item.decisive_detail, item.exam_rule, correct.text, item.title, item.topic].join(
    "\n",
  );
  const allowed = new Set(tokens(blob));
  // Nome da solução já indicada no caso (glicose hipertônica, salina hipertônica). Não libera dose em mL ou mg.
  const solutionLabels = new Set(["50%", "3%"]);
  const used = tokens([card.front, card.answer, card.why, card.decisive, card.rule].join("\n"));
  for (const token of used) {
    if (!allowed.has(token) && !solutionLabels.has(token)) fail(`${card.id} número ausente na fonte: ${token}`);
  }
}

for (const volume of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  if (perVolume[volume] !== 10) fail(`volume ${volume} tem ${perVolume[volume] ?? 0} cartões`);
}

const caseIds = deck.cards.map((card) => card.caseId);
if (new Set(caseIds).size !== caseIds.length) fail("caseId repetido");

if (addDays("2026-09-30", 1) !== "2026-10-01") fail("addDays não virou o mês");
if (addDays("2026-09-30", 21) !== "2026-10-21") fail("addDays 21");
if (addDays("2026-01-31", 2) !== "2026-02-02") fail("addDays fim de janeiro");

const first = applyRating(0, "remembered", "2026-09-30");
if (first.days !== 7 || first.successes !== 1 || first.due !== "2026-10-07") fail("primeiro acerto deveria ser 7 dias");
const again = applyRating(first.successes, "remembered", "2026-10-07");
if (again.days !== 21 || again.successes !== 2 || again.due !== "2026-10-28") fail("novo acerto deveria ser 21 dias");
const later = applyRating(again.successes, "remembered", "2026-10-28");
if (later.days !== 21 || later.successes !== 3) fail("acerto seguinte deveria permanecer em 21 dias");
const missed = applyRating(later.successes, "missed", "2026-10-28");
if (missed.days !== 1 || missed.successes !== 0 || missed.due !== "2026-10-29") fail("erro deveria ir para o dia seguinte e zerar acertos");
const afterMiss = applyRating(missed.successes, "remembered", "2026-10-29");
if (afterMiss.days !== 7 || afterMiss.successes !== 1) fail("acerto depois do erro deveria voltar a 7 dias");
const doubt = applyRating(1, "unsure", "2026-09-30");
if (doubt.days !== 2 || doubt.successes !== 1 || doubt.due !== "2026-10-02") fail("dúvida deveria ser 2 dias sem zerar acerto");

const sample = [
  { id: "erro" },
  { id: "duvida" },
  { id: "acerto-vencido" },
  { id: "acerto-futuro" },
  { id: "novo" },
];
const queue = buildReviewQueue(
  sample,
  {
    erro: { rating: "missed", due: "2026-09-30", successes: 0, seen: true, updatedAt: "" },
    duvida: { rating: "unsure", due: "2026-09-29", successes: 1, seen: true, updatedAt: "" },
    "acerto-vencido": { rating: "remembered", due: "2026-09-30", successes: 1, seen: true, updatedAt: "" },
    "acerto-futuro": { rating: "remembered", due: "2026-10-07", successes: 1, seen: true, updatedAt: "" },
  },
  "2026-09-30",
).map((card) => card.id);

if (queue.join(",") !== "erro,duvida,acerto-vencido,novo") {
  fail(`fila de revisão inesperada: ${queue.join(",")}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("OK 100 cartões, 10 por volume, agenda e fila de revisão.");
