/**
 * Tiny WebAudio "poster machine" — synthesized ticks only, zero assets.
 * Off by default; the first explicit gesture initializes the context.
 */
export type SoundKind = "hover" | "click" | "open" | "close" | "switch" | "stamp" | "tick" | "whoosh" | "ignite";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
let noiseBuffer: AudioBuffer | null = null;

function ensure(): AudioContext | null {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noise(c: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const len = c.sampleRate * 0.4;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  noiseBuffer = buf;
  return buf;
}

function blip(freq: number, dur: number, type: OscillatorType, gain: number, detune = 0) {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 4200;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  osc.detune.value = detune;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0006, t0 + dur);
  osc.connect(filter);
  filter.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

function burst(gain: number, dur = 0.22, highpass = 300) {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noise(c);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = highpass;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0005, t0 + dur);
  src.connect(hp);
  hp.connect(g);
  g.connect(master);
  src.start(t0);
  src.stop(t0 + dur);
}

let hum: { osc: OscillatorNode[]; gain: GainNode } | null = null;

function startHum() {
  const c = ensure();
  if (!c || !master || hum) return;
  const gain = c.createGain();
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(0.05, c.currentTime + 2.2);
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 380;
  const oscs = [55, 82.5, 110.3].map((f, i) => {
    const osc = c.createOscillator();
    osc.type = i === 2 ? "triangle" : "sine";
    osc.frequency.value = f;
    osc.detune.value = i * 7 - 7;
    osc.connect(filter);
    osc.start();
    return osc;
  });
  filter.connect(gain);
  gain.connect(master);
  hum = { osc: oscs, gain };
}

function stopHum() {
  const c = ctx;
  if (!hum || !c) return;
  const { osc, gain } = hum;
  gain.gain.cancelScheduledValues(c.currentTime);
  gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.5);
  osc.forEach((o) => o.stop(c.currentTime + 0.6));
  hum = null;
}

export const sound = {
  get enabled() {
    return enabled;
  },
  setEnabled(next: boolean) {
    enabled = next;
    if (next) {
      ensure();
      blip(520, 0.18, "triangle", 0.22);
      burst(0.1, 0.16, 900);
      startHum();
      window.setTimeout(() => sound.play("ignite"), 260);
    } else {
      stopHum();
    }
  },
  play(kind: SoundKind) {
    if (!enabled) return;
    switch (kind) {
      case "hover":
        blip(1180, 0.045, "sine", 0.1);
        break;
      case "click":
        blip(420, 0.09, "triangle", 0.2);
        burst(0.09, 0.1, 600);
        break;
      case "open":
        blip(300, 0.22, "sine", 0.22, -40);
        blip(600, 0.3, "triangle", 0.1, 30);
        burst(0.06, 0.3, 400);
        break;
      case "close":
        blip(260, 0.2, "sine", 0.16, 60);
        break;
      case "switch":
        blip(880, 0.06, "square", 0.06);
        blip(1320, 0.09, "sine", 0.09);
        break;
      case "stamp":
        blip(180, 0.24, "sine", 0.26, 20);
        burst(0.16, 0.18, 260);
        break;
      case "tick":
        blip(2400, 0.02, "sine", 0.05);
        break;
      case "whoosh":
        burst(0.11, 0.42, 120);
        blip(150, 0.34, "sine", 0.1, -30);
        break;
      case "ignite":
        blip(90, 0.5, "sine", 0.28, -12);
        blip(180, 0.42, "triangle", 0.14, 6);
        burst(0.14, 0.5, 200);
        break;
    }
  },
};

/** Delegated hover/click ticks for every interactive node; cheap and global. */
export function bindSoundToDom(): () => void {
  let lastHover: EventTarget | null = null;
  const onOver = (e: Event) => {
    if (!enabled) return;
    const target = e.target as HTMLElement | null;
    const hit = target?.closest("a,button,[role='tab'],input,[data-sound]");
    if (!hit || hit === lastHover) return;
    lastHover = hit;
    sound.play("hover");
  };
  const onDown = (e: Event) => {
    if (!enabled) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("a,button,[role='tab'],[data-sound]")) sound.play("click");
  };
  document.addEventListener("pointerover", onOver, { passive: true });
  document.addEventListener("pointerdown", onDown, { passive: true });
  return () => {
    document.removeEventListener("pointerover", onOver);
    document.removeEventListener("pointerdown", onDown);
  };
}
