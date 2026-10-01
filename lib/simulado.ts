export const SIMULADO_STORAGE_KEY = "enamed-200-simulados-v1";

export const SIMULADO_SIZES = [10, 20, 40] as const;

export type SimuladoSize = (typeof SIMULADO_SIZES)[number];

export type SimuladoMode = "mixed" | "errors";

export type Outcome = "correct" | "wrong" | "blank";

export type Letter = "A" | "B" | "C" | "D";

export type CaseOption = {
  letter: Letter;
  text: string;
  whyWrong: string | null;
};

export type ClinicalCase = {
  id: number;
  volume: number;
  area: string;
  topic: string;
  title: string;
  stem: string;
  options: CaseOption[];
  correctLetter: Letter;
  reasoning: string;
  examRule: string;
};

export type AttemptPhase = "quiz" | "results";

export type TimingMode = "off" | "visible" | "hidden";

export type AttemptState = {
  mode: SimuladoMode;
  caseIds: number[];
  index: number;
  answers: Record<string, Letter>;
  flagged: number[];
  phase: AttemptPhase;
  timing: TimingMode;
  elapsedMs: number;
};

export type StoredSimulado = {
  version: 1;
  outcomes: Record<string, Outcome>;
  attempt: AttemptState | null;
};

export type GradedItem = {
  caseItem: ClinicalCase;
  studentLetter: Letter | null;
  outcome: Outcome;
  flagged: boolean;
};

export type AreaScore = {
  area: string;
  correct: number;
  total: number;
};

export type Grade = {
  correct: number;
  wrong: number;
  blank: number;
  total: number;
  byArea: AreaScore[];
  items: GradedItem[];
};

const LETTERS: readonly Letter[] = ["A", "B", "C", "D"];

const AREA_LABELS: Record<string, string> = {
  "CLÍNICA MÉDICA": "Clínica médica",
  "CIRURGIA GERAL": "Cirurgia geral",
  "GINECOLOGIA E OBSTETRÍCIA": "Ginecologia e obstetrícia",
  PEDIATRIA: "Pediatria",
  "MEDICINA DE FAMÍLIA E COMUNIDADE": "Medicina de família e comunidade",
  "SAÚDE COLETIVA": "Saúde coletiva",
  "SAÚDE MENTAL": "Saúde mental",
};

export function isLetter(value: unknown): value is Letter {
  return value === "A" || value === "B" || value === "C" || value === "D";
}

export function isSimuladoSize(value: number): value is SimuladoSize {
  return value === 10 || value === 20 || value === 40;
}

export function areaLabel(area: string): string {
  return AREA_LABELS[area] ?? area;
}

export function caseLabel(id: number): string {
  return `Caso ${String(id).padStart(3, "0")}`;
}

export function volumeLabel(volume: number): string {
  return `Volume ${String(volume).padStart(2, "0")}`;
}

export function parseCases(data: unknown): ClinicalCase[] {
  const problems: string[] = [];
  if (!data || typeof data !== "object" || !Array.isArray((data as { cases?: unknown }).cases)) {
    throw new Error("O arquivo de casos não tem a lista cases.");
  }

  const rawCases = (data as { cases: unknown[] }).cases;
  if (rawCases.length !== 200) {
    problems.push(`esperados 200 casos, veio ${rawCases.length}`);
  }

  const cases: ClinicalCase[] = [];
  const seen = new Set<number>();

  rawCases.forEach((raw, index) => {
    const parsed = readCase(raw, index, problems);
    if (!parsed) return;
    if (seen.has(parsed.id)) problems.push(`caso ${parsed.id} repetido`);
    seen.add(parsed.id);
    cases.push(parsed);
  });

  for (let id = 1; id <= 200; id += 1) {
    if (!seen.has(id)) problems.push(`caso ${id} ausente`);
  }

  if (problems.length > 0) {
    throw new Error(problems.join("\n"));
  }

  return cases;
}

export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const next = items.slice();
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    const current = next[index];
    next[index] = next[swap] as T;
    next[swap] = current as T;
  }
  return next;
}

export function drawCaseIds(input: {
  cases: readonly ClinicalCase[];
  size: number;
  mode: SimuladoMode;
  outcomes: Readonly<Record<string, Outcome>>;
  rng?: () => number;
}): number[] {
  const rng = input.rng ?? Math.random;
  if (input.size < 1) return [];

  const picked: ClinicalCase[] = [];
  if (input.mode === "errors") {
    fillRoundRobin(
      groupByArea(input.cases, (item) => isError(input.outcomes[String(item.id)]), rng),
      input.size,
      picked,
    );
  } else {
    fillRoundRobin(
      groupByArea(input.cases, (item) => !wasAnswered(input.outcomes[String(item.id)]), rng),
      input.size,
      picked,
    );
    fillRoundRobin(
      groupByArea(input.cases, (item) => wasAnswered(input.outcomes[String(item.id)]), rng),
      input.size,
      picked,
    );
  }

  return shuffle(picked, rng).map((item) => item.id);
}

export function gradeAttempt(
  cases: readonly ClinicalCase[],
  attempt: Pick<AttemptState, "caseIds" | "answers" | "flagged">,
): Grade {
  const byId = new Map(cases.map((item) => [item.id, item]));
  const items: GradedItem[] = [];

  for (const id of attempt.caseIds) {
    const caseItem = byId.get(id);
    if (!caseItem) throw new Error(`caso ${id} ausente na correção`);
    const studentLetter = attempt.answers[String(id)] ?? null;
    const outcome = outcomeFor(studentLetter, caseItem.correctLetter);
    items.push({
      caseItem,
      studentLetter,
      outcome,
      flagged: attempt.flagged.includes(id),
    });
  }

  const totals = new Map<string, AreaScore>();
  for (const row of items) {
    const current = totals.get(row.caseItem.area) ?? { area: row.caseItem.area, correct: 0, total: 0 };
    current.total += 1;
    if (row.outcome === "correct") current.correct += 1;
    totals.set(row.caseItem.area, current);
  }

  const byArea = areaSequence(cases)
    .filter((area) => totals.has(area))
    .map((area) => totals.get(area) as AreaScore);

  return {
    correct: items.filter((row) => row.outcome === "correct").length,
    wrong: items.filter((row) => row.outcome === "wrong").length,
    blank: items.filter((row) => row.outcome === "blank").length,
    total: items.length,
    byArea,
    items,
  };
}

export function gabaritoOrder(items: readonly GradedItem[]): { item: GradedItem; question: number }[] {
  return items
    .map((item, index) => ({ item, question: index + 1 }))
    .sort((left, right) => Number(left.item.outcome === "correct") - Number(right.item.outcome === "correct"));
}

export function mergeOutcomes(
  previous: Readonly<Record<string, Outcome>>,
  items: readonly GradedItem[],
): Record<string, Outcome> {
  const next: Record<string, Outcome> = { ...previous };
  for (const row of items) next[String(row.caseItem.id)] = row.outcome;
  return next;
}

export function countErrors(outcomes: Readonly<Record<string, Outcome>>, cases: readonly ClinicalCase[]): number {
  const ids = new Set(cases.map((item) => String(item.id)));
  return Object.entries(outcomes).filter(([id, outcome]) => ids.has(id) && isError(outcome)).length;
}

export function attemptFitsBank(attempt: AttemptState, cases: readonly ClinicalCase[]): boolean {
  const ids = new Set(cases.map((item) => item.id));
  return attempt.caseIds.every((id) => ids.has(id));
}

export function answerQuestion(attempt: AttemptState, letter: Letter): AttemptState {
  const id = attempt.caseIds[attempt.index];
  if (id === undefined) return attempt;
  const key = String(id);
  const answers = { ...attempt.answers };
  if (answers[key] === letter) delete answers[key];
  else answers[key] = letter;
  return { ...attempt, answers };
}

export function toggleFlag(attempt: AttemptState): AttemptState {
  const id = attempt.caseIds[attempt.index];
  if (id === undefined) return attempt;
  const flagged = attempt.flagged.includes(id)
    ? attempt.flagged.filter((item) => item !== id)
    : [...attempt.flagged, id];
  return { ...attempt, flagged };
}

export function moveQuestion(attempt: AttemptState, delta: number): AttemptState {
  return jumpToQuestion(attempt, attempt.index + delta);
}

export function jumpToQuestion(attempt: AttemptState, index: number): AttemptState {
  const last = attempt.caseIds.length - 1;
  const next = Math.min(Math.max(index, 0), last);
  return { ...attempt, index: next };
}

export type ScoreTone = "red" | "orange" | "yellow" | "green";

export function scoreFeedback(correct: number, total: number): { percent: number; tone: ScoreTone; message: string } {
  const percent = total > 0 ? Math.min(100, Math.max(0, Math.round((correct / total) * 100))) : 0;
  if (percent <= 40) return { percent, tone: "red", message: "Tá faltando estudo!" };
  if (percent <= 60) return { percent, tone: "orange", message: "Podemos melhorar..." };
  if (percent <= 80) return { percent, tone: "yellow", message: "Boa, mas dá pra melhorar" };
  if (percent < 100) return { percent, tone: "green", message: "Parabéns! Vamos continuar no foco!" };
  return { percent, tone: "green", message: "Parabéns, você gabaritou!!!" };
}

export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const clock = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return hours > 0 ? `${hours}:${clock}` : clock;
}

export function blankPositions(attempt: Pick<AttemptState, "caseIds" | "answers">): number[] {
  const positions: number[] = [];
  attempt.caseIds.forEach((id, index) => {
    if (!attempt.answers[String(id)]) positions.push(index + 1);
  });
  return positions;
}

export function parseStored(raw: unknown): StoredSimulado {
  const empty: StoredSimulado = { version: 1, outcomes: {}, attempt: null };
  if (!raw || typeof raw !== "object") return empty;
  const record = raw as { version?: unknown; outcomes?: unknown; attempt?: unknown };
  if (record.version !== 1) return empty;
  return {
    version: 1,
    outcomes: readOutcomes(record.outcomes),
    attempt: readAttempt(record.attempt),
  };
}

function readCase(raw: unknown, index: number, problems: string[]): ClinicalCase | null {
  const label = `item ${index + 1}`;
  if (!raw || typeof raw !== "object") {
    problems.push(`${label} inválido`);
    return null;
  }

  const item = raw as Record<string, unknown>;
  const id = item.case_id;
  const where = typeof id === "number" ? `caso ${id}` : label;

  if (typeof id !== "number" || !Number.isInteger(id)) {
    problems.push(`${where}: case_id ausente`);
    return null;
  }

  const volume = item.volume;
  const area = item.area;
  const topic = item.topic;
  const title = item.title;
  const stem = item.stem;
  const reasoning = item.reasoning;
  const examRule = item.exam_rule;
  const decisive = item.decisive_detail;
  const reference = item.reference;

  if (typeof volume !== "number" || !Number.isInteger(volume) || volume < 1) {
    problems.push(`${where}: volume ausente`);
  }
  if (typeof area !== "string" || area.trim() === "") problems.push(`${where}: área ausente`);
  if (typeof topic !== "string" || topic.trim() === "") problems.push(`${where}: tema ausente`);
  if (typeof title !== "string" || title.trim() === "") problems.push(`${where}: título ausente`);
  if (typeof stem !== "string" || stem.trim() === "") problems.push(`${where}: enunciado ausente`);
  if (typeof reasoning !== "string" || reasoning.trim() === "") problems.push(`${where}: resolução ausente`);
  if (typeof examRule !== "string" || examRule.trim() === "") problems.push(`${where}: regra ausente`);
  if (typeof decisive !== "string" || decisive.trim() === "") problems.push(`${where}: dado decisivo ausente`);
  if (!reference || typeof reference !== "object" || typeof (reference as { title?: unknown }).title !== "string") {
    problems.push(`${where}: referência ausente`);
  } else if ((reference as { title: string }).title.trim() === "") {
    problems.push(`${where}: referência sem título`);
  }

  const options = readOptions(item.options, item.correct_letter, where, problems);
  if (
    typeof volume !== "number" ||
    typeof area !== "string" ||
    typeof topic !== "string" ||
    typeof title !== "string" ||
    typeof stem !== "string" ||
    typeof reasoning !== "string" ||
    typeof examRule !== "string" ||
    !options
  ) {
    return null;
  }

  return {
    id,
    volume,
    area,
    topic,
    title,
    stem,
    options,
    correctLetter: options.correctLetter,
    reasoning,
    examRule,
  };
}

function readOptions(
  raw: unknown,
  correctLetter: unknown,
  where: string,
  problems: string[],
): (CaseOption[] & { correctLetter: Letter }) | null {
  if (!Array.isArray(raw) || raw.length !== 4) {
    problems.push(`${where}: alternativas inválidas`);
    return null;
  }

  const options: CaseOption[] = [];
  let correctCount = 0;

  for (let index = 0; index < LETTERS.length; index += 1) {
    const expected = LETTERS[index];
    const option = raw[index];
    if (!option || typeof option !== "object") {
      problems.push(`${where}: alternativa ${expected} ausente`);
      return null;
    }
    const record = option as Record<string, unknown>;
    if (record.letter !== expected) {
      problems.push(`${where}: alternativa fora da ordem ${expected}`);
      return null;
    }
    if (typeof record.text !== "string" || record.text.trim() === "") {
      problems.push(`${where}: texto da alternativa ${expected} ausente`);
      return null;
    }
    if (typeof record.is_correct !== "boolean") {
      problems.push(`${where}: gabarito da alternativa ${expected} ambíguo`);
      return null;
    }
    if (record.is_correct) {
      correctCount += 1;
      if (record.why_wrong !== null) problems.push(`${where}: alternativa correta ${expected} tem explicação de erro`);
    } else if (typeof record.why_wrong !== "string" || record.why_wrong.trim() === "") {
      problems.push(`${where}: explicação da alternativa ${expected} ausente`);
    }
    options.push({
      letter: expected,
      text: record.text,
      whyWrong: record.is_correct ? null : typeof record.why_wrong === "string" ? record.why_wrong : null,
    });
  }

  if (correctCount !== 1 || !isLetter(correctLetter)) {
    problems.push(`${where}: gabarito ausente ou ambíguo`);
    return null;
  }

  const marked = options.find((option) => option.whyWrong === null);
  if (!marked || marked.letter !== correctLetter) {
    problems.push(`${where}: letra correta não confere com as alternativas`);
    return null;
  }

  return Object.assign(options, { correctLetter });
}

function areaSequence(cases: readonly ClinicalCase[]): string[] {
  const order: string[] = [];
  for (const item of cases) {
    if (!order.includes(item.area)) order.push(item.area);
  }
  return order;
}

function groupByArea(
  cases: readonly ClinicalCase[],
  include: (item: ClinicalCase) => boolean,
  rng: () => number,
): ClinicalCase[][] {
  const buckets = new Map<string, ClinicalCase[]>();
  for (const item of cases) {
    if (!include(item)) continue;
    const bucket = buckets.get(item.area);
    if (bucket) bucket.push(item);
    else buckets.set(item.area, [item]);
  }

  const queues: ClinicalCase[][] = [];
  for (const area of areaSequence(cases)) {
    const bucket = buckets.get(area);
    if (bucket && bucket.length > 0) queues.push(shuffle(bucket, rng));
  }
  return queues;
}

function fillRoundRobin(queues: ClinicalCase[][], target: number, picked: ClinicalCase[]) {
  let moved = true;
  while (picked.length < target && moved) {
    moved = false;
    for (const queue of queues) {
      if (picked.length >= target) return;
      const next = queue.shift();
      if (!next) continue;
      picked.push(next);
      moved = true;
    }
  }
}

function wasAnswered(outcome: Outcome | undefined): boolean {
  return outcome === "correct" || outcome === "wrong";
}

function isError(outcome: Outcome | undefined): boolean {
  return outcome === "wrong" || outcome === "blank";
}

function outcomeFor(studentLetter: Letter | null, correctLetter: Letter): Outcome {
  if (!studentLetter) return "blank";
  return studentLetter === correctLetter ? "correct" : "wrong";
}

function readOutcomes(raw: unknown): Record<string, Outcome> {
  if (!raw || typeof raw !== "object") return {};
  const outcomes: Record<string, Outcome> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!/^\d+$/.test(key)) continue;
    if (value === "correct" || value === "wrong" || value === "blank") outcomes[String(Number(key))] = value;
  }
  return outcomes;
}

function readAttempt(raw: unknown): AttemptState | null {
  if (!raw || typeof raw !== "object") return null;
  const attempt = raw as Partial<AttemptState>;
  if (attempt.mode !== "mixed" && attempt.mode !== "errors") return null;
  if (attempt.phase !== "quiz" && attempt.phase !== "results") return null;
  if (!Array.isArray(attempt.caseIds) || attempt.caseIds.length === 0) return null;

  const caseIds: number[] = [];
  const seen = new Set<number>();
  for (const id of attempt.caseIds) {
    if (typeof id !== "number" || !Number.isInteger(id) || id < 1 || seen.has(id)) return null;
    seen.add(id);
    caseIds.push(id);
  }

  const index = typeof attempt.index === "number" && Number.isInteger(attempt.index) ? attempt.index : 0;
  const answers: Record<string, Letter> = {};
  if (attempt.answers && typeof attempt.answers === "object") {
    for (const [key, value] of Object.entries(attempt.answers)) {
      const id = Number(key);
      if (!seen.has(id) || !isLetter(value)) continue;
      answers[String(id)] = value;
    }
  }

  const flagged = Array.isArray(attempt.flagged)
    ? attempt.flagged.filter((id): id is number => typeof id === "number" && seen.has(id))
    : [];

  const timing = attempt.timing === "visible" || attempt.timing === "hidden" ? attempt.timing : "off";
  const elapsedMs =
    typeof attempt.elapsedMs === "number" && Number.isFinite(attempt.elapsedMs) && attempt.elapsedMs > 0
      ? Math.floor(attempt.elapsedMs)
      : 0;

  return {
    mode: attempt.mode,
    caseIds,
    index: Math.min(Math.max(index, 0), caseIds.length - 1),
    answers,
    flagged,
    phase: attempt.phase,
    timing,
    elapsedMs,
  };
}
