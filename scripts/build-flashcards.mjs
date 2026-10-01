import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CLINICAL_REVIEW, answers, copy } from "./card-copy.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "data", "enamed_cases_200_source_for_cursor.json");
const outputPath = path.join(root, "data", "flashcards.json");

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const byId = new Map(source.cases.map((item) => [item.case_id, item]));

const selected = [
  1, 2, 4, 6, 7, 8, 11, 12, 13, 15,
  21, 23, 24, 26, 27, 29, 30, 35, 39, 40,
  41, 43, 46, 47, 48, 49, 50, 54, 55, 59,
  63, 64, 68, 70, 71, 72, 73, 74, 75, 76,
  81, 83, 84, 85, 87, 89, 90, 92, 93, 98,
  101, 102, 105, 106, 108, 109, 112, 113, 114, 118,
  121, 122, 123, 124, 125, 128, 129, 130, 133, 140,
  141, 142, 143, 145, 148, 149, 150, 152, 157, 159,
  161, 163, 165, 167, 168, 169, 170, 171, 173, 174,
  181, 182, 184, 185, 186, 187, 189, 191, 194, 198,
];

function pad(value, size) {
  return String(value).padStart(size, "0");
}

const cards = selected.map((caseId) => {
  const item = byId.get(caseId);
  if (!item) throw new Error(`Caso ${caseId} ausente na fonte`);
  const correct = item.options.find((option) => option.letter === item.correct_letter);
  if (!correct) throw new Error(`Caso ${caseId} sem alternativa correta`);
  const text = copy[caseId];
  if (!text?.front || !text?.why) throw new Error(`Caso ${caseId} sem texto curto`);

  return {
    id: `fc-c${pad(caseId, 3)}`,
    caseId,
    volume: item.volume,
    area: item.area,
    topic: item.topic,
    front: text.front,
    answer: answers[caseId] ?? correct.text,
    why: text.why,
    decisive: item.decisive_detail,
    rule: item.exam_rule,
    needsClinicalReview: CLINICAL_REVIEW.has(caseId),
    reviewLabel: `Rever caso ${pad(caseId, 3)} — Volume ${pad(item.volume, 2)}`,
    source: {
      title: item.reference.title,
      url: item.reference.url,
    },
  };
});

const deck = {
  title: "Flashcards de revisão — 200 Casos Clínicos Resolvidos para o Enamed",
  sourceFile: "enamed_cases_200_source_for_cursor.json",
  sourceVersion: source.version,
  disclaimer:
    "Material educacional de treino. Este bônus não é apresentado como revisado por médicos.",
  schedule: {
    missedDays: 1,
    unsureDays: 2,
    rememberedDays: 7,
    nextRememberedDays: 21,
    description:
      "Lembrei segue o acerto: 7 dias na primeira vez e 21 dias nas seguintes. Rever segue o intervalo antigo de dúvida: 2 dias, sem zerar acertos. Registros antigos de erro continuam válidos: dia seguinte e acertos zerados.",
  },
  cards,
};

fs.writeFileSync(outputPath, `${JSON.stringify(deck, null, 2)}\n`, "utf8");
console.log(`Wrote ${cards.length} cards to ${outputPath}`);
