"use client";

import {
  commitSimulado,
  getServerSimuladoSnapshot,
  getSimuladoSnapshot,
  subscribeSimulado,
  wipeSimulado,
} from "@/lib/simulado-storage";
import {
  SIMULADO_SIZES,
  answerQuestion,
  areaLabel,
  attemptFitsBank,
  blankPositions,
  caseLabel,
  countErrors,
  drawCaseIds,
  formatDuration,
  gabaritoOrder,
  gradeAttempt,
  jumpToQuestion,
  mergeOutcomes,
  moveQuestion,
  scoreFeedback,
  toggleFlag,
  volumeLabel,
  type AttemptState,
  type ClinicalCase,
  type Letter,
  type Outcome,
  type SimuladoMode,
  type SimuladoSize,
  type TimingMode,
} from "@/lib/simulado";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

const primaryButton =
  "min-h-14 w-full rounded-full bg-green px-4 text-base font-semibold text-white hover:bg-green-hover";
const startButton =
  "min-h-14 w-full rounded-full bg-green px-4 text-base font-semibold text-white shadow-[0_0_0_3px_rgba(26,104,72,0.22),0_10px_22px_-10px_rgba(26,104,72,0.9)] hover:bg-green-hover";
const redoButton =
  "min-h-14 w-full rounded-full border-2 border-green bg-green-soft px-4 text-base font-semibold text-green hover:bg-white";
const secondaryButton =
  "min-h-12 w-full rounded-full border border-navy bg-white px-4 text-base font-semibold text-navy";
const quietButton =
  "min-h-12 w-full rounded-full border border-line bg-white px-3 text-base font-semibold text-navy disabled:text-muted";
const saveWarning =
  "Não foi possível guardar neste aparelho. Se você fechar a página, este treino pode se perder.";
const bankNote = "Cada treino reúne questões dos 200 casos.";

export function SimuladoApp({ cases }: { cases: ClinicalCase[] }) {
  const stored = useSyncExternalStore(subscribeSimulado, getSimuladoSnapshot, getServerSimuladoSnapshot);
  const [size, setSize] = useState<SimuladoSize>(20);
  const [timing, setTiming] = useState<TimingMode>("off");
  const [home, setHome] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pendingMode, setPendingMode] = useState<SimuladoMode | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const caseById = useMemo(() => new Map(cases.map((item) => [item.id, item])), [cases]);
  const attempt = stored.attempt && attemptFitsBank(stored.attempt, cases) ? stored.attempt : null;
  const errorCount = countErrors(stored.outcomes, cases);
  const quiz = attempt?.phase === "quiz" && !home ? attempt : null;
  const results = attempt?.phase === "results" && !home ? attempt : null;
  const current = quiz ? caseById.get(quiz.caseIds[quiz.index]) : undefined;

  function persist(outcomes: Record<string, Outcome>, next: AttemptState | null) {
    setNotice(commitSimulado(outcomes, next) ? null : saveWarning);
  }

  function start(mode: SimuladoMode) {
    const ids = drawCaseIds({
      cases,
      size,
      mode,
      outcomes: getSimuladoSnapshot().outcomes,
    });
    if (ids.length === 0) return;
    setHome(false);
    setConfirmFinish(false);
    setConfirmReset(false);
    setPendingMode(null);
    persist(getSimuladoSnapshot().outcomes, {
      mode,
      caseIds: ids,
      index: 0,
      answers: {},
      flagged: [],
      phase: "quiz",
      timing,
      elapsedMs: 0,
    });
  }

  function liveQuiz(): AttemptState | null {
    const currentAttempt = getSimuladoSnapshot().attempt;
    if (!currentAttempt || currentAttempt.phase !== "quiz" || !attemptFitsBank(currentAttempt, cases)) return null;
    return currentAttempt;
  }

  function askStart(mode: SimuladoMode) {
    if (mode === "errors" && errorCount === 0) return;
    setConfirmReset(false);
    if (liveQuiz()) {
      setPendingMode(mode);
      return;
    }
    start(mode);
  }

  function selectLetter(letter: Letter) {
    const currentAttempt = liveQuiz();
    if (!currentAttempt) return;
    persist(getSimuladoSnapshot().outcomes, answerQuestion(currentAttempt, letter));
  }

  function flagQuestion() {
    const currentAttempt = liveQuiz();
    if (!currentAttempt) return;
    persist(getSimuladoSnapshot().outcomes, toggleFlag(currentAttempt));
  }

  function go(delta: number) {
    const currentAttempt = liveQuiz();
    if (!currentAttempt) return;
    persist(getSimuladoSnapshot().outcomes, moveQuestion(currentAttempt, delta));
  }

  function goTo(index: number) {
    const currentAttempt = liveQuiz();
    if (!currentAttempt) return;
    setConfirmFinish(false);
    persist(getSimuladoSnapshot().outcomes, jumpToQuestion(currentAttempt, index));
  }

  function finish() {
    const currentAttempt = liveQuiz();
    if (!currentAttempt) return;
    const graded = gradeAttempt(cases, currentAttempt);
    setConfirmFinish(false);
    setHome(false);
    persist(mergeOutcomes(getSimuladoSnapshot().outcomes, graded.items), { ...currentAttempt, phase: "results" });
  }

  function clearHistory() {
    setConfirmReset(false);
    setConfirmFinish(false);
    setPendingMode(null);
    setHome(true);
    setNotice(wipeSimulado() ? null : "Não foi possível apagar o histórico neste aparelho.");
  }

  useEffect(() => {
    if (!quiz || confirmFinish) return;
    function onKey(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || target.isContentEditable) return;
      }
      const live = getSimuladoSnapshot().attempt;
      if (!live || live.phase !== "quiz") return;
      if (event.key === "ArrowRight") {
        if (live.index >= live.caseIds.length - 1) return;
        event.preventDefault();
        setNotice(commitSimulado(getSimuladoSnapshot().outcomes, moveQuestion(live, 1)) ? null : saveWarning);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setNotice(commitSimulado(getSimuladoSnapshot().outcomes, moveQuestion(live, -1)) ? null : saveWarning);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quiz, confirmFinish]);

  const questionKey = quiz && !confirmFinish ? `${quiz.index}:${quiz.caseIds.join("-")}` : "";
  const timerKey = quiz && quiz.timing !== "off" ? `${quiz.timing}:${quiz.caseIds.join(",")}` : "";

  useEffect(() => {
    if (!questionKey) return;
    document.getElementById("enunciado")?.focus();
  }, [questionKey]);

  useEffect(() => {
    if (!timerKey) return;
    let last = Date.now();
    let paused = document.hidden;

    function flush() {
      const now = Date.now();
      const delta = now - last;
      last = now;
      if (paused || delta < 250) return;
      const snapshot = getSimuladoSnapshot();
      const live = snapshot.attempt;
      if (!live || live.phase !== "quiz" || `${live.timing}:${live.caseIds.join(",")}` !== timerKey) return;
      setNotice(commitSimulado(snapshot.outcomes, { ...live, elapsedMs: live.elapsedMs + delta }) ? null : saveWarning);
    }

    const id = window.setInterval(flush, 1000);
    function onVisibility() {
      if (document.hidden) {
        paused = false;
        flush();
        paused = true;
      } else {
        paused = false;
        last = Date.now();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
      paused = false;
      flush();
    };
  }, [timerKey]);

  if (!stored.ready) {
    return (
      <main id="conteudo-principal" className="mx-auto w-full min-w-0 max-w-lg overflow-x-clip px-4 py-8">
        <h1 className="font-serif text-[1.75rem] leading-tight text-navy">Mini-simulado de treino</h1>
        <p className="mt-3 text-base text-muted">Carregando.</p>
      </main>
    );
  }

  return (
    <main
      id="conteudo-principal"
      className="mx-auto w-full min-w-0 max-w-lg overflow-x-clip px-4 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
    >
      {quiz && current ? (
        <Quiz
          attempt={quiz}
          stem={current.stem}
          options={current.options}
          confirmFinish={confirmFinish}
          notice={notice}
          onHome={() => {
            setConfirmFinish(false);
            setHome(true);
          }}
          onSelect={selectLetter}
          onFlag={flagQuestion}
          onPrev={() => go(-1)}
          onNext={() => go(1)}
          onJump={goTo}
          onAskFinish={() => setConfirmFinish(true)}
          onCancelFinish={() => setConfirmFinish(false)}
          onFinish={finish}
        />
      ) : results ? (
        <Results
          cases={cases}
          attempt={results}
          errorCount={errorCount}
          size={size}
          timing={timing}
          notice={notice}
          confirmReset={confirmReset}
          onSize={setSize}
          onTiming={setTiming}
          onStart={askStart}
          onHome={() => setHome(true)}
          onAskReset={() => setConfirmReset(true)}
          onCancelReset={() => setConfirmReset(false)}
          onReset={clearHistory}
        />
      ) : (
        <Setup
          size={size}
          timing={timing}
          errorCount={errorCount}
          paused={Boolean(attempt?.phase === "quiz")}
          notice={notice}
          confirmReset={confirmReset}
          pendingMode={pendingMode}
          onSize={setSize}
          onTiming={setTiming}
          onResume={() => {
            setPendingMode(null);
            setHome(false);
          }}
          onStart={askStart}
          onConfirmPending={() => {
            if (pendingMode) start(pendingMode);
          }}
          onCancelPending={() => setPendingMode(null)}
          onAskReset={() => {
            setPendingMode(null);
            setConfirmReset(true);
          }}
          onCancelReset={() => setConfirmReset(false)}
          onReset={clearHistory}
        />
      )}
    </main>
  );
}

function Setup({
  size,
  timing,
  errorCount,
  paused,
  notice,
  confirmReset,
  pendingMode,
  onSize,
  onTiming,
  onResume,
  onStart,
  onConfirmPending,
  onCancelPending,
  onAskReset,
  onCancelReset,
  onReset,
}: {
  size: SimuladoSize;
  timing: TimingMode;
  errorCount: number;
  paused: boolean;
  notice: string | null;
  confirmReset: boolean;
  pendingMode: SimuladoMode | null;
  onSize: (size: SimuladoSize) => void;
  onTiming: (timing: TimingMode) => void;
  onResume: () => void;
  onStart: (mode: SimuladoMode) => void;
  onConfirmPending: () => void;
  onCancelPending: () => void;
  onAskReset: () => void;
  onCancelReset: () => void;
  onReset: () => void;
}) {
  return (
    <div className="grid gap-5">
      <header>
        <h1 className="font-serif text-[1.75rem] leading-tight text-navy">Mini-simulado de treino</h1>
        <p className="mt-2 text-base leading-7 text-ink">
          Treine como na prova: resolva casos clínicos sem pistas e confira seu desempenho só no final.
        </p>
      </header>

      {paused ? (
        <section className="grid gap-3 rounded-2xl border border-line bg-white p-4" aria-labelledby="treino-andamento">
          <p id="treino-andamento" className="text-base leading-7 text-ink">
            Há um treino em andamento.
          </p>
          <button type="button" className={primaryButton} onClick={onResume}>
            Continuar
          </button>
        </section>
      ) : null}

      <SizePicker size={size} onSize={onSize} />
      <TimingPicker timing={timing} onTiming={onTiming} />

      <div className="grid gap-3">
        <button type="button" className={startButton} onClick={() => onStart("mixed")}>
          Começar
        </button>
        {errorCount > 0 ? (
          <div className="grid gap-2">
            <p className="text-sm leading-6 text-muted">{errorCountLabel(errorCount)}</p>
            <button type="button" className={redoButton} onClick={() => onStart("errors")}>
              Refazer meus erros
            </button>
          </div>
        ) : (
          <p className="text-base leading-7 text-ink">Você ainda não tem erros para refazer.</p>
        )}
      </div>

      {pendingMode ? (
        <ConfirmBox
          id="confirmar-descarte"
          text="Começar outro apaga o treino em andamento."
          confirmLabel="Começar outro"
          onConfirm={onConfirmPending}
          onCancel={onCancelPending}
        />
      ) : null}

      <p className="text-sm leading-6 text-muted">{bankNote}</p>
      {notice ? <p className="text-sm leading-6 text-ink" role="status">{notice}</p> : null}
      <ResetControl confirm={confirmReset} onAsk={onAskReset} onCancel={onCancelReset} onReset={onReset} />
    </div>
  );
}

function Quiz({
  attempt,
  stem,
  options,
  confirmFinish,
  notice,
  onHome,
  onSelect,
  onFlag,
  onPrev,
  onNext,
  onJump,
  onAskFinish,
  onCancelFinish,
  onFinish,
}: {
  attempt: AttemptState;
  stem: string;
  options: ClinicalCase["options"];
  confirmFinish: boolean;
  notice: string | null;
  onHome: () => void;
  onSelect: (letter: Letter) => void;
  onFlag: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
  onAskFinish: () => void;
  onCancelFinish: () => void;
  onFinish: () => void;
}) {
  const position = attempt.index + 1;
  const selected = attempt.answers[String(attempt.caseIds[attempt.index])] ?? null;
  const flagged = attempt.flagged.includes(attempt.caseIds[attempt.index] ?? -1);
  const answered = attempt.caseIds.filter((id) => attempt.answers[String(id)]).length;
  const reviewCount = attempt.flagged.length;
  const blanks = blankPositions(attempt);
  const last = attempt.index >= attempt.caseIds.length - 1;
  const [showProgress, setShowProgress] = useState(true);

  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-3">
        <button type="button" className="min-h-12 shrink-0 rounded-full px-1 text-base font-semibold text-navy underline underline-offset-4" onClick={onHome}>
          Início
        </button>
        <p className="min-w-0 text-right text-base font-semibold text-navy">
          Questão {position} de {attempt.caseIds.length}
          {attempt.timing === "visible" ? (
            <span className="mt-0.5 block tabular-nums" role="timer">
              {formatDuration(attempt.elapsedMs)}
            </span>
          ) : null}
          <span className="mt-0.5 block text-sm font-semibold text-ink">
            {answeredLabel(answered)}
            {reviewCount > 0 ? ` · ${reviewLabel(reviewCount)}` : ""}
          </span>
        </p>
      </div>

      {confirmFinish ? (
        <ConfirmBox
          id="confirmar-final"
          text={finishMessage(blanks)}
          confirmLabel="Finalizar"
          cancelLabel="Voltar às questões"
          onConfirm={onFinish}
          onCancel={onCancelFinish}
        />
      ) : (
        <>
          <article id="enunciado" tabIndex={-1} className="rounded-2xl border border-line bg-white p-4 outline-none">
            <p className="text-lg leading-relaxed break-words text-ink">{stem}</p>
          </article>

          <div className="grid gap-2" role="group" aria-label="Alternativas">
            {options.map((option) => {
              const pressed = selected === option.letter;
              return (
                <button
                  key={option.letter}
                  type="button"
                  aria-pressed={pressed}
                  className={`flex w-full min-h-12 items-start gap-3 rounded-2xl border px-3 py-3 text-left text-base leading-7 ${
                    pressed ? "border-navy bg-white" : "border-line bg-white"
                  }`}
                  onClick={() => onSelect(option.letter)}
                >
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                      pressed ? "bg-navy text-white" : "bg-paper text-navy"
                    }`}
                  >
                    {option.letter}
                  </span>
                  <span className="min-w-0 break-words">{option.text}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            aria-pressed={flagged}
            className={flagged ? secondaryButton : quietButton}
            onClick={onFlag}
          >
            {flagged ? "Marcada para revisar" : "Marcar para revisar"}
          </button>

          {last ? (
            <button type="button" className={quietButton} onClick={onPrev} disabled={attempt.index === 0}>
              Voltar
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={quietButton} onClick={onPrev} disabled={attempt.index === 0}>
                Voltar
              </button>
              <button type="button" className={quietButton} onClick={onNext}>
                Avançar
              </button>
            </div>
          )}

          <button
            type="button"
            className={`${primaryButton}${last && selected ? " finalizar-nudge" : ""}`}
            onClick={onAskFinish}
          >
            Finalizar
          </button>
        </>
      )}
      {notice ? <p className="text-sm leading-6 text-ink" role="status">{notice}</p> : null}
      <div className="grid justify-items-start gap-1">
        <button
          type="button"
          className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
          aria-expanded={showProgress}
          onClick={() => setShowProgress((open) => !open)}
        >
          {showProgress ? "Esconder progresso" : "Mostrar progresso"}
        </button>
        {showProgress ? <QuestionMap attempt={attempt} onJump={onJump} /> : null}
      </div>
    </div>
  );
}

function Results({
  cases,
  attempt,
  errorCount,
  size,
  timing,
  notice,
  confirmReset,
  onSize,
  onTiming,
  onStart,
  onHome,
  onAskReset,
  onCancelReset,
  onReset,
}: {
  cases: ClinicalCase[];
  attempt: AttemptState;
  errorCount: number;
  size: SimuladoSize;
  timing: TimingMode;
  notice: string | null;
  confirmReset: boolean;
  onSize: (size: SimuladoSize) => void;
  onTiming: (timing: TimingMode) => void;
  onStart: (mode: SimuladoMode) => void;
  onHome: () => void;
  onAskReset: () => void;
  onCancelReset: () => void;
  onReset: () => void;
}) {
  const grade = gradeAttempt(cases, attempt);

  return (
    <div className="grid gap-5">
      <button
        type="button"
        className="justify-self-start text-base font-semibold text-navy underline underline-offset-4"
        onClick={onHome}
      >
        Voltar ao início
      </button>
      <header>
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-serif text-[1.75rem] leading-tight text-navy">Resultado</h1>
          <ScoreMark correct={grade.correct} total={grade.total} />
        </div>
        <p className="mt-2 font-serif text-4xl text-navy">
          {grade.correct} de {grade.total}
        </p>
        <ScoreMessage correct={grade.correct} total={grade.total} />
        {grade.blank > 0 ? (
          <p className="mt-1 text-base leading-7 text-ink">{blankLabel(grade.blank)}</p>
        ) : null}
        {attempt.timing !== "off" ? (
          <p className="mt-1 text-base leading-7 text-ink">Tempo {formatDuration(attempt.elapsedMs)}</p>
        ) : null}
        {notice ? (
          <p className="mt-3 text-sm leading-6 text-ink" role="status">
            {notice}
          </p>
        ) : null}
      </header>

      <section className="rounded-2xl border border-line bg-white p-4" aria-labelledby="por-area">
        <h2 id="por-area" className="text-lg font-semibold text-navy">
          Por área
        </h2>
        <ul className="mt-3 grid gap-2">
          {grade.byArea.map((area) => (
            <li key={area.area} className="flex min-w-0 items-baseline justify-between gap-3 text-base leading-7 text-ink">
              <span className="min-w-0 break-words">{areaLabel(area.area)}</span>
              <span className="shrink-0 font-semibold text-navy">
                {area.correct} de {area.total}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4">
        {gabaritoOrder(grade.items).map(({ item: row, question }) => (
          <article key={row.caseItem.id} className="grid gap-3 rounded-2xl border border-line bg-white p-4">
            <h2 className="text-base font-semibold text-navy">
              Questão {question} · {caseLabel(row.caseItem.id)} · {volumeLabel(row.caseItem.volume)}
            </h2>
            <p className="text-base font-semibold leading-7 break-words text-ink">{row.caseItem.title}</p>
            <p className="text-sm leading-6 break-words text-muted">
              {areaLabel(row.caseItem.area)} · {row.caseItem.topic}
            </p>
            {row.flagged ? <p className="text-sm font-semibold text-navy">Marcada para revisar</p> : null}
            <p className="text-base leading-7 break-words text-ink">{row.caseItem.stem}</p>
            {row.outcome === "blank" ? <p className="text-base font-semibold text-ink">Em branco.</p> : null}
            <ol className="grid gap-2">
              {row.caseItem.options.map((option) => {
                const picked = option.letter === row.studentLetter;
                const right = option.letter === row.caseItem.correctLetter;
                const status = optionStatus(picked, right);
                return (
                  <li
                    key={option.letter}
                    className={`rounded-2xl border px-3 py-3 ${
                      right ? "border-green bg-green-soft" : picked ? "border-red bg-red-soft" : "border-line bg-white"
                    }`}
                  >
                    <p className="text-base leading-7 break-words text-ink">
                      <span className="font-semibold text-navy">{option.letter}. </span>
                      {option.text}
                    </p>
                    {status ? (
                      <p className={`mt-1 text-sm font-semibold ${picked && !right ? "text-red" : "text-navy"}`}>{status}</p>
                    ) : null}
                    {option.whyWrong ? (
                      <p className="mt-1 text-sm leading-6 break-words text-muted">{option.whyWrong}</p>
                    ) : null}
                  </li>
                );
              })}
            </ol>
            <div>
              <h3 className="text-sm font-semibold text-navy">Resolução</h3>
              <p className="mt-1 text-base leading-7 break-words text-ink">{row.caseItem.reasoning}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy">Regra</h3>
              <p className="mt-1 text-base leading-7 break-words text-ink">{row.caseItem.examRule}</p>
            </div>
          </article>
        ))}
      </div>

      <SizePicker size={size} onSize={onSize} />
      <TimingPicker timing={timing} onTiming={onTiming} />
      <div className="grid gap-3">
        <button type="button" className={startButton} onClick={() => onStart("mixed")}>
          Treinar de novo
        </button>
        {errorCount > 0 ? (
          <div className="grid gap-2">
            <p className="text-sm leading-6 text-muted">{errorCountLabel(errorCount)}</p>
            <button type="button" className={redoButton} onClick={() => onStart("errors")}>
              Refazer meus erros
            </button>
          </div>
        ) : (
          <p className="text-base leading-7 text-ink">Você ainda não tem erros para refazer.</p>
        )}
      </div>
      <p className="text-sm leading-6 text-muted">{bankNote}</p>
      <ResetControl confirm={confirmReset} onAsk={onAskReset} onCancel={onCancelReset} onReset={onReset} />
    </div>
  );
}

const timingChoices: { id: TimingMode; label: string }[] = [
  { id: "off", label: "Sem tempo" },
  { id: "visible", label: "Com tempo" },
  { id: "hidden", label: "Com tempo escondido" },
];

function TimingPicker({ timing, onTiming }: { timing: TimingMode; onTiming: (timing: TimingMode) => void }) {
  return (
    <fieldset className="grid gap-2 border-0 p-0">
      <legend className="text-sm font-semibold text-navy">Tempo</legend>
      <div className="grid gap-2">
        {timingChoices.map((option) => {
          const selected = option.id === timing;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              className={`min-h-12 rounded-full border px-4 text-base font-semibold ${
                selected ? "border-navy bg-navy text-white" : "border-line bg-white text-ink"
              }`}
              onClick={() => onTiming(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function QuestionMap({ attempt, onJump }: { attempt: AttemptState; onJump: (index: number) => void }) {
  return (
    <div className="flex max-w-full flex-wrap gap-0.5" role="group" aria-label="Questões">
      {attempt.caseIds.map((id, index) => {
        const answered = Boolean(attempt.answers[String(id)]);
        const review = attempt.flagged.includes(id);
        const current = index === attempt.index;
        const fill = review ? "bg-[#2f6cb5]" : answered ? "bg-green" : "border border-line bg-white";
        const state = review ? "para revisar" : answered ? "respondida" : "em branco";
        return (
          <button
            key={`${id}-${index}`}
            type="button"
            aria-current={current ? "step" : undefined}
            aria-label={`Questão ${index + 1}, ${state}`}
            className="grid h-8 w-8 shrink-0 place-items-center"
            onClick={() => onJump(index)}
          >
            <span
              className={`h-3 w-3 rounded-full ${fill}${current ? " outline outline-2 outline-offset-2 outline-navy" : ""}`}
            />
          </button>
        );
      })}
    </div>
  );
}

function SizePicker({ size, onSize }: { size: SimuladoSize; onSize: (size: SimuladoSize) => void }) {
  return (
    <fieldset className="grid gap-2 border-0 p-0">
      <legend className="text-sm font-semibold text-navy">Quantas questões</legend>
      <div className="grid grid-cols-3 gap-2">
        {SIMULADO_SIZES.map((option) => {
          const selected = option === size;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              className={`min-h-12 rounded-full border text-base font-semibold ${
                selected ? "border-navy bg-navy text-white" : "border-line bg-white text-ink"
              }`}
              onClick={() => onSize(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ConfirmBox({
  id,
  text,
  confirmLabel,
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: {
  id: string;
  text: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    document.getElementById(id)?.focus();
  }, [id]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="rounded-2xl border border-line bg-white p-4" role="alertdialog" aria-labelledby={id}>
      <p id={id} tabIndex={-1} className="text-base leading-7 text-ink outline-none">
        {text}
      </p>
      <div className="mt-3 grid gap-2">
        <button type="button" className={primaryButton} onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button type="button" className={secondaryButton} onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}

function ResetControl({
  confirm,
  onAsk,
  onCancel,
  onReset,
}: {
  confirm: boolean;
  onAsk: () => void;
  onCancel: () => void;
  onReset: () => void;
}) {
  if (!confirm) {
    return (
      <button type="button" className="justify-self-start py-3 text-sm font-semibold text-navy underline underline-offset-4" onClick={onAsk}>
        Apagar histórico
      </button>
    );
  }

  return (
    <ConfirmBox
      id="confirmar-apagar"
      text="Apagar o histórico neste aparelho? O treino em andamento também sai. Não há cópia em outro lugar."
      confirmLabel="Apagar"
      onConfirm={onReset}
      onCancel={onCancel}
    />
  );
}

function errorCountLabel(count: number): string {
  return count === 1 ? "1 questão sem acerto." : `${count} questões sem acerto.`;
}

function answeredLabel(count: number): string {
  if (count === 0) return "Nenhuma respondida";
  if (count === 1) return "1 respondida";
  return `${count} respondidas`;
}

const scoreToneClass: Record<"red" | "orange" | "yellow" | "green", string> = {
  red: "text-red",
  orange: "text-mark-orange",
  yellow: "text-mark-yellow",
  green: "text-green",
};

function ScoreMark({ correct, total }: { correct: number; total: number }) {
  const score = scoreFeedback(correct, total);
  const tone = scoreToneClass[score.tone];
  return (
    <div className={`flex shrink-0 items-center gap-3 ${tone}`}>
      <p className="font-serif text-4xl leading-none" aria-label={`${score.percent}% de acerto`}>
        {score.percent}%
      </p>
      <ScoreRing percent={score.percent} />
    </div>
  );
}

function ScoreMessage({ correct, total }: { correct: number; total: number }) {
  const score = scoreFeedback(correct, total);
  return <p className={`mt-2 text-base font-semibold leading-7 ${scoreToneClass[score.tone]}`}>{score.message}</p>;
}

function ScoreRing({ percent }: { percent: number }) {
  const size = 68;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const length = 2 * Math.PI * radius;
  const filled = (percent / 100) * length;
  const center = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={center} cy={center} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-line" />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap={percent > 0 && percent < 100 ? "round" : "butt"}
        strokeDasharray={`${filled} ${length}`}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
}

function reviewLabel(count: number): string {
  return count === 1 ? "1 para revisar" : `${count} para revisar`;
}

function blankLabel(count: number): string {
  return count === 1 ? "1 em branco" : `${count} em branco`;
}

function finishMessage(positions: number[]): string {
  if (positions.length === 0) return "Finalizar e ver o resultado?";
  if (positions.length === 1) {
    return `A questão ${positions[0]} está em branco e não conta como acerto. Finalizar mesmo assim?`;
  }
  const listed = positions.length > 8 ? "" : ` (${joinAnd(positions.map(String))})`;
  return `${positions.length} questões estão em branco${listed} e não contam como acerto. Finalizar mesmo assim?`;
}

function joinAnd(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} e ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

function optionStatus(picked: boolean, right: boolean): string | null {
  if (picked && right) return "Sua resposta, correta";
  if (right) return "Correta";
  if (picked) return "Sua resposta";
  return null;
}
