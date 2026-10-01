const SOUND_KEY = "enamed-200-flashcards-sound";

let enabled = false;
let loaded = false;
let ctx: AudioContext | null = null;
const listeners = new Set<() => void>();

function publish() {
  for (const listener of listeners) listener();
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSoundSnapshot(): boolean {
  if (!loaded && typeof window !== "undefined") {
    try {
      enabled = window.localStorage.getItem(SOUND_KEY) === "1";
    } catch {
      enabled = false;
    }
    loaded = true;
  }
  return enabled;
}

export function getServerSoundSnapshot(): boolean {
  return false;
}

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  loaded = true;
  try {
    window.localStorage.setItem(SOUND_KEY, on ? "1" : "0");
  } catch {
    /* a preferência fica só nesta visita se o navegador recusar */
  }
  if (on) audioContext();
  publish();
}

function tone(
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  slideTo?: number,
) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(gainValue, 0.0002), start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function play(notes: (context: AudioContext, start: number) => void) {
  if (!enabled) return;
  const context = audioContext();
  if (!context) return;
  notes(context, context.currentTime);
}

export function playFlip() {
  play((context, start) => {
    tone(context, 494, start, 0.07, 0.026);
    tone(context, 659, start + 0.04, 0.08, 0.02);
  });
}

export function playRemembered() {
  play((context, start) => {
    tone(context, 523, start, 0.12, 0.028, 698);
  });
}

export function playRever() {
  play((context, start) => {
    tone(context, 392, start, 0.11, 0.024);
  });
}
