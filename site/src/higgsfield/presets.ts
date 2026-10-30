/**
 * KATANA preset catalog
 * =====================
 * In the reference reel, "Katana" is a Higgsfield **preset / motion** — a named
 * camera + motion recipe you pick instead of typing a prompt. This module is the
 * local, credit-free mirror of that idea:
 *
 *   preset  →  { camera move, motion strength, pacing }
 *   preset  →  { Glowkit scene params }        ← so it visibly drives the site
 *
 * The live catalog can be pulled from Higgsfield itself:
 *   GET /api/hf/motions   →  HigsfieldClient.getMotions()
 *
 * Local presets never spend credits. `remoteMotionId` is the field to fill in
 * once you have pulled the real catalog against your own account.
 */

import type { Scene, Tone } from '../scenes'

type AccentClass = 'accent-violet' | 'accent-lime' | 'accent-coral' | 'hot'

export interface KatanaPreset {
  id: string
  name: string
  tagline: string
  /** what the camera does — this is what makes these presets recognisable */
  camera: string
  /** 0..1, how much of the effect to dial in */
  strength: number
  /** suggested clip length in seconds (Higgsfield caps most models at 15) */
  seconds: number
  /** rough credit cost per second on a mid-tier model, for budgeting */
  creditsPerSec: number
  /** Higgsfield motion id, once known from /api/hf/motions */
  remoteMotionId?: string
  /** how the preset drives the Glowkit scene engine */
  beat: {
    motion: NonNullable<Scene['motion']>
    size: number
    ms: number
    sparks: number
    tone: Tone
    /** camera push duration in ms */
    camMs: number
  }
  keywords: string[]
}

export const KATANA_PRESETS: KatanaPreset[] = [
  {
    id: 'crash-zoom',
    name: 'Crash Zoom',
    tagline: 'Snap in from wide to face — the thumb-stopper',
    camera: 'hard zoom 1.0 → 1.9 over 8 frames, then settle',
    strength: 0.85,
    seconds: 4,
    creditsPerSec: 2,
    beat: { motion: 'punch', size: 54, ms: 3000, sparks: 3, tone: 'violet', camMs: 3000 },
    keywords: ['hook', 'stop scroll', 'impact', 'reveal'],
  },
  {
    id: 'bullet-time',
    name: 'Bullet Time',
    tagline: 'Freeze the frame, orbit the subject',
    camera: 'arc 120° around subject, 0.25× time scale',
    strength: 0.7,
    seconds: 6,
    creditsPerSec: 3,
    beat: { motion: 'rise', size: 44, ms: 3600, sparks: 5, tone: 'lime', camMs: 3600 },
    keywords: ['hero', 'product', 'matrix', 'freeze'],
  },
  {
    id: 'fpv-dive',
    name: 'FPV Dive',
    tagline: 'Drone fall through the geometry',
    camera: 'pitch −70°, forward push, FOV 95 → 60',
    strength: 0.9,
    seconds: 8,
    creditsPerSec: 4,
    beat: { motion: 'wipe', size: 48, ms: 3400, sparks: 2, tone: 'coral', camMs: 3400 },
    keywords: ['drone', 'scale', 'environment', 'map'],
  },
  {
    id: 'super-dolly',
    name: 'Super Dolly',
    tagline: 'Impossible rail shot through the diagram',
    camera: 'linear dolly Z+, constant velocity, no ease',
    strength: 0.6,
    seconds: 5,
    creditsPerSec: 3,
    beat: { motion: 'rise', size: 40, ms: 3400, sparks: 3, tone: 'violet', camMs: 3400 },
    keywords: ['diagram', 'explain', 'pipeline', 'depth'],
  },
  {
    id: 'whip-pan',
    name: 'Whip Pan',
    tagline: 'Hard left-to-right swipe between beats',
    camera: 'yaw 90° in 6 frames with 2-frame motion blur',
    strength: 0.8,
    seconds: 3,
    creditsPerSec: 2,
    beat: { motion: 'wipe', size: 50, ms: 2600, sparks: 2, tone: 'lime', camMs: 2600 },
    keywords: ['transition', 'cut', 'fast', 'before after'],
  },
  {
    id: 'orbit-reveal',
    name: 'Orbit Reveal',
    tagline: 'Slow 180° orbit that reveals the logo',
    camera: 'azimuth 0 → 180°, ease-out, subject locked centre',
    strength: 0.5,
    seconds: 7,
    creditsPerSec: 3,
    beat: { motion: 'punch', size: 56, ms: 3200, sparks: 6, tone: 'lime', camMs: 3200 },
    keywords: ['logo', 'brand', 'wordmark', 'cta'],
  },
  {
    id: 'static-push',
    name: 'Static Push',
    tagline: 'The quiet one — 6% push, nothing else moves',
    camera: 'scale 1.06 → 1.00, dead centre, no rotation',
    strength: 0.3,
    seconds: 5,
    creditsPerSec: 1,
    beat: { motion: 'rise', size: 42, ms: 3400, sparks: 0, tone: 'violet', camMs: 3800 },
    keywords: ['proof', 'screenshot', 'ui', 'evidence', 'calm'],
  },
  {
    id: 'glitch-cut',
    name: 'Glitch Cut',
    tagline: 'Chromatic tear between two states',
    camera: '3-frame RGB split + 1-frame offset, hard cut in',
    strength: 0.75,
    seconds: 3,
    creditsPerSec: 2,
    beat: { motion: 'punch', size: 46, ms: 2800, sparks: 4, tone: 'coral', camMs: 2800 },
    keywords: ['glitch', 'transition', 'error', 'before after'],
  },
]

export const PRESET_BY_ID = Object.fromEntries(KATANA_PRESETS.map((p) => [p.id, p]))

/** Map a preset onto a copy slot, producing a scene the stage can render. */
export function presetToScene(
  preset: KatanaPreset,
  copy: { kicker?: string; head: string; sub?: string },
  toneClass: Record<Tone, AccentClass> = {
    violet: 'accent-violet',
    lime: 'accent-lime',
    coral: 'accent-coral',
  },
): Scene {
  const sparks =
    preset.beat.sparks === 0
      ? undefined
      : Array.from({ length: preset.beat.sparks }, (_, i) => ({
          x: 18 + ((i * 37) % 64),
          y: 26 + ((i * 23) % 44),
          s: 12 + ((i * 7) % 14),
          delay: Math.round(i * 15) / 100,
        }))

  return {
    id: `katana-${preset.id}`,
    label: preset.name,
    ms: preset.beat.ms,
    kicker: copy.kicker ?? `katana · ${preset.id}`,
    head: copy.head,
    accents: { [copy.head]: toneClass[preset.beat.tone] },
    sub: copy.sub,
    sparks,
    motion: preset.beat.motion,
    size: preset.beat.size,
    align: 'center',
  }
}

/** Cheap budget check before anyone burns credits. */
export function estimateCredits(preset: KatanaPreset): number {
  return Math.round(preset.seconds * preset.creditsPerSec)
}

/** Pick a preset from a plain-language brief. Deterministic, no model call. */
export function suggestPreset(brief: string): KatanaPreset {
  const words: string[] = brief.toLowerCase().match(/[a-z]+/g) ?? []
  let best: KatanaPreset = KATANA_PRESETS[0]
  let bestScore = -1
  for (const p of KATANA_PRESETS) {
    const score = p.keywords.reduce((acc, k) => acc + (words.includes(k) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = p
    }
  }
  return best
}
