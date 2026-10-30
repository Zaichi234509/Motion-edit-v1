import { useMemo } from 'react'
import {
  useCountUp,
  useInView,
  usePageProgress,
  useScrollVar,
  useSectionProgress,
} from './hooks'

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a))

function Reveal({
  children,
  delay = 0,
  variant = '',
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  variant?: '' | 'rv-left' | 'rv-right' | 'rv-scale' | 'rv-clip'
  as?: any
  className?: string
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.15 })
  return (
    <Tag
      ref={ref}
      className={`rv ${variant} ${inView ? 'is-in' : ''} ${className}`.trim()}
      style={{ ['--d' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

function SectionHead({
  kicker,
  title,
  lede,
}: {
  kicker: string
  title: React.ReactNode
  lede?: string
}) {
  return (
    <div className="sx-sec-head">
      <Reveal>
        <div className="kicker">{kicker}</div>
      </Reveal>
      <Reveal delay={90}>
        <h2>{title}</h2>
      </Reveal>
      {lede ? (
        <Reveal delay={170}>
          <p>{lede}</p>
        </Reveal>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* hero                                                                */
/* ------------------------------------------------------------------ */

const HERO_WORDS = [
  { t: 'Type', lit: false },
  { t: 'that', lit: false },
  { t: 'emits', lit: true },
  { t: 'light.', lit: true },
]

function Hero() {
  return (
    <section className="sx-hero" id="top">
      <div className="sx-hero-bg" aria-hidden="true">
        <div className="sx-hero-grid" />
        <div className="sx-orb sx-orb-1" />
        <div className="sx-orb sx-orb-2" />
        <div className="sx-orb sx-orb-3" />
      </div>

      <div className="shell sx-hero-inner">
        <div className="kicker" style={{ justifyContent: 'center' }}>
          a motion system, as a website
        </div>

        <h1>
          {HERO_WORDS.map((w, i) => (
            <span
              key={w.t}
              className={`sx-word${w.lit ? ' lit' : ''}`}
              style={{ ['--d' as string]: `${180 + i * 95}ms` }}
            >
              {w.t}
              {i < HERO_WORDS.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </h1>

        <p className="sx-hero-lede">
          Every headline, diagram and sparkle on this page arrives because you scrolled to it.
          There is no timeline, no play button, no video file — the same six primitives the reel
          used, wired to your scroll position instead.
        </p>

        <div className="sx-hero-actions">
          <a className="btn btn-primary" href="#chain">
            Scroll the diagram ↓
          </a>
          <a className="btn btn-ghost" href="#effects">
            See the effects
          </a>
        </div>
      </div>

      <div className="sx-scroll-cue" aria-hidden="true">
        scroll
        <i />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* marquee                                                             */
/* ------------------------------------------------------------------ */

const MARQUEE = [
  'bloom type',
  'slam-in',
  'self-drawing diagrams',
  'sparkle bursts',
  'camera push',
  'scroll highlight',
  'per-word stagger',
  'parallax grid',
]

function Marquee() {
  return (
    <div className="sx-marquee" aria-hidden="true">
      <div className="sx-marquee-track">
        {[...MARQUEE, ...MARQUEE].map((m, i) => (
          <span key={i}>{m}</span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* feature cards                                                       */
/* ------------------------------------------------------------------ */

const GLYPHS = {
  enter: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d8b4fe" strokeWidth="1.6">
      <path d="M12 3v10m0 0l-4-4m4 4l4-4" strokeLinecap="round" />
      <path d="M4 16v2a3 3 0 003 3h10a3 3 0 003-3v-2" strokeLinecap="round" />
    </svg>
  ),
  scroll: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d8ff6b" strokeWidth="1.6">
      <rect x="7" y="2.5" width="10" height="19" rx="5" />
      <path d="M12 7v4" strokeLinecap="round" />
    </svg>
  ),
  token: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb894" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  ),
}

const FEATURES = [
  {
    glyph: GLYPHS.enter,
    num: '01',
    title: 'Nothing appears. Everything arrives.',
    body: 'Each block starts at zero opacity, 26 px low and 10 px blurred, then resolves when it enters the viewport. One transition, four properties, and the whole page feels authored.',
  },
  {
    glyph: GLYPHS.scroll,
    num: '02',
    title: 'Scroll-linked, not time-linked',
    body: 'The diagram below draws its connectors from your scroll position, not a clock. Scroll back up and it un-draws. That reversibility is what makes it feel physical.',
  },
  {
    glyph: GLYPHS.token,
    num: '03',
    title: 'Six tokens, one accent file',
    body: 'The palette, easings and type scale live in custom properties. Point them at a different brand and every section recolours — no per-component overrides.',
  },
]

function Features() {
  return (
    <section className="sx-sec" id="how">
      <div className="shell">
        <SectionHead
          kicker="how the page works"
          title={
            <>
              Three rules, and the <em>whole thing</em> behaves
            </>
          }
          lede="The reel looked expensive because every beat used the same grammar. A website needs the same discipline: one entrance motion, one scroll relationship, one palette. Break any of the three and it starts looking like a template."
        />

        <div className="sx-cards">
          {FEATURES.map((f, i) => (
            <Reveal key={f.num} delay={i * 130} variant="rv-scale">
              <article
                className="sx-card"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
                  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
                }}
              >
                <span className="sx-card-num">{f.num}</span>
                <div className="sx-card-glyph">{f.glyph}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* sticky scroll diagram                                               */
/* ------------------------------------------------------------------ */

const NODES = [
  { id: 'a', tag: 'input', label: 'COPY', cap: 'your words', x: 17, y: 46, tone: '' },
  { id: 'b', tag: 'engine', label: 'SCENE', cap: 'timing + easing', x: 50, y: 56, tone: 'lime' },
  { id: 'c', tag: 'output', label: 'FRAMES', cap: 'a 9:16 master', x: 83, y: 44, tone: 'coral' },
]

const CAPTIONS = [
  {
    label: 'phase 01 / 03',
    text: 'You supply copy. The stage reserves a place for it and waits — that is the empty first frame.',
  },
  {
    label: 'phase 02 / 03',
    text: 'The scene engine assigns motion, easing and stagger. Notice the connector drawing itself as you keep scrolling.',
  },
  {
    label: 'phase 03 / 03',
    text: 'Frames resolve. Nothing was rendered ahead of time; every state here is a class toggle on a DOM node.',
  },
]

function ScrollDiagram() {
  const [ref, p] = useSectionProgress<HTMLDivElement>()

  // each node lights in sequence, connectors draw across a window of progress
  const on = [remap(p, 0.06, 0.2), remap(p, 0.3, 0.46), remap(p, 0.56, 0.72)]
  const draw1 = remap(p, 0.18, 0.42)
  const draw2 = remap(p, 0.44, 0.68)
  const caption = p < 0.33 ? CAPTIONS[0] : p < 0.66 ? CAPTIONS[1] : CAPTIONS[2]

  const path1 = 'M 17 46 Q 33 36 50 56'
  const path2 = 'M 50 56 Q 66 38 83 44'

  return (
    <div className="sx-pin" ref={ref} id="chain">
      <div className="sx-pin-sticky">
        <div className="sx-pin-stage">
          <div className="sx-pin-frame">
            <div className="grid-bg" />

            <svg className="sx-pin-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sxEdge" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(192,132,252,0.3)" />
                  <stop offset="55%" stopColor="#e9d5ff" />
                  <stop offset="100%" stopColor="rgba(192,132,252,0.35)" />
                </linearGradient>
                <filter id="sxGlow" x="-60%" y="-140%" width="220%" height="380%">
                  <feGaussianBlur stdDeviation="0.8" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {[
                { d: path1, v: draw1 },
                { d: path2, v: draw2 },
              ].map((e, i) => (
                <path
                  key={i}
                  d={e.d}
                  fill="none"
                  stroke="url(#sxEdge)"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  filter="url(#sxGlow)"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: 1 - e.v,
                    opacity: e.v > 0.01 ? 1 : 0,
                  }}
                />
              ))}
            </svg>

            {NODES.map((n, i) => (
              <div
                key={n.id}
                className={`sx-node ${n.tone} ${on[i] > 0.5 ? 'on' : ''} ${
                  on[i] > 0.5 && on[i + 1] !== undefined && on[i + 1] <= 0.5 ? 'active' : ''
                }`}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <span className="sx-node-tag">{n.tag}</span>
                <b>{n.label}</b>
                <span>{n.cap}</span>
              </div>
            ))}

            <div className="sx-pin-meter" aria-hidden="true">
              {String(Math.round(p * 100)).padStart(3, '0')}%
            </div>

            <div className="sx-pin-caption">
              <b>{caption.label}</b>
              <p>{caption.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* scroll-highlight paragraph                                          */
/* ------------------------------------------------------------------ */

const SCRUB_WORDS = [
  { t: 'Every' },
  { t: 'element' },
  { t: 'you' },
  { t: 'have' },
  { t: 'seen' },
  { t: 'so' },
  { t: 'far' },
  { t: 'arrived' },
  { t: 'because' },
  { t: 'you' },
  { t: 'kept' },
  { t: 'scrolling.' },
  { t: 'Nothing' },
  { t: 'was' },
  { t: 'playing' },
  { t: 'in' },
  { t: 'the' },
  { t: 'background.', gold: true },
]

function ScrubText() {
  const [ref, p] = useSectionProgress<HTMLDivElement>()
  const lit = Math.round(remap(p, 0.12, 0.86) * SCRUB_WORDS.length)

  return (
    <div className="sx-scrub" ref={ref}>
      <div className="shell sx-scrub-inner">
        <Reveal>
          <div className="kicker" style={{ justifyContent: 'center' }}>
            scroll to read
          </div>
        </Reveal>
        <p className="sx-scrub-text">
          {SCRUB_WORDS.map((w, i) => (
            <span key={i} className={`w${i < lit ? ' on' : ''}${w.gold ? ' gold' : ''}`}>
              {w.t}
              {i < SCRUB_WORDS.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* stats                                                               */
/* ------------------------------------------------------------------ */

function Stat({ value, suffix, label, active }: { value: number; suffix?: string; label: string; active: boolean }) {
  const n = useCountUp(value, active)
  return (
    <div className="sx-stat">
      <b>
        {Math.round(n)}
        {suffix}
      </b>
      <span>{label}</span>
    </div>
  )
}

function Stats() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 })
  return (
    <div className="shell">
      <div className="sx-stats" ref={ref}>
        <Stat value={6} label="repeating primitives" active={inView} />
        <Stat value={0} label="video assets" active={inView} />
        <Stat value={60} suffix="fps" label="scroll budget" active={inView} />
        <Stat value={1} label="file to recolour" active={inView} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* effects grid                                                        */
/* ------------------------------------------------------------------ */

function Sparkles({ spots }: { spots: { x: number; y: number; s: number; d: number }[] }) {
  return (
    <>
      {spots.map((s, i) => (
        <span
          key={i}
          className="sx-spark"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              '--s': `${s.s}px`,
              '--d': `${s.d}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

const FX = [
  {
    title: 'Bloom type',
    body: 'Five stacked shadows from 2 px to 140 px, plus a blurred duplicate behind. The duplicate is what makes it read as emitted light.',
    visual: (
      <div
        style={{
          fontFamily: 'Archivo, sans-serif',
          fontWeight: 900,
          fontSize: 27,
          letterSpacing: '-0.04em',
          color: '#fff',
          textShadow:
            '0 0 2px rgba(255,255,255,.95), 0 0 14px rgba(233,213,255,.85), 0 0 38px rgba(192,132,252,.9), 0 0 78px rgba(168,85,247,.8)',
        }}
      >
        BLOOM
      </div>
    ),
  },
  {
    title: 'Slam-in',
    body: 'Enters at 1.28× with 10 px of blur and no opacity, snaps through a hard bezier, settles at 1×. The impact beat.',
    visual: (
      <div
        style={{
          fontFamily: 'Archivo, sans-serif',
          fontWeight: 900,
          fontSize: 30,
          letterSpacing: '-0.05em',
          color: '#fff',
          animation: 'punch 2.4s cubic-bezier(.7,0,.2,1) infinite',
        }}
      >
        SLAM
      </div>
    ),
  },
  {
    title: 'Per-word stagger',
    body: 'Split on spaces, 55 ms apart, blur to sharp. Reads as typing with no caret and no character timers.',
    visual: (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', padding: '0 26px' }}>
        {['one', 'word', 'at', 'a', 'time'].map((w, i) => (
          <span
            key={w}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 700,
              color: '#efe6ff',
              display: 'inline-block',
              animation: 'wordIn 2.4s cubic-bezier(.16,1,.3,1) infinite',
              animationDelay: `${i * 0.12}s`,
              opacity: 0,
            }}
          >
            {w}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: 'Self-drawing connector',
    body: 'A quadratic Bézier in a normalised viewBox. Animate stroke-dashoffset from the path length to zero and it draws itself.',
    visual: (
      <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        <defs>
          <filter id="fxGlow" x="-50%" y="-100%" width="200%" height="300%">
            <feGaussianBlur stdDeviation="1.3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 12 42 Q 50 8 88 34"
          fill="none"
          stroke="#e9d5ff"
          strokeWidth="1.2"
          filter="url(#fxGlow)"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: 1,
            animation: 'drawIn 2.6s cubic-bezier(.16,1,.3,1) infinite',
          }}
        />
        <circle cx="12" cy="42" r="2.2" fill="#ff8a63" filter="url(#fxGlow)" />
        <circle cx="88" cy="34" r="2.2" fill="#d9ff3d" filter="url(#fxGlow)" />
      </svg>
    ),
  },
  {
    title: 'Sparkle burst',
    body: 'A four-point star is a radial gradient clipped to an eight-point polygon. Pop to 1.15×, settle, fade. Stagger three around a landing element.',
    visual: (
      <Sparkles
        spots={[
          { x: 26, y: 30, s: 20, d: 0 },
          { x: 52, y: 20, s: 28, d: 0.5 },
          { x: 74, y: 38, s: 16, d: 1 },
          { x: 46, y: 62, s: 22, d: 1.5 },
        ]}
      />
    ),
  },
  {
    title: 'Parallax grid',
    body: 'One CSS variable holds scrollY, so decorative layers can drift at different rates without a re-render per frame.',
    visual: (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div
          className="grid-bg"
          style={{ transform: 'translateY(calc(var(--sy, 0) * 0.04px))' }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 76,
            height: 76,
            marginLeft: -38,
            marginTop: -38,
            borderRadius: 10,
            border: '1px solid rgba(192,132,252,.65)',
            background: 'radial-gradient(circle at 40% 32%, rgba(168,85,247,.45), transparent 70%)',
            transform: 'translateY(calc(var(--sy, 0) * -0.05px))',
          }}
        />
      </div>
    ),
  },
  {
    title: 'Camera push',
    body: 'Scale 1.06 → 1.00 across a section. Costs one transform and removes all dead air between blocks.',
    visual: (
      <div
        style={{
          width: 78,
          height: 78,
          borderRadius: 8,
          border: '1px solid rgba(192,132,252,.7)',
          background: 'radial-gradient(circle at 42% 30%, rgba(168,85,247,.5), transparent 72%)',
          animation: 'camPush 3.6s cubic-bezier(.16,1,.3,1) infinite alternate',
        }}
      />
    ),
  },
  {
    title: 'Count-up',
    body: 'A number that climbs on entry, eased with a cubic ease-out. Cheap, and it makes a static stat block feel alive.',
    visual: (
      <div
        style={{
          fontFamily: 'Archivo, sans-serif',
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: '-0.04em',
          color: '#fff',
          textShadow: '0 0 30px rgba(168,85,247,.6)',
        }}
      >
        60<span style={{ fontSize: 18, opacity: 0.6 }}>fps</span>
      </div>
    ),
  },
]

function Effects() {
  return (
    <section className="sx-sec" id="effects">
      <div className="shell">
        <SectionHead
          kicker="the toolkit, on scroll"
          title={
            <>
              Eight effects, <em>all of them yours</em>
            </>
          }
          lede="Each card runs the real animation — these are the same keyframes the page itself uses, not screenshots. Hover a card to see the object respond."
        />

        <div className="sx-fx-grid">
          {FX.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 110}>
              <article className="sx-fx">
                <div className="sx-fx-visual">
                  <div className="grid-bg" />
                  {f.visual}
                </div>
                <div className="sx-fx-body">
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* final CTA                                                           */
/* ------------------------------------------------------------------ */

function FinalCta() {
  const sparks = useMemo(
    () => [
      { x: 14, y: 30, s: 22, d: 0 },
      { x: 30, y: 16, s: 14, d: 0.6 },
      { x: 72, y: 22, s: 26, d: 1.1 },
      { x: 86, y: 40, s: 16, d: 1.7 },
      { x: 46, y: 74, s: 18, d: 2.1 },
    ],
    [],
  )

  return (
    <section className="sx-cta" id="cta">
      <Sparkles spots={sparks} />
      <div className="shell">
        <Reveal>
          <div className="kicker" style={{ justifyContent: 'center' }}>
            take it apart
          </div>
        </Reveal>
        <Reveal delay={110}>
          <h2>
            Steal the
            <br />
            <em>whole system.</em>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p>
            The teardown page breaks down every primitive with copy-paste CSS. The lore page shows
            the same engine pointed at completely different subject matter.
          </p>
        </Reveal>
        <Reveal delay={290}>
          <div className="sx-cta-actions">
            <a className="btn btn-primary" href="./system.html">
              Read the breakdown
            </a>
            <a className="btn btn-ghost" href="./lore.html">
              See the lore sample ↗
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* page                                                                */
/* ------------------------------------------------------------------ */

export default function ScrollApp() {
  const pageProgress = usePageProgress()
  useScrollVar()

  return (
    <div className="sx-root">
      <div className="page-glow" />
      <div className="page-grain" />

      <header className="sx-nav">
        <div className="shell sx-nav-inner">
          <a className="brand" href="#top" style={{ color: 'inherit', textDecoration: 'none' }}>
            <span className="brand-mark" />
            Glowkit
          </a>
          <nav className="sx-nav-links">
            <a href="#how">How it works</a>
            <a href="#chain">The chain</a>
            <a href="#effects">Effects</a>
            <a href="./lore.html">Lore ↗</a>
            <a href="./system.html">System ↗</a>
          </nav>
          <a className="pill" href="#cta" style={{ textDecoration: 'none' }}>
            scroll-driven
          </a>
        </div>
        <div className="sx-progress" aria-hidden="true">
          <i style={{ transform: `scaleX(${pageProgress})` }} />
        </div>
      </header>

      <main>
        <Hero />
        <Marquee />
        <Features />
        <div className="shell">
          <div className="divider" />
        </div>
        <ScrollDiagram />
        <ScrubText />
        <Stats />
        <Effects />
        <FinalCta />
      </main>

      <footer>
        <div className="shell foot">
          <div>GLOWKIT — scroll-driven motion system</div>
          <div>React · CSS · SVG · no video assets</div>
        </div>
      </footer>
    </div>
  )
}
