import { useMemo, useState } from 'react'
import { Player } from '../scene-player'
import {
  CHAPTERS,
  ELEMENT_HEX,
  GLOSSARY,
  LORE_HOOKS,
  LORE_SCENES,
  type ChapterMeta,
} from './scenes'

/* ------------------------------------------------------------------ */

function Head({
  kicker,
  title,
  lede,
}: {
  kicker: string
  title: React.ReactNode
  lede?: string
}) {
  return (
    <div className="sec-head">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
      {lede ? <p>{lede}</p> : null}
    </div>
  )
}

function ChapterCard({
  meta,
  index,
  active,
  onPick,
}: {
  meta: ChapterMeta
  index: number
  active: boolean
  onPick: () => void
}) {
  const el = ELEMENT_HEX[meta.element]
  return (
    <button
      className="chapter"
      data-on={active}
      onClick={onPick}
      style={{ ['--el' as string]: el }}
    >
      <span className="chapter-top">
        <span className="chapter-nation">
          <i />
          {meta.nation}
        </span>
        <span className="chapter-idx">{String(index + 1).padStart(2, '0')}</span>
      </span>
      <h3>{meta.hook}</h3>
      <p>{meta.note}</p>
    </button>
  )
}

/* The cosmology ladder — the static "who answers to whom" explainer. */
const LADDER = [
  {
    tier: 'beyond',
    el: '#4CC2F1',
    title: 'Outside the sky',
    body: 'Descenders arrive from beyond Teyvat. What they left behind is the question the whole story circles.',
    tag: 'unmapped',
  },
  {
    tier: 'above',
    el: '#FAB72E',
    title: 'Celestia',
    body: 'The floating seat of the Heavenly Principles. Nothing in seven nations answers to it out loud.',
    tag: 'never visited',
  },
  {
    tier: 'seven',
    el: '#B08FC4',
    title: 'The Seven Archons',
    body: 'One per nation, each holding a gnosis. They rule, but they were appointed — and one of them left.',
    tag: '7 thrones',
  },
  {
    tier: 'granted',
    el: '#74C2A8',
    title: 'Vision holders',
    body: 'Mortals who can channel an element. Nobody has been told the actual criteria.',
    tag: 'rare',
  },
  {
    tier: 'below',
    el: '#A5C83B',
    title: 'Teyvat itself',
    body: 'Nations, ruins, and a world tree that remembers — and quietly revises — all of it.',
    tag: 'recorded',
  },
]

/* ------------------------------------------------------------------ */

export default function LoreApp() {
  const [start, setStart] = useState(0)
  const [hookIdx] = useState(0)
  // keying the player on `start` remounts it so a chapter click restarts cleanly
  const playerKey = useMemo(() => `run-${start}`, [start])

  return (
    <div className="lore-root">
      <div className="page-glow" />
      <div className="page-grain" />

      <header className="topbar">
        <div className="shell topbar-inner">
          <a
            className="brand"
            href="./"
            style={{ color: 'inherit', textDecoration: 'none' }}
            title="back to Glowkit"
          >
            <span className="brand-mark" />
            Sky Above Teyvat
          </a>
          <nav className="topnav">
            <a href="#reel">The reel</a>
            <a href="#chapters">Chapters</a>
            <a href="#ladder">Cosmology</a>
            <a href="#glossary">Glossary</a>
          </nav>
          <span className="pill">9:16 · lore sample</span>
        </div>
      </header>

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="shell hero" id="reel">
          <div>
            <div className="kicker">a lore cut, same edit system</div>
            <h1>
              Nine beats,
              <em>one sky above it all.</em>
            </h1>
            <p className="hero-lede">
              The reference reel retold as a Genshin lore piece: the chain from Celestia down to a
              vision holder, the nation that refused, the night it was erased, and the four who came
              from outside. Same six primitives, same scene engine — nothing here is footage.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#chapters">
                Pick a chapter →
              </a>
              <a className="btn btn-ghost" href="./">
                Back to the system
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <b>9</b>
                <span>beats</span>
              </div>
              <div className="stat">
                <b>7</b>
                <span>element accents</span>
              </div>
              <div className="stat">
                <b>3.4s</b>
                <span>avg scene</span>
              </div>
              <div className="stat">
                <b>0</b>
                <span>screenshots used</span>
              </div>
            </div>
            <div className="lore-badge-row" style={{ marginTop: 26 }}>
              <span className="pill">hook bar · gold</span>
              <span className="pill">canvas · high sky</span>
              <span className="pill">elements as accents</span>
            </div>
          </div>

          <Player
            key={playerKey}
            scenes={LORE_SCENES}
            startIndex={start}
            hook={LORE_HOOKS[hookIdx]}
          />
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ---------------- CHAPTERS ---------------- */}
        <section className="shell sec" id="chapters">
          <Head
            kicker="tap to jump"
            title={
              <>
                The <em>nine beats</em>
              </>
            }
            lede="Each card is one scene from the reel. Click it and the stage above restarts on that beat — the same way the chapter strip works in a real short-form edit."
          />
          <div className="chapter-grid">
            {CHAPTERS.map((c, i) => {
              const sceneIdx = LORE_SCENES.findIndex((s) => s.id === c.sceneId)
              return (
                <ChapterCard
                  key={c.sceneId}
                  meta={c}
                  index={i}
                  active={start === sceneIdx}
                  onPick={() => setStart(sceneIdx)}
                />
              )
            })}
            <button
              className="chapter"
              data-on={start === LORE_SCENES.length - 1}
              onClick={() => setStart(LORE_SCENES.length - 1)}
              style={{ ['--el' as string]: '#9FD6E3' }}
            >
              <span className="chapter-top">
                <span className="chapter-nation">
                  <i />
                  Outro
                </span>
                <span className="chapter-idx">09</span>
              </span>
              <h3>Which nation?</h3>
              <p>The comment-bait beat. Every reel in this style ends on one.</p>
            </button>
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ---------------- COSMOLOGY ---------------- */}
        <section className="shell sec" id="ladder">
          <Head
            kicker="the diagram that carries the episode"
            title={
              <>
                Who <em>answers</em> to whom
              </>
            }
            lede="In the reference video the diagram beat is what actually explains the product. Here it explains the setting: one rung per tier of power, top to bottom. This is the section that would get the self-drawing connector animation in the video cut."
          />
          <div className="ladder">
            {LADDER.map((r) => (
              <div className="rung" key={r.tier} style={{ ['--el' as string]: r.el }}>
                <span className="rung-tier">{r.tier}</span>
                <div>
                  <h4>{r.title}</h4>
                  <p>{r.body}</p>
                </div>
                <span className="rung-tag">{r.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ---------------- GLOSSARY ---------------- */}
        <section className="shell sec" id="glossary">
          <Head
            kicker="six words that unlock the rest"
            title={
              <>
                Read the <em>vocabulary</em> first
              </>
            }
            lede="Lore edits fail when they assume the viewer already knows the nouns. These six, defined in plain language, are enough to follow the whole episode."
          />
          <div className="terms">
            {GLOSSARY.map((t) => (
              <div className="term" key={t.term}>
                <b>{t.term}</b>
                <p>{t.body}</p>
              </div>
            ))}
          </div>

          <div className="disclaimer" style={{ marginTop: 30 }}>
            <b>Fan sample, unofficial.</b> Not affiliated with or endorsed by HoYoverse. All copy on
            this page is my own paraphrase written for the motion sample — no game text is quoted,
            and no game art is used; every visual is CSS and SVG. Where the story is unresolved
            (the fake sky, the fourth descender) the page says it is a theory rather than canon.
          </div>
        </section>
      </main>

      <footer>
        <div className="shell foot">
          <div>SKY ABOVE TEYVAT — a lore cut built on Glowkit</div>
          <div>unofficial fan sample · React · CSS · SVG</div>
        </div>
      </footer>
    </div>
  )
}
