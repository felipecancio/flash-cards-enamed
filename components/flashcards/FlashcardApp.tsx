"use client";

import { applyRating, buildReviewQueue, todayISO, type CardProgress } from "@/lib/flashcard-schedule";
import {
  getServerSoundSnapshot,
  getSoundSnapshot,
  playFlip,
  playRemembered,
  playRever,
  setSoundEnabled,
  subscribeSound,
} from "@/lib/flashcard-sound";
import { AREA_ORDER, areaLabel, type Flashcard, type FlashcardDeck } from "@/lib/flashcards";
import {
  commitProgress,
  getProgressSnapshot,
  getServerProgressSnapshot,
  subscribeProgress,
  wipeProgress,
  type StudySession,
} from "@/lib/flashcard-storage";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";

const BATCH = 10;

function knownIds(deck: FlashcardDeck, session: StudySession | null): StudySession | null {
  if (!session) return null;
  const ids = new Set(deck.cards.map((card) => card.id));
  if (session.ids.some((id) => !ids.has(id)) || session.rest.some((id) => !ids.has(id))) return null;
  return session;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function casePad(value: number) {
  return String(value).padStart(3, "0");
}

function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, getSoundSnapshot, getServerSoundSnapshot);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Som ligado" : "Som desligado"}
      onClick={() => setSoundEnabled(!on)}
      className={`min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold ${
        on ? "bg-navy/10 text-navy" : "text-muted"
      }`}
    >
      Som
    </button>
  );
}

export function FlashcardApp({ deck }: { deck: FlashcardDeck }) {
  const stored = useSyncExternalStore(subscribeProgress, getProgressSnapshot, getServerProgressSnapshot);
  const session = knownIds(deck, stored.session);
  const [panel, setPanel] = useState<"home" | "areas">("home");
  const [saveError, setSaveError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState("");

  const byId = useMemo(() => new Map(deck.cards.map((card) => [card.id, card])), [deck.cards]);
  const today = todayISO();
  const reviewCount = useMemo(
    () => buildReviewQueue(deck.cards, stored.states, today).length,
    [deck.cards, stored.states, today],
  );
  const areas = useMemo(() => {
    const present = new Set(deck.cards.map((card) => card.area));
    return AREA_ORDER.filter((item) => present.has(item));
  }, [deck.cards]);
  const begin = useCallback((cards: readonly Flashcard[], kind: StudySession["kind"], area: string, topic: string) => {
    const snap = getProgressSnapshot();
    const queue = buildReviewQueue(cards, snap.states, todayISO());
    if (queue.length === 0) {
      setNotice("Nada para revisar agora.");
      return;
    }
    setNotice("");
    setConfirmReset(false);
    const ids = queue.slice(0, BATCH).map((card) => card.id);
    const rest = queue.slice(BATCH).map((card) => card.id);
    setSaveError(
      !commitProgress(snap.states, {
        kind,
        area,
        topic,
        ids,
        rest,
        index: 0,
        revealed: false,
        done: false,
      }),
    );
  }, []);

  const reveal = useCallback(() => {
    const snap = getProgressSnapshot();
    const current = snap.session;
    if (!current || current.revealed || current.done) return;
    playFlip();
    setSaveError(!commitProgress(snap.states, { ...current, revealed: true }));
  }, []);

  const rate = useCallback((rating: "remembered" | "unsure") => {
    const snap = getProgressSnapshot();
    const current = snap.session;
    if (!current || !current.revealed || current.done) return;
    const id = current.ids[current.index];
    if (!id) return;
    const previous = snap.states[id];
    const result = applyRating(previous?.successes ?? 0, rating, todayISO());
    const states: Record<string, CardProgress> = {
      ...snap.states,
      [id]: {
        rating,
        due: result.due,
        successes: result.successes,
        seen: true,
        updatedAt: new Date().toISOString(),
      },
    };
    const nextIndex = current.index + 1;
    const done = nextIndex >= current.ids.length;
    setSaveError(
      !commitProgress(states, {
        ...current,
        index: done ? current.index : nextIndex,
        revealed: false,
        done,
      }),
    );
    if (rating === "remembered") playRemembered();
    else playRever();
  }, []);

  const more = useCallback(() => {
    const snap = getProgressSnapshot();
    const current = snap.session;
    if (!current || current.rest.length === 0) return;
    setSaveError(
      !commitProgress(snap.states, {
        ...current,
        ids: current.rest.slice(0, BATCH),
        rest: current.rest.slice(BATCH),
        index: 0,
        revealed: false,
        done: false,
      }),
    );
  }, []);

  const goHome = useCallback(() => {
    const snap = getProgressSnapshot();
    setPanel("home");
    setNotice("");
    setConfirmReset(false);
    setSaveError(!commitProgress(snap.states, null));
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const current = getProgressSnapshot().session;
      if (!current || current.done) return;
      if (!current.revealed && (event.key === "Enter" || event.key === " ")) {
        if (target?.closest("button, a, summary")) return;
        event.preventDefault();
        reveal();
        return;
      }
      if (!current.revealed) return;
      if (event.key === "1") {
        event.preventDefault();
        rate("remembered");
      } else if (event.key === "2") {
        event.preventDefault();
        rate("unsure");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rate, reveal]);

  if (!stored.ready) {
    return (
      <main id="conteudo-principal" className="mx-auto w-full max-w-lg px-4 py-8">
        <p className="text-lg text-muted">Carregando…</p>
      </main>
    );
  }

  const shell = "mx-auto flex w-full max-w-lg flex-col overflow-x-clip px-4 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]";

  if (session?.done) {
    const again = session.rest.length;
    return (
      <main id="conteudo-principal" className={shell}>
        <div className="flex items-center justify-between">
          <button type="button" onClick={goHome} className="min-h-11 text-sm font-semibold text-navy">
            Início
          </button>
          <SoundToggle />
        </div>
        <h1 className="mt-8 font-serif text-4xl text-navy">Sessão concluída</h1>
        <p className="mt-3 text-lg text-ink">
          {session.ids.length === 1 ? "1 cartão nesta leva." : `${session.ids.length} cartões nesta leva.`}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          {again > 0 ? (
            <button
              type="button"
              onClick={more}
              className="min-h-14 rounded-2xl bg-green px-4 text-lg font-semibold text-white hover:bg-green-hover"
            >
              {again >= BATCH ? "Mais 10 cartões" : again === 1 ? "Mais 1 cartão" : `Mais ${again} cartões`}
            </button>
          ) : null}
          <button
            type="button"
            onClick={goHome}
            className="min-h-14 rounded-2xl border-2 border-navy bg-white px-4 text-lg font-semibold text-navy"
          >
            Voltar ao início
          </button>
        </div>
        {saveError ? <p className="mt-4 text-sm text-muted">Não foi possível guardar neste navegador.</p> : null}
      </main>
    );
  }

  if (session) {
    const card = byId.get(session.ids[session.index]);
    if (!card) {
      return (
        <main id="conteudo-principal" className={shell}>
          <button type="button" onClick={goHome} className="min-h-11 text-sm font-semibold text-navy">
            Início
          </button>
          <p className="mt-6 text-lg text-ink">Este cartão não está mais disponível.</p>
        </main>
      );
    }
    const revealed = session.revealed;
    return (
      <main id="conteudo-principal" className={shell}>
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={goHome} className="min-h-11 text-sm font-semibold text-navy">
            Início
          </button>
          <p className="text-sm font-semibold text-muted">
            {session.index + 1} de {session.ids.length}
          </p>
          <SoundToggle />
        </div>
        <article
          key={card.id}
          className={`fc-card fc-enter mt-4 min-h-64 rounded-[1.75rem] border px-5 py-6 shadow-[0_14px_36px_rgba(12,35,64,0.08)] ${
            revealed ? "border-card-back-line bg-card-back" : "cursor-pointer border-card-face-line bg-card-face"
          }`}
          onClick={() => {
            if (!revealed) reveal();
          }}
        >
          <p className="text-lg leading-relaxed break-words text-ink">{card.front}</p>
          <div className={`fc-answer ${revealed ? "is-open" : ""}`}>
            <div className="overflow-hidden" inert={revealed ? undefined : true} aria-hidden={revealed ? undefined : true}>
              <div className={revealed ? "fc-reveal pt-5" : ""}>
                <p className="sr-only">Resposta</p>
                <p className="font-serif text-2xl leading-snug break-words text-navy">{card.answer}</p>
                <p className="mt-3 text-lg leading-relaxed break-words text-ink">{card.why}</p>
                <details className="fc-more mt-5 border-t border-card-back-line pt-3">
                  <summary className="min-h-11 cursor-pointer text-sm font-semibold text-muted">Caso completo</summary>
                  <p className="mt-2 text-sm text-ink">
                    Caso {casePad(card.caseId)} · Volume {pad(card.volume)}
                  </p>
                  <a
                    href={card.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-semibold break-words text-navy underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {card.source.title}
                  </a>
                </details>
              </div>
            </div>
          </div>
        </article>
        <div className="mt-4">
          {revealed ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => rate("remembered")}
                className="min-h-14 flex-1 rounded-2xl bg-green px-3 text-lg font-semibold text-white hover:bg-green-hover"
              >
                Lembrei
              </button>
              <button
                type="button"
                onClick={() => rate("unsure")}
                className="min-h-14 flex-1 rounded-2xl border-2 border-navy bg-white px-3 text-lg font-semibold text-navy"
              >
                Rever
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={reveal}
              className="min-h-14 w-full rounded-2xl bg-green px-4 text-lg font-semibold text-white hover:bg-green-hover"
            >
              Mostrar resposta
            </button>
          )}
        </div>
        {saveError ? <p className="mt-4 text-sm text-muted">Não foi possível guardar neste navegador.</p> : null}
      </main>
    );
  }

  return (
    <main id="conteudo-principal" className={shell}>
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-serif text-4xl leading-tight text-navy">Flashcards</h1>
        <SoundToggle />
      </div>
      {panel === "home" ? (
        <p className="mt-3 text-lg leading-relaxed text-ink">
          Revise decisões clínicas em cartões rápidos. Veja o cenário, pense na conduta e vire para conferir em segundos.
        </p>
      ) : null}

      {panel === "home" ? (
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            disabled={reviewCount === 0}
            onClick={() => begin(deck.cards, "review", "", "")}
            className="min-h-14 rounded-2xl bg-green px-4 text-lg font-semibold text-white hover:bg-green-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {reviewCount === 0 ? "Nada para revisar agora" : "Cards Aleatórios"}
          </button>
          <button
            type="button"
            onClick={() => {
              setNotice("");
              setPanel("areas");
            }}
            className="min-h-14 rounded-2xl border-2 border-navy bg-white px-4 text-lg font-semibold text-navy"
          >
            Escolher Área
          </button>
        </div>
      ) : null}

      {panel === "home" ? (
        <p className="mt-6 text-base leading-relaxed text-muted">
          Marque &quot;Lembrei&quot; pra mover o cartão para o fim da lista e &quot;Rever&quot; para ele aparecer de novo em breve.
        </p>
      ) : null}

      {panel === "areas" ? (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              setNotice("");
              setPanel("home");
            }}
            className="min-h-11 text-sm font-semibold text-navy"
          >
            Voltar
          </button>
          <h2 className="mt-2 font-serif text-3xl text-navy">Escolha a área</h2>
          {notice ? <p className="mt-3 text-base text-ink">{notice}</p> : null}
          <div className="mt-4 flex flex-col gap-3">
            {areas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() =>
                  begin(
                    deck.cards.filter((card) => card.area === area),
                    "theme",
                    area,
                    "",
                  )
                }
                className="min-h-14 rounded-2xl border border-line bg-white px-4 text-left text-lg font-semibold break-words text-navy"
              >
                {areaLabel(area)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {panel === "home" ? (
        <div className="mt-6">
          {confirmReset ? (
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-12 flex-1 rounded-2xl border border-line bg-white px-3 text-base font-semibold text-navy"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaveError(!wipeProgress());
                  setConfirmReset(false);
                }}
                className="min-h-12 flex-1 rounded-2xl bg-navy px-3 text-base font-semibold text-white"
              >
                Apagar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="mt-4 min-h-11 text-sm font-semibold text-muted underline"
            >
              Apagar progresso
            </button>
          )}
          {saveError ? <p className="mt-3 text-sm text-muted">Não foi possível guardar neste navegador.</p> : null}
        </div>
      ) : null}
    </main>
  );
}
