/**
 * Web Audio API Sound Synthesizer for DC Smart
 * Pure synthesis with zero external dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const val = localStorage.getItem("rovy_sounds_enabled");
  return val === null || val === "1";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("rovy_sounds_enabled", enabled ? "1" : "0");
}

export function playSound(
  type: "click" | "order" | "chat" | "alert" | "success" | "kitchen" | "alarm" | "add" | "cash" | "pop" | "trash"
): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== "running") return;

  const patterns: Record<string, { tones: [number, number, number][]; wave: OscillatorType }> = {
    click: { tones: [[620, 0, 0.045]], wave: "sine" },
    add: { tones: [[523.25, 0, 0.06], [659.25, 0.06, 0.08]], wave: "sine" },
    pop: { tones: [[784, 0, 0.04]], wave: "sine" },
    trash: { tones: [[350, 0, 0.08], [220, 0.08, 0.12]], wave: "sawtooth" },
    cash: {
      tones: [
        [587.33, 0, 0.08],
        [880, 0.08, 0.12],
        [1174.66, 0.18, 0.22],
      ],
      wave: "triangle",
    },
    order: {
      tones: [
        [440, 0, 0.09],
        [554.37, 0.09, 0.09],
        [659.25, 0.18, 0.12],
        [880, 0.3, 0.24],
      ],
      wave: "triangle",
    },
    chat: {
      tones: [
        [523.25, 0, 0.07],
        [659.25, 0.07, 0.1],
      ],
      wave: "sine",
    },
    alert: {
      tones: [
        [880, 0, 0.1],
        [440, 0.1, 0.12],
      ],
      wave: "sawtooth",
    },
    success: {
      tones: [
        [523.25, 0, 0.08],
        [659.25, 0.08, 0.08],
        [783.99, 0.16, 0.16],
      ],
      wave: "sine",
    },
    kitchen: {
      tones: [
        [740, 0, 0.12],
        [988, 0.12, 0.15],
      ],
      wave: "sine",
    },
    alarm: {
      tones: [
        [1000, 0, 0.12],
        [600, 0.12, 0.15],
        [1000, 0.27, 0.12],
      ],
      wave: "square",
    },
  };

  const pattern = patterns[type] || patterns.click;

  pattern.tones.forEach(([freq, startOffset, duration]) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = pattern.wave;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);

      gain.gain.setValueAtTime(0.18, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + startOffset + duration
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration);
    } catch {
      // Audio context might be restricted
    }
  });
}
