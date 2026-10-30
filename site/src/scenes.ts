/**
 * Scene model — a tiny "keyframe DSL".
 *
 * The reference reel is nothing but a repeating toolkit applied to new copy:
 * a hook bar, a neon canvas, a headline that blooms in, a mono subline that
 * types on, a diagram that draws itself, and a sparkle burst for punctuation.
 *
 * Everything below is data. Swap the strings and you have a new video.
 */

export type Tone = 'violet' | 'lime' | 'coral'

/** Every glow colour a word can take. Elements are for the lore sample. */
export type AccentClass =
  | 'accent-violet'
  | 'accent-lime'
  | 'accent-coral'
  | 'hot'
  | 'accent-anemo'
  | 'accent-geo'
  | 'accent-electro'
  | 'accent-dendro'
  | 'accent-hydro'
  | 'accent-pyro'
  | 'accent-cryo'

export interface Node {
  id: string
  tag?: string
  title: string
  caption?: string
  /** % of the canvas box */
  x: number
  y: number
  tone: Tone
}

export interface Edge {
  from: string
  to: string
  label?: string
  dashed?: boolean
}

export interface Spark {
  x: number
  y: number
  s: number
  delay: number
}

export type Motion = 'rise' | 'punch' | 'wipe' | 'scale'

export interface Scene {
  id: string
  label: string
  /** ms */
  ms: number
  kicker?: string
  head: string
  /** words inside `head` that get a colored glow */
  accents?: Record<string, AccentClass>
  sub?: string
  nodes?: Node[]
  edges?: Edge[]
  sparks?: Spark[]
  motion?: Motion
  /** headline size in cqw-ish px, tuned per scene */
  size?: number
  align?: 'left' | 'center'
}

export const SCENES: Scene[] = [
  {
    id: 'hook',
    label: '01 · Hook',
    ms: 3000,
    kicker: 'what if i told you',
    head: 'MOTION GRAPHICS',
    accents: { 'MOTION GRAPHICS': 'accent-violet' },
    sub: 'in the browser, no After Effects, no timeline scrubbing',
    motion: 'punch',
    size: 40,
    align: 'center',
  },
  {
    id: 'nodes',
    label: '02 · Diagram',
    ms: 3400,
    kicker: 'fig. 04 — chain',
    head: 'And no,',
    sub: "I'm not talking about an MCP",
    nodes: [
      { id: 'a', tag: '01', title: 'Prompt', caption: 'your content', x: 20, y: 52, tone: 'coral' },
      { id: 'b', tag: '02', title: 'Kinetic', caption: 'type engine', x: 50, y: 76, tone: 'violet' },
      { id: 'c', tag: '03', title: 'Render', caption: 'webgl / css', x: 80, y: 52, tone: 'lime' },
    ],
    edges: [
      { from: 'a', to: 'b', label: 'data in' },
      { from: 'b', to: 'c', label: 'frames out' },
    ],
    sparks: [
      { x: 50, y: 76, s: 22, delay: 0 },
      { x: 80, y: 52, s: 14, delay: 0.35 },
      { x: 20, y: 52, s: 11, delay: 0.6 },
    ],
    motion: 'rise',
    size: 46,
  },
  {
    id: 'pipe',
    label: '03 · Pipeline',
    ms: 3400,
    kicker: 'plays in the browser',
    head: 'PIPELINE',
    accents: { 'PIPELINE': 'accent-violet' },
    sub: 'one JSON of copy in, one 9:16 master out',
    nodes: [
      { id: 'a', tag: 'mcp', title: 'INPUT', caption: 'copy + brand', x: 28, y: 56, tone: 'lime' },
      { id: 'b', tag: 'model', title: 'SCENE', caption: 'timing + easing', x: 72, y: 80, tone: 'coral' },
    ],
    edges: [{ from: 'a', to: 'b', label: 'transform' }],
    sparks: [{ x: 72, y: 80, s: 20, delay: 0.3 }],
    motion: 'wipe',
    size: 44,
  },
  {
    id: 'katana',
    label: '04 · Brand beat',
    ms: 3000,
    kicker: 'and the wordmark',
    head: 'YOUR NAME',
    accents: { 'YOUR NAME': 'accent-lime' },
    sub: 'every letter gets its own ignition delay',
    sparks: [
      { x: 30, y: 34, s: 26, delay: 0 },
      { x: 72, y: 30, s: 18, delay: 0.2 },
      { x: 52, y: 62, s: 22, delay: 0.42 },
      { x: 84, y: 58, s: 12, delay: 0.6 },
    ],
    motion: 'punch',
    size: 52,
    align: 'center',
  },
  {
    id: 'stat',
    label: '05 · Proof',
    ms: 3000,
    kicker: 'everything is a parameter',
    head: '0 render',
    accents: { '0': 'accent-violet', render: 'hot' },
    sub: 'waiting — it is a div, a path and a text shadow',
    motion: 'rise',
    size: 48,
  },
  {
    id: 'cta',
    label: '06 · CTA',
    ms: 3200,
    kicker: 'made in one prompt',
    head: "THAT'S IT.",
    accents: { "THAT'S IT.": 'accent-violet' },
    sub: 'comment the word below and I will send the template',
    sparks: [
      { x: 26, y: 40, s: 18, delay: 0.1 },
      { x: 66, y: 32, s: 24, delay: 0.28 },
      { x: 48, y: 64, s: 14, delay: 0.5 },
    ],
    motion: 'punch',
    size: 50,
    align: 'center',
  },
]

export const HOOKS = [
  'New model just dropped 🤯',
  'Stop paying for After Effects',
  'I rebuilt it in one prompt',
  'This ships in 9 seconds',
]
