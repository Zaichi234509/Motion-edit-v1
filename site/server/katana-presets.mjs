// src/higgsfield/presets.ts
var KATANA_PRESETS = [
  {
    id: "crash-zoom",
    name: "Crash Zoom",
    tagline: "Snap in from wide to face \u2014 the thumb-stopper",
    camera: "hard zoom 1.0 \u2192 1.9 over 8 frames, then settle",
    strength: 0.85,
    seconds: 4,
    creditsPerSec: 2,
    beat: { motion: "punch", size: 54, ms: 3e3, sparks: 3, tone: "violet", camMs: 3e3 },
    keywords: ["hook", "stop scroll", "impact", "reveal"]
  },
  {
    id: "bullet-time",
    name: "Bullet Time",
    tagline: "Freeze the frame, orbit the subject",
    camera: "arc 120\xB0 around subject, 0.25\xD7 time scale",
    strength: 0.7,
    seconds: 6,
    creditsPerSec: 3,
    beat: { motion: "rise", size: 44, ms: 3600, sparks: 5, tone: "lime", camMs: 3600 },
    keywords: ["hero", "product", "matrix", "freeze"]
  },
  {
    id: "fpv-dive",
    name: "FPV Dive",
    tagline: "Drone fall through the geometry",
    camera: "pitch \u221270\xB0, forward push, FOV 95 \u2192 60",
    strength: 0.9,
    seconds: 8,
    creditsPerSec: 4,
    beat: { motion: "wipe", size: 48, ms: 3400, sparks: 2, tone: "coral", camMs: 3400 },
    keywords: ["drone", "scale", "environment", "map"]
  },
  {
    id: "super-dolly",
    name: "Super Dolly",
    tagline: "Impossible rail shot through the diagram",
    camera: "linear dolly Z+, constant velocity, no ease",
    strength: 0.6,
    seconds: 5,
    creditsPerSec: 3,
    beat: { motion: "rise", size: 40, ms: 3400, sparks: 3, tone: "violet", camMs: 3400 },
    keywords: ["diagram", "explain", "pipeline", "depth"]
  },
  {
    id: "whip-pan",
    name: "Whip Pan",
    tagline: "Hard left-to-right swipe between beats",
    camera: "yaw 90\xB0 in 6 frames with 2-frame motion blur",
    strength: 0.8,
    seconds: 3,
    creditsPerSec: 2,
    beat: { motion: "wipe", size: 50, ms: 2600, sparks: 2, tone: "lime", camMs: 2600 },
    keywords: ["transition", "cut", "fast", "before after"]
  },
  {
    id: "orbit-reveal",
    name: "Orbit Reveal",
    tagline: "Slow 180\xB0 orbit that reveals the logo",
    camera: "azimuth 0 \u2192 180\xB0, ease-out, subject locked centre",
    strength: 0.5,
    seconds: 7,
    creditsPerSec: 3,
    beat: { motion: "punch", size: 56, ms: 3200, sparks: 6, tone: "lime", camMs: 3200 },
    keywords: ["logo", "brand", "wordmark", "cta"]
  },
  {
    id: "static-push",
    name: "Static Push",
    tagline: "The quiet one \u2014 6% push, nothing else moves",
    camera: "scale 1.06 \u2192 1.00, dead centre, no rotation",
    strength: 0.3,
    seconds: 5,
    creditsPerSec: 1,
    beat: { motion: "rise", size: 42, ms: 3400, sparks: 0, tone: "violet", camMs: 3800 },
    keywords: ["proof", "screenshot", "ui", "evidence", "calm"]
  },
  {
    id: "glitch-cut",
    name: "Glitch Cut",
    tagline: "Chromatic tear between two states",
    camera: "3-frame RGB split + 1-frame offset, hard cut in",
    strength: 0.75,
    seconds: 3,
    creditsPerSec: 2,
    beat: { motion: "punch", size: 46, ms: 2800, sparks: 4, tone: "coral", camMs: 2800 },
    keywords: ["glitch", "transition", "error", "before after"]
  }
];
var PRESET_BY_ID = Object.fromEntries(KATANA_PRESETS.map((p) => [p.id, p]));
function presetToScene(preset, copy, toneClass = {
  violet: "accent-violet",
  lime: "accent-lime",
  coral: "accent-coral"
}) {
  const sparks = preset.beat.sparks === 0 ? void 0 : Array.from({ length: preset.beat.sparks }, (_, i) => ({
    x: 18 + i * 37 % 64,
    y: 26 + i * 23 % 44,
    s: 12 + i * 7 % 14,
    delay: Math.round(i * 15) / 100
  }));
  return {
    id: `katana-${preset.id}`,
    label: preset.name,
    ms: preset.beat.ms,
    kicker: copy.kicker ?? `katana \xB7 ${preset.id}`,
    head: copy.head,
    accents: { [copy.head]: toneClass[preset.beat.tone] },
    sub: copy.sub,
    sparks,
    motion: preset.beat.motion,
    size: preset.beat.size,
    align: "center"
  };
}
function estimateCredits(preset) {
  return Math.round(preset.seconds * preset.creditsPerSec);
}
function suggestPreset(brief) {
  const words = brief.toLowerCase().match(/[a-z]+/g) ?? [];
  let best = KATANA_PRESETS[0];
  let bestScore = -1;
  for (const p of KATANA_PRESETS) {
    const score = p.keywords.reduce((acc, k) => acc + (words.includes(k) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  return best;
}
export {
  KATANA_PRESETS,
  PRESET_BY_ID,
  estimateCredits,
  presetToScene,
  suggestPreset
};
