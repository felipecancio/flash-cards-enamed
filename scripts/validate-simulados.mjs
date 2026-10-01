import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SIMULADO_STORAGE_KEY,
  answerQuestion,
  attemptFitsBank,
  blankPositions,
  countErrors,
  drawCaseIds,
  gabaritoOrder,
  gradeAttempt,
  mergeOutcomes,
  scoreFeedback,
  moveQuestion,
  parseCases,
  parseStored,
  toggleFlag,
} from "../lib/simulado.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "data", "enamed_cases_200_source_for_cursor.json");
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const errors = [];
const fail = (message) => errors.push(message);

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function sameSet(left, right) {
  if (left.length !== right.length) return false;
  const ids = new Set(left);
  return right.every((id) => ids.has(id));
}

let cases = [];
try {
  cases = parseCases(source);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

if (cases.length === 200) {
  const bySource = new Map(source.cases.map((item) => [item.case_id, item]));
  for (const item of cases) {
    const raw = bySource.get(item.id);
    if (!raw) {
      fail(`caso ${item.id} sem fonte`);
      continue;
    }
    if (item.stem !== raw.stem) fail(`enunciado alterado no caso ${item.id}`);
    if (item.reasoning !== raw.reasoning) fail(`resolução alterada no caso ${item.id}`);
    if (item.examRule !== raw.exam_rule) fail(`regra alterada no caso ${item.id}`);
    if (item.title !== raw.title) fail(`título alterado no caso ${item.id}`);
    if (item.correctLetter !== raw.correct_letter) fail(`gabarito alterado no caso ${item.id}`);
    if (item.options.map((option) => option.letter).join("") !== "ABCD") {
      fail(`ordem das alternativas alterada no caso ${item.id}`);
    }
    item.options.forEach((option, index) => {
      if (option.text !== raw.options[index].text) fail(`alternativa ${option.letter} alterada no caso ${item.id}`);
    });
    if ("url" in item || "reference" in item) fail(`caso ${item.id} expõe link de referência`);
  }
}

const byId = new Map(cases.map((item) => [item.id, item]));

for (const size of [10, 20, 40]) {
  for (let seed = 1; seed <= 20; seed += 1) {
    const ids = drawCaseIds({
      cases,
      size,
      mode: "mixed",
      outcomes: {},
      rng: mulberry32(seed),
    });
    if (ids.length !== size) fail(`sorteio ${size} com semente ${seed} veio ${ids.length}`);
    if (new Set(ids).size !== ids.length) fail(`sorteio ${size} repetiu caso`);
    if (ids.some((id) => !byId.has(id))) fail(`sorteio ${size} trouxe caso ausente`);
  }
}

const mixed = drawCaseIds({ cases, size: 10, mode: "mixed", outcomes: {}, rng: mulberry32(4) });
const mixedAreas = new Set(mixed.map((id) => byId.get(id)?.area));
if (mixedAreas.size < 7) fail(`treino de 10 questões cobriu ${mixedAreas.size} áreas`);

const unseen = [];
const seenOutcomes = {};
const seenAreas = new Set();
for (const item of cases) {
  if (!seenAreas.has(item.area)) {
    seenAreas.add(item.area);
    unseen.push(item.id);
  } else {
    seenOutcomes[String(item.id)] = "correct";
  }
}
const preferred = drawCaseIds({
  cases,
  size: unseen.length,
  mode: "mixed",
  outcomes: seenOutcomes,
  rng: mulberry32(9),
});
if (!sameSet(preferred, unseen)) fail("o treino não priorizou as questões ainda sem resposta");

const preferredPlus = drawCaseIds({
  cases,
  size: unseen.length + 3,
  mode: "mixed",
  outcomes: seenOutcomes,
  rng: mulberry32(11),
});
if (!unseen.every((id) => preferredPlus.includes(id)) || preferredPlus.length !== unseen.length + 3) {
  fail("o treino completo não manteve as questões sem resposta antes de repetir");
}

const oneArea = cases.filter((item) => item.area === "PEDIATRIA").slice(0, 10).map((item) => item.id);
const oneAreaOutcomes = {};
for (const item of cases) {
  if (!oneArea.includes(item.id)) oneAreaOutcomes[String(item.id)] = "correct";
}
const fromOneArea = drawCaseIds({
  cases,
  size: 10,
  mode: "mixed",
  outcomes: oneAreaOutcomes,
  rng: mulberry32(13),
});
if (!sameSet(fromOneArea, oneArea)) fail("questões sem resposta de uma área foram deixadas de lado");

const allAnswered = {};
for (const item of cases) allAnswered[String(item.id)] = "correct";
const repeated = drawCaseIds({
  cases,
  size: 40,
  mode: "mixed",
  outcomes: allAnswered,
  rng: mulberry32(15),
});
if (repeated.length !== 40 || new Set(repeated).size !== 40) {
  fail("com todo o banco respondido, o treino não foi montado");
}

const ids = drawCaseIds({ cases, size: 20, mode: "mixed", outcomes: {}, rng: mulberry32(21) });
const answers = {};
for (const id of ids) answers[String(id)] = byId.get(id).correctLetter;
let grade = gradeAttempt(cases, { caseIds: ids, answers, flagged: [ids[2]] });
if (grade.correct !== 20 || grade.blank !== 0 || grade.wrong !== 0) {
  fail(`correção depois do sorteio: ${grade.correct} acertos`);
}
if (grade.items[2]?.flagged !== true) fail("marcação para revisar se perdeu");
for (const row of grade.items) {
  const raw = byId.get(row.caseItem.id);
  if (row.caseItem.correctLetter !== raw.correctLetter || row.outcome !== "correct") {
    fail(`gabarito instável no caso ${row.caseItem.id}`);
  }
  if (row.caseItem.options.map((option) => option.letter).join("") !== "ABCD") {
    fail(`alternativas reordenadas na correção do caso ${row.caseItem.id}`);
  }
}

const wrongLetter = byId.get(ids[0]).correctLetter === "A" ? "B" : "A";
answers[String(ids[0])] = wrongLetter;
delete answers[String(ids[1])];
grade = gradeAttempt(cases, { caseIds: ids, answers, flagged: [] });
if (grade.correct !== 18 || grade.wrong !== 1 || grade.blank !== 1) {
  fail(`contagem inesperada: ${grade.correct} acertos, ${grade.wrong} erros, ${grade.blank} em branco`);
}
if (grade.items[0].studentLetter !== wrongLetter || grade.items[0].outcome !== "wrong") {
  fail("resposta errada não foi reconhecida depois do sorteio");
}
if (grade.items[0].caseItem.correctLetter !== byId.get(ids[0]).correctLetter) {
  fail("a letra correta mudou com a ordem das questões");
}
if (grade.items[1].outcome !== "blank" || grade.items[1].studentLetter !== null) {
  fail("questão em branco não foi reconhecida");
}
const shown = gabaritoOrder(grade.items);
const firstHit = shown.findIndex((row) => row.item.outcome === "correct");
if (
  shown.slice(0, firstHit).some((row) => row.item.outcome === "correct") ||
  shown.slice(firstHit).some((row) => row.item.outcome !== "correct") ||
  shown[0]?.question !== 1 ||
  shown[1]?.question !== 2
) {
  fail("gabarito não mostrou erros e brancos antes dos acertos");
}
const areaTotal = grade.byArea.reduce((sum, area) => sum + area.total, 0);
const areaCorrect = grade.byArea.reduce((sum, area) => sum + area.correct, 0);
if (areaTotal !== grade.total || areaCorrect !== grade.correct || grade.byArea.length < 2) {
  fail("resultado por área não fecha com a nota");
}

let outcomes = mergeOutcomes({}, grade.items);
if (!countErrors(outcomes, cases)) fail("erros não entraram no histórico");
const errorDraw = drawCaseIds({
  cases,
  size: 20,
  mode: "errors",
  outcomes,
  rng: mulberry32(3),
});
if (errorDraw.length !== 2 || errorDraw.some((id) => id !== ids[0] && id !== ids[1])) {
  fail(`refazer erros trouxe ${errorDraw.join(",")}`);
}
const none = drawCaseIds({ cases, size: 10, mode: "errors", outcomes: {}, rng: mulberry32(1) });
if (none.length !== 0) fail("refazer erros sem histórico não deveria montar treino");

outcomes = mergeOutcomes(outcomes, [
  {
    caseItem: byId.get(ids[0]),
    studentLetter: byId.get(ids[0]).correctLetter,
    outcome: "correct",
    flagged: false,
  },
]);
const afterFix = drawCaseIds({
  cases,
  size: 10,
  mode: "errors",
  outcomes,
  rng: mulberry32(5),
});
if (afterFix.length !== 1 || afterFix[0] !== ids[1]) fail("acerto posterior não saiu da lista de erros");

const stored = parseStored({
  version: 1,
  outcomes: { 8: "wrong", 9: "blank", nope: "correct" },
  attempt: {
    mode: "mixed",
    caseIds: [3, 1, 8],
    index: 1,
    answers: { 3: "A", 1: "Z", 99: "B" },
    flagged: [8, 99],
    phase: "quiz",
  },
});
if (stored.attempt?.index !== 1 || stored.attempt.answers["3"] !== "A" || stored.attempt.answers["1"]) {
  fail("tentativa interrompida não foi lida");
}
if (stored.attempt?.timing !== "off" || stored.attempt?.elapsedMs !== 0) {
  fail("tentativa antiga sem tempo não foi lida");
}
if (!stored.attempt?.flagged.includes(8) || stored.attempt.flagged.includes(99)) {
  fail("marcação inválida entrou na tentativa");
}
if (stored.outcomes["8"] !== "wrong" || stored.outcomes["9"] !== "blank" || stored.outcomes.nope) {
  fail("histórico lido com valor inválido");
}
const resumed = JSON.parse(JSON.stringify(stored));
const reread = parseStored(resumed);
if (reread.attempt?.caseIds.join(",") !== "3,1,8" || reread.attempt.index !== 1) {
  fail("tentativa não sobreviveu ao ciclo de gravação");
}
if (!attemptFitsBank(stored.attempt, cases)) fail("tentativa válida foi recusada");
const foreign = { ...stored.attempt, caseIds: [9999, 1] };
if (attemptFitsBank(foreign, cases)) fail("tentativa com caso inexistente foi aceita");
if (parseStored({ version: 2, outcomes: { 1: "wrong" }, attempt: null }).outcomes["1"]) {
  fail("versão desconhecida deveria ser ignorada");
}
if (blankPositions(stored.attempt).join(",") !== "2,3") fail("posições em branco incorretas");

const bands = [
  [0, 1, 0, "red", "Tá faltando estudo!"],
  [4, 10, 40, "red", "Tá faltando estudo!"],
  [41, 100, 41, "orange", "Podemos melhorar..."],
  [3, 5, 60, "orange", "Podemos melhorar..."],
  [61, 100, 61, "yellow", "Boa, mas dá pra melhorar"],
  [8, 10, 80, "yellow", "Boa, mas dá pra melhorar"],
  [81, 100, 81, "green", "Parabéns! Vamos continuar no foco!"],
  [99, 100, 99, "green", "Parabéns! Vamos continuar no foco!"],
  [10, 10, 100, "green", "Parabéns, você gabaritou!!!"],
  [1, 3, 33, "red", "Tá faltando estudo!"],
];
for (const [correct, total, percent, tone, message] of bands) {
  const score = scoreFeedback(correct, total);
  if (score.percent !== percent || score.tone !== tone || score.message !== message) {
    fail(`faixa de acerto ${correct}/${total} saiu ${score.percent} ${score.tone}`);
  }
}

const moved = moveQuestion(stored.attempt, -1);
if (moved.index !== 0) fail("voltar da primeira questão saiu do treino");
const flagged = toggleFlag(answerQuestion(stored.attempt, "B"));
if (flagged.answers["1"] !== "B") fail("troca de resposta não gravou");
const cleared = answerQuestion(flagged, "B");
if (cleared.answers["1"]) fail("a mesma alternativa não desmarcou a resposta");

if (SIMULADO_STORAGE_KEY === "enamed-200-flashcards-v1") fail("histórico colide com os flashcards");
const flashStorage = fs.readFileSync(path.join(root, "lib", "flashcard-storage.ts"), "utf8");
if (!flashStorage.includes('STORAGE_KEY = "enamed-200-flashcards-v1"')) {
  fail("chave dos flashcards mudou");
}
if (flashStorage.includes(SIMULADO_STORAGE_KEY)) fail("flashcards usam a chave do simulado");

for (const relative of ["app/page.tsx", "components/Header.tsx", "components/Footer.tsx", "config/site.ts"]) {
  const text = fs.readFileSync(path.join(root, relative), "utf8");
  if (text.includes("/simulados")) fail(`${relative} aponta para o simulado`);
}
const flashPage = fs.readFileSync(path.join(root, "app", "flashcards", "page.tsx"), "utf8");
if (!flashPage.includes("flashcards.json") || flashPage.includes("/simulados")) {
  fail("a rota de flashcards foi alterada");
}

const prose = [
  fs.readFileSync(path.join(root, "components", "simulados", "SimuladoApp.tsx"), "utf8"),
  fs.readFileSync(path.join(root, "app", "simulados", "page.tsx"), "utf8"),
]
  .join("\n")
  .replaceAll("enamed_cases_200_source_for_cursor.json", "")
  .match(/["'`][^"'`]{8,}["'`]/g)
  ?.join("\n")
  .toLowerCase() ?? "";
for (const word of [
  "json",
  "localstorage",
  "algoritmo",
  "sorteio",
  "embaralh",
  "inédita",
  "inteligência",
  "prioridade",
  "hotmart",
  "login",
  "ranking",
  "não vistas",
  "não respondidas",
]) {
  if (prose.includes(word)) fail(`texto técnico na interface: ${word}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("OK 200 casos, sorteio sem repetição, correção estável, retomada, brancos, erros e áreas.");
