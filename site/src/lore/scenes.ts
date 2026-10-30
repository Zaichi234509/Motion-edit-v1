/**
 * THE SKY ABOVE TEYVAT — a lore sample cut in the Glowkit style.
 *
 * Same six primitives as the reference reel, same scene engine as the main site.
 * The only things that change are the copy, the accent palette and the diagrams.
 *
 * All wording here is my own paraphrase — it is a fan sample, not quoted game text.
 */

import type { Scene } from '../scenes'

export const LORE_HOOKS = [
  'The lore runs deeper than the map 🜁',
  'Seven thrones, one sky',
  'Nobody in Teyvat is telling the truth',
]

export const LORE_SCENES: Scene[] = [
  /* 01 ─────────────────────────────────────────────────────────── */
  {
    id: 'thrones',
    label: 'Seven thrones',
    ms: 3400,
    kicker: 'before the map was finished',
    head: 'SEVEN THRONES',
    accents: { 'SEVEN THRONES': 'accent-geo' },
    sub: 'seven nations, seven archons, and one sky above them all',
    motion: 'punch',
    size: 42,
    align: 'center',
  },

  /* 02 ─────────────────────────────────────────────────────────── */
  {
    id: 'chain',
    label: 'The chain',
    ms: 3800,
    kicker: 'fig. 01 — who answers to whom',
    head: 'WHO HOLDS THE POWER?',
    accents: { 'WHO HOLDS THE POWER?': 'accent-anemo' },
    nodes: [
      { id: 'a', tag: 'above', title: 'CELESTIA', caption: 'the sky, and what sits in it', x: 50, y: 58, tone: 'lime' },
      { id: 'b', tag: 'below', title: 'ARCHONS', caption: 'seven thrones, seven gnoses', x: 24, y: 78, tone: 'violet' },
      { id: 'c', tag: 'further', title: 'VISIONS', caption: 'mortals, granted a sliver', x: 76, y: 82, tone: 'coral' },
    ],
    edges: [
      { from: 'a', to: 'b', label: 'grants' },
      { from: 'a', to: 'c', label: 'through them' },
    ],
    sparks: [
      { x: 50, y: 58, s: 20, delay: 0 },
      { x: 24, y: 78, s: 13, delay: 0.3 },
      { x: 76, y: 82, s: 13, delay: 0.45 },
    ],
    motion: 'rise',
    size: 26,
  },

  /* 03 ─────────────────────────────────────────────────────────── */
  {
    id: 'khaenriah',
    label: 'Khaenri’ah',
    ms: 3600,
    kicker: 'one nation refused',
    head: 'KHAENRI’AH',
    accents: { 'KHAENRI’AH': 'accent-electro' },
    sub: 'no archon. no vision. a nation built on human ambition alone.',
    sparks: [
      { x: 30, y: 62, s: 16, delay: 0.15 },
      { x: 68, y: 46, s: 22, delay: 0.35 },
    ],
    motion: 'punch',
    size: 40,
    align: 'center',
  },

  /* 04 ─────────────────────────────────────────────────────────── */
  {
    id: 'cataclysm',
    label: 'The Cataclysm',
    ms: 3600,
    kicker: 'five hundred years ago',
    head: 'THE CATACLYSM',
    accents: { 'THE CATACLYSM': 'accent-pyro' },
    sub: 'the sky answered, and a godless nation was unmade in a night',
    nodes: [
      { id: 'a', tag: 'cause', title: 'AMBITION', caption: 'khaenri’ah acts', x: 20, y: 66, tone: 'coral' },
      { id: 'b', tag: 'response', title: 'THE SKY', caption: 'celestia answers', x: 50, y: 84, tone: 'lime' },
      { id: 'c', tag: 'result', title: 'THE ABYSS', caption: 'what was left behind', x: 80, y: 64, tone: 'violet' },
    ],
    edges: [
      { from: 'a', to: 'b', label: 'then' },
      { from: 'b', to: 'c', label: 'leaving' },
    ],
    sparks: [
      { x: 50, y: 84, s: 24, delay: 0.2 },
      { x: 80, y: 64, s: 16, delay: 0.5 },
    ],
    motion: 'rise',
    size: 28,
  },

  /* 05 ─────────────────────────────────────────────────────────── */
  {
    id: 'descenders',
    label: 'Descenders',
    ms: 4000,
    kicker: 'the ones who came from outside',
    head: 'FOUR CAME DOWN',
    accents: { 'FOUR CAME DOWN': 'accent-hydro' },
    sub: 'the first · the second who came · an unknown third · and then the traveler',
    sparks: [
      { x: 18, y: 58, s: 12, delay: 0 },
      { x: 38, y: 44, s: 16, delay: 0.18 },
      { x: 60, y: 62, s: 14, delay: 0.36 },
      { x: 82, y: 46, s: 20, delay: 0.54 },
    ],
    motion: 'wipe',
    size: 36,
    align: 'center',
  },

  /* 06 ─────────────────────────────────────────────────────────── */
  {
    id: 'irminsul',
    label: 'Irminsul',
    ms: 3800,
    kicker: 'the archive under everything',
    head: 'IRMINSUL',
    accents: { IRMINSUL: 'accent-dendro' },
    sub: 'every memory in Teyvat grows on one tree — and a tree can be edited',
    nodes: [
      { id: 'a', tag: 'roots', title: 'MEMORY', caption: 'everything that happened', x: 22, y: 74, tone: 'lime' },
      { id: 'b', tag: 'trunk', title: 'IRMINSUL', caption: 'the record itself', x: 50, y: 60, tone: 'lime' },
      { id: 'c', tag: 'fruit', title: 'REVISION', caption: 'what people now recall', x: 78, y: 80, tone: 'violet' },
    ],
    edges: [
      { from: 'a', to: 'b', label: 'feeds' },
      { from: 'b', to: 'c', label: 'rewrites' },
    ],
    sparks: [
      { x: 50, y: 60, s: 26, delay: 0.1 },
      { x: 78, y: 80, s: 14, delay: 0.42 },
    ],
    motion: 'rise',
    size: 30,
  },

  /* 07 ─────────────────────────────────────────────────────────── */
  {
    id: 'gnoses',
    label: 'The Gnoses',
    ms: 3400,
    kicker: 'seven pieces of a throne',
    head: 'COLLECTING GNOSES',
    accents: { COLLECTING: 'accent-cryo', GNOSES: 'accent-geo' },
    sub: 'the tsaritsa is gathering them one by one. she has not said why.',
    motion: 'rise',
    size: 30,
  },

  /* 08 ─────────────────────────────────────────────────────────── */
  {
    id: 'fakesky',
    label: 'The sky',
    ms: 3600,
    kicker: 'a theory, not a fact — for now',
    head: 'THE SKY IS FAKE',
    accents: { 'THE SKY IS FAKE': 'hot' },
    sub: 'a wandering puppet said it. the abyss has never argued.',
    sparks: [
      { x: 26, y: 58, s: 18, delay: 0.15 },
      { x: 70, y: 50, s: 24, delay: 0.35 },
      { x: 50, y: 70, s: 14, delay: 0.55 },
    ],
    motion: 'punch',
    size: 34,
    align: 'center',
  },

  /* 09 ─────────────────────────────────────────────────────────── */
  {
    id: 'cta',
    label: 'Comment',
    ms: 3200,
    kicker: 'nine beats, one sky',
    head: 'WHICH NATION?',
    accents: { 'WHICH NATION?': 'accent-anemo' },
    sub: 'comment the chapter you want next and it gets the same treatment',
    motion: 'punch',
    size: 36,
    align: 'center',
  },
]

/* ------------------------------------------------------------------ */
/* Element sticker data for the chapter grid                           */
/* ------------------------------------------------------------------ */

export type Element = 'anemo' | 'geo' | 'electro' | 'dendro' | 'hydro' | 'pyro' | 'cryo'

export const ELEMENT_HEX: Record<Element, string> = {
  anemo: '#74C2A8',
  geo: '#FAB72E',
  electro: '#B08FC4',
  dendro: '#A5C83B',
  hydro: '#4CC2F1',
  pyro: '#EF7938',
  cryo: '#9FD6E3',
}

export interface ChapterMeta {
  sceneId: string
  nation: string
  element: Element
  hook: string
  note: string
}

export const CHAPTERS: ChapterMeta[] = [
  {
    sceneId: 'thrones',
    nation: 'Teyvat',
    element: 'geo',
    hook: 'The shape of the world',
    note: 'Seven nations, seven archons, and a sky nobody has visited.',
  },
  {
    sceneId: 'chain',
    nation: 'Celestia',
    element: 'anemo',
    hook: 'Who answers to whom',
    note: 'Visions are not gifts from the archons alone — the chain runs higher.',
  },
  {
    sceneId: 'khaenriah',
    nation: 'Khaenri’ah',
    element: 'electro',
    hook: 'The nation with no god',
    note: 'No archon, no visions, and no interest in asking permission.',
  },
  {
    sceneId: 'cataclysm',
    nation: 'The Cataclysm',
    element: 'pyro',
    hook: 'The night it ended',
    note: 'Five hundred years on, everyone who was there still refuses to explain it.',
  },
  {
    sceneId: 'descenders',
    nation: 'Beyond the sky',
    element: 'hydro',
    hook: 'Four from outside',
    note: 'Descenders arrive from beyond Teyvat. One of them is the traveler.',
  },
  {
    sceneId: 'irminsul',
    nation: 'Irminsul',
    element: 'dendro',
    hook: 'The editable archive',
    note: 'Memories are stored in a tree. Trees can be pruned. People forget.',
  },
  {
    sceneId: 'gnoses',
    nation: 'Snezhnaya',
    element: 'cryo',
    hook: 'The collection',
    note: 'The tsaritsa is quietly accumulating the pieces of every throne.',
  },
  {
    sceneId: 'fakesky',
    nation: 'The Abyss',
    element: 'electro',
    hook: 'The sky is a lie',
    note: 'Theory, not canon — but the deepest layers of the story keep nodding at it.',
  },
]

export const GLOSSARY = [
  {
    term: 'Archon',
    body: 'One of seven gods ruling a nation, each tied to an element and holding a gnosis.',
  },
  {
    term: 'Gnosis',
    body: 'A chess-piece shaped token of divine authority. The tsaritsa has been collecting them.',
  },
  {
    term: 'Vision',
    body: 'A gem that lets a mortal channel an element. Granted rarely, and never explained fully.',
  },
  {
    term: 'Descender',
    body: 'A being who came to Teyvat from outside it. The traveler is counted as the fourth.',
  },
  {
    term: 'Irminsul',
    body: 'The world tree that holds Teyvat’s memory. Editing it rewrites what people remember.',
  },
  {
    term: 'The Abyss',
    body: 'What was left where a godless nation used to be. It has opinions about the sky.',
  },
]
