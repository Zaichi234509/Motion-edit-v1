import { useEffect, useMemo, useRef, useState } from 'react'
import { Player } from './scene-player'
import { Stage } from './stage'
import { SCENES, type Scene } from './scenes'
import { KatanaSection } from './higgsfield/KatanaSection'

/* ================================================================
   Small presentational helpers
   ================================================================ */

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
    <div className="sec-head">
      <div className="kicker">{kicker}</div>
      <h2>{title}</h2>
      {lede ? <p>{lede}</p> : null}
    </div>
  )
}

/* ================================================================
   Reference breakdown beats
   ================================================================ */

const BEATS = [
  {
    t: '00:00 – 00:08',
    title: 'Amber hook bar + first bloom',
    body: 'A flat amber gradient fills the top ~30% with one white line of hook copy. Under it the neon canvas appears and the first headline blooms out of a purple haze: “MOTION GRAPHICS”.',
    tags: ['hook bar', 'bloom type', 'punch-in'],
  },
  {
    t: '00:08 – 00:27',
    title: 'Question → answer in one frame',
    body: 'Headline lands in the top-left, a mono micro-label sits above a two-line sub, then a small screenshot flies in. The camera keeps a slow 1.06 → 1.00 push the entire time.',
    tags: ['camera push', 'mono label', 'wipe'],
  },
  {
    t: '00:27 – 00:45',
    title: 'Diagram that draws itself',
    body: 'Three framed boxes on a hairline grid. Connectors stroke on left-to-right with a glowing pulse, and the destination box gets a sparkle burst as it lands.',
    tags: ['draw-on', 'nodes', 'sparkles'],
  },
  {
    t: '00:45 – 01:05',
    title: 'Brand beat — the wordmark ignition',
    body: 'A 3D-ish blob loops behind a logo. The wordmark letters flip in with alternating lime / white fills and a star burst at each corner. Nothing else moves.',
    tags: ['logo', 'letter stagger', 'burst'],
  },
  {
    t: '01:05 – 01:25',
    title: 'Product UI as evidence',
    body: 'Real app screenshots, inset with rounded corners and a fake cursor. Copy stays in the top strip so the UI never fights the text.',
    tags: ['screenshots', 'inset', 'cursor'],
  },
  {
    t: '01:25 – 01:35',
    title: 'Comment-bait outro',
    body: 'Cut to a person in the neon-lit room. Giant outlined text “Comment KATANA” sits over them in lime. The last frame is a pure CTA card.',
    tags: ['talking head', 'outline type', 'CTA'],
  },
]

/* ================================================================
   Effect library — each card demos one primitive
   ================================================================ */

const EFFECTS: {
  name: string
  desc: string
  code: string
  demo: React.ReactNode
}[] = [
  {
    name: '01 · Bloom headline',
    desc: 'A white weight-900 headline with a five-stop text-shadow ladder, plus a blurred violet duplicate behind it. That double layer is the entire “neon sign” look — no WebGL needed.',
    code: `.glow-type{
  color:#fff;
  text-shadow:
    0 0 2px rgba(255,255,255,.95),
    0 0 14px rgba(233,213,255,.85),
    0 0 38px rgba(192,132,252,.9),
    0 0 78px rgba(168,85,247,.8);
}
.glow-type::before{
  content:attr(data-text);
  position:absolute; inset:0; z-index:-1;
  color:#a855f7; filter:blur(18px);
}`,
    demo: <div className="demo-glow">MOTION</div>,
  },
  {
    name: '02 · Word-by-word type-on',
    desc: 'Split the subline on spaces, give each word an opacity/blur/translate start state and a 55 ms stagger. Reads as “typing” without a caret or a character-by-character timer.',
    code: `.scene-sub .w{
  opacity:0; filter:blur(6px);
  transform:translateY(5px);
  animation:wordIn .5s var(--ease-out) forwards;
}
@keyframes wordIn{
  to{opacity:1;filter:blur(0);transform:none}
}
/* inline: style="animation-delay:{i*55}ms" */`,
    demo: (
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', padding: '0 24px' }}>
        {['one', 'word', 'at', 'a', 'time'].map((w, i) => (
          <span
            key={w}
            className="w"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 13,
              fontWeight: 600,
              color: '#efe6ff',
              animation: 'wordIn .5s cubic-bezier(.16,1,.3,1) forwards',
              animationDelay: `${i * 0.14}s`,
              opacity: 0,
              display: 'inline-block',
              animationIterationCount: 'infinite',
              animationDuration: '2.2s',
            }}
          >
            {w}
          </span>
        ))}
      </div>
    ),
  },
  {
    name: '03 · Sparkle burst',
    desc: 'A 4-point star is just a radial gradient clipped to an 8-point polygon. Pop it in at 1.15×, settle to 1×, fade out. Stagger three or four around a landing element.',
    code: `.spark{
  width:var(--s);height:var(--s);
  background:radial-gradient(closest-side,
    #fff,rgba(233,213,255,.85) 45%,transparent 72%);
  clip-path:polygon(50% 0,57% 43%,100% 50%,
    57% 57%,50% 100%,43% 57%,0 50%,43% 43%);
  animation:sparkPop 1.6s var(--ease-out) forwards;
}`,
    demo: (
      <>
        {[
          { x: 28, y: 34, s: 20, d: 0 },
          { x: 50, y: 22, s: 28, d: 0.15 },
          { x: 70, y: 40, s: 16, d: 0.3 },
          { x: 44, y: 62, s: 22, d: 0.45 },
          { x: 62, y: 68, s: 12, d: 0.6 },
        ].map((p, i) => (
          <span
            className="spark"
            key={i}
            style={
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                '--s': `${p.s}px`,
                '--delay': `${p.d}s`,
                '--dur': '2.4s',
                animationIterationCount: 'infinite',
              } as React.CSSProperties
            }
          />
        ))}
      </>
    ),
  },
  {
    name: '04 · Self-drawing connector',
    desc: 'Quadratic Bézier inside a 100×100 viewBox with preserveAspectRatio="none" so it scales with the panel. Animate stroke-dashoffset from the path length to 0 and blur-merge it for the glow.',
    code: `path{
  stroke-dasharray:var(--len);
  stroke-dashoffset:var(--len);
  animation:drawIn 1.1s var(--ease-out) forwards;
  filter:url(#edgeGlow); /* feGaussianBlur merge */
}
@keyframes drawIn{to{stroke-dashoffset:0}}`,
    demo: (
      <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%' }} aria-hidden="true">
        <defs>
          <filter id="miniGlow" x="-50%" y="-100%" width="200%" height="300%">
            <feGaussianBlur stdDeviation="1.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 12 40 Q 50 8 88 32"
          fill="none"
          stroke="#e9d5ff"
          strokeWidth="1.2"
          filter="url(#miniGlow)"
          style={{
            strokeDasharray: 110,
            strokeDashoffset: 110,
            animation: 'drawIn 1.4s cubic-bezier(.16,1,.3,1) forwards, breathe 3s ease-in-out 1.4s infinite',
          }}
        />
        <circle cx="12" cy="40" r="2.2" fill="#ff8a63" filter="url(#miniGlow)" />
        <circle cx="88" cy="32" r="2.2" fill="#d9ff3d" filter="url(#miniGlow)" />
      </svg>
    ),
  },
  {
    name: '05 · Framed node card',
    desc: 'Hairline border, 4 px corner ticks drawn as four 1 px borders, and a mono micro-label that breaks the top border. Inset glow instead of outer drop shadow keeps it crisp.',
    code: `.node-card{
  border:1px solid rgba(192,132,252,.75);
  border-radius:4px;
  box-shadow:
    0 0 28px -6px rgba(168,85,247,.6),
    inset 0 0 22px -10px rgba(192,132,252,.9);
}
.ticks i{position:absolute;width:6px;height:6px;
  border:1px solid rgba(216,180,254,.85);}`,
    demo: (
      <div className="demo-chrome">
        <div className="ticks">
          <i />
          <i />
          <i />
          <i />
        </div>
        <span style={{ fontSize: 8, letterSpacing: '0.2em', opacity: 0.7, display: 'block' }}>
          MCP SERVER
        </span>
        <span style={{ fontWeight: 800, letterSpacing: '0.06em', fontSize: 15 }}>YOUR NODE</span>
      </div>
    ),
  },
  {
    name: '06 · Scale punch (hard cut in)',
    desc: 'Start at 1.28× with 10 px of blur and 0 opacity, snap through the middle with an aggressive cubic-bezier, land at 1×. This is the “slam” that gives every headline its impact.',
    code: `@keyframes punch{
  0%  {transform:scale(1.28);filter:blur(10px);opacity:0}
  55% {opacity:1}
  100%{transform:scale(1);filter:blur(0)}
}
.punch{animation:punch .7s
  cubic-bezier(.7,0,.2,1) both;}`,
    demo: <div className="demo-punch">SLAM</div>,
  },
  {
    name: '07 · Camera push',
    desc: 'Never let the frame sit still. One transform on a wrapper — scale 1.06 → 1.00 across the whole scene duration. Combine with the grid to sell parallax.',
    code: `.cam{
  animation:camPush var(--dur) var(--ease-out) forwards;
}
@keyframes camPush{
  from{transform:scale(1.06)}
  to  {transform:scale(1)}
}`,
    demo: (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          animation: 'camPush 4s cubic-bezier(.16,1,.3,1) infinite alternate',
        }}
      >
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 6,
            border: '1px solid rgba(192,132,252,.7)',
            background: 'radial-gradient(circle at 40% 30%, rgba(168,85,247,.5), transparent 70%)',
          }}
        />
      </div>
    ),
  },
  {
    name: '08 · Neon grid + vignette',
    desc: 'Two 1 px gradients at 34 px spacing, radially masked so the edges fall off, then a scanline overlay at 3 px and a hard vignette. This is the “canvas” everything else sits on.',
    code: `.canvas-grid{
  background-image:
    linear-gradient(to right, rgba(176,138,255,.11) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(176,138,255,.11) 1px, transparent 1px);
  background-size:34px 34px;
  mask-image:radial-gradient(115% 85% at 50% 42%,#000 30%,transparent 88%);
}
.canvas-vignette{
  background:radial-gradient(115% 115% at 50% 46%,
    transparent 38%,rgba(0,0,0,.88) 100%);
}`,
    demo: (
      <>
        <div className="mini-grid" />
        <div
          style={{
            position: 'relative',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 10,
            letterSpacing: '0.24em',
            color: 'rgba(216,180,254,.8)',
            textAlign: 'center',
          }}
        >
          CANVAS
          <div style={{ fontSize: 8, opacity: 0.55, marginTop: 6 }}>34 × 34 PX GRID</div>
        </div>
      </>
    ),
  },
  {
    name: '09 · Device chrome',
    desc: 'A 18 px QuickTime title bar with traffic lights, a dock row of 11 px squares and a blurred keycap grid. Rounded into a phone frame it reads as “screen recording” in one glance.',
    code: `<div class="chrome">
  <div class="chrome-dots"><i/><i/><i/></div>
  <div class="chrome-menu">Untitled Player</div>
</div>
<div class="dock"><div class="dock-shelf">…</div></div>
<div class="keyboard">…keycaps…</div>`,
    demo: (
      <div style={{ width: '100%', padding: '0 14px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 7px',
            borderRadius: '5px 5px 0 0',
            background: 'rgba(8,5,15,.95)',
            border: '1px solid rgba(168,132,255,.16)',
            borderBottom: 'none',
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#28c840' }} />
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 6.5,
              color: '#6a6285',
              marginLeft: 4,
            }}
          >
            Untitled Player
          </span>
        </div>
        <div
          style={{
            height: 46,
            border: '1px solid rgba(168,132,255,.16)',
            borderTop: 'none',
            borderRadius: '0 0 5px 5px',
            background:
              'radial-gradient(90% 120% at 50% 0%, rgba(107,33,168,.55), transparent 70%), #0a0514',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: '#e9d5ff' }}>
            SCREEN
          </span>
        </div>
      </div>
    ),
  },
]

/* ================================================================
   Recipe / stack
   ================================================================ */

const RECIPE = [
  {
    n: '01',
    h: 'Layer the stage, don’t animate images',
    p: 'Every beat is a DOM node. Hook bar, chrome bar, canvas, dock, keyboard — five flex children in a 9:16 container. Change one ratio and the whole composition reflows.',
  },
  {
    n: '02',
    h: 'One easing family',
    p: 'Use exactly two curves: ease-out (cubic-bezier(.16,1,.3,1)) for entrances and a snappy one (.7,0,.2,1) for punches. Most “amateur” motion is just too many easings.',
  },
  {
    n: '03',
    h: 'Bloom, don’t glow harder',
    p: 'A single big text-shadow looks flat. Stack five shadows from 2px to 140px and add one blurred ::before duplicate. That is what makes type look like it is emitting light.',
  },
  {
    n: '04',
    h: 'Stagger by 50–160 ms',
    p: 'Words at 55 ms, nodes at 160 ms, sparks at 150 ms. Tight enough to read as one gesture, loose enough to feel designed.',
  },
  {
    n: '05',
    h: 'Keep the frame moving',
    p: 'A 1.06 → 1.00 camera push on every scene costs one transform and removes all the dead air between beats.',
  },
  {
    n: '06',
    h: 'Record once, export anywhere',
    p: 'Run the site, capture the phone frame at 60 fps with Playwright + ffmpeg, or just screen-record the live preview. No render farm, no codec math.',
  },
]

const PALETTE = [
  { c: '#06040b', name: 'Void', hex: '06040B', fg: '#fff' },
  { c: 'linear-gradient(150deg,#d99427,#8a5614)', name: 'Amber hook', hex: 'D99427', fg: '#fff' },
  { c: '#6b21a8', name: 'Violet deep', hex: '6B21A8', fg: '#fff' },
  { c: '#a855f7', name: 'Signal violet', hex: 'A855F7', fg: '#fff' },
  { c: '#e9d5ff', name: 'Bloom white', hex: 'E9D5FF', fg: '#241540' },
  { c: '#d9ff3d', name: 'Lime accent', hex: 'D9FF3D', fg: '#20260a' },
  { c: '#ff8a63', name: 'Coral accent', hex: 'FF8A63', fg: '#2b0d04' },
]

/* ================================================================
   Builder — plug your own copy in
   ================================================================ */

const ACCENTS = [
  { id: 'accent-violet', label: 'Violet', swatch: '#c084fc' },
  { id: 'accent-lime', label: 'Lime', swatch: '#d9ff3d' },
  { id: 'accent-coral', label: 'Coral', swatch: '#ff8a63' },
  { id: 'hot', label: 'Amber', swatch: '#ffd166' },
] as const

function Builder() {
  const [hook, setHook] = useState('I rebuilt my whole edit in a browser 🤯')
  const [head, setHead] = useState('ONE PROMPT')
  const [sub, setSub] = useState('type your own line here and watch it bloom on')
  const [accent, setAccent] = useState<(typeof ACCENTS)[number]['id']>('accent-violet')
  const [showHook, setShowHook] = useState(true)
  const [showChrome, setShowChrome] = useState(true)
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [showDock, setShowDock] = useState(true)
  const [copied, setCopied] = useState(false)

  const scenes: Scene[] = useMemo(
    () => [
      {
        id: 'custom',
        label: 'Your beat',
        ms: 4200,
        kicker: 'made with glowkit',
        head: head || 'YOUR HEADLINE',
        accents: { [head || 'YOUR HEADLINE']: accent },
        sub,
        sparks: [
          { x: 22, y: 32, s: 16, delay: 0.2 },
          { x: 70, y: 28, s: 24, delay: 0.4 },
          { x: 52, y: 66, s: 14, delay: 0.62 },
        ],
        motion: 'punch',
        size: Math.max(26, Math.min(58, 320 / Math.max(6, head.length))),
        align: 'center',
      },
      ...SCENES.slice(1, 3),
    ],
    [head, sub, accent],
  )

  const json = useMemo(
    () =>
      JSON.stringify(
        {
          hook,
          scene: {
            head,
            sub,
            accent,
            motion: 'punch',
            sparks: 3,
          },
        },
        null,
        2,
      ),
    [hook, head, sub, accent],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const toggle = (
    label: string,
    value: boolean,
    set: React.Dispatch<React.SetStateAction<boolean>>,
  ) => (
    <button className="sw" data-on={value} onClick={() => set(!value)}>
      <i style={{ background: value ? '#d8b4fe' : '#3b3355' }} />
      {label}
    </button>
  )

  return (
    <div className="builder">
      <div>
        <div className="field">
          <label>Hook bar copy</label>
          <input value={hook} onChange={(e) => setHook(e.target.value)} />
        </div>
        <div className="field">
          <label>Headline</label>
          <input value={head} onChange={(e) => setHead(e.target.value)} />
        </div>
        <div className="field">
          <label>Subline (types on, word by word)</label>
          <textarea rows={3} value={sub} onChange={(e) => setSub(e.target.value)} />
        </div>

        <div className="field">
          <label>Accent</label>
          <div className="swatches">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                className="sw"
                data-on={accent === a.id}
                onClick={() => setAccent(a.id)}
              >
                <i style={{ background: a.swatch }} />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Layers</label>
          <div className="swatches">
            {toggle('Hook bar', showHook, setShowHook)}
            {toggle('Chrome', showChrome, setShowChrome)}
            {toggle('Dock', showDock, setShowDock)}
            {toggle('Keyboard', showKeyboard, setShowKeyboard)}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button className="btn btn-primary" onClick={copy}>
            {copied ? '✓ Copied' : 'Copy scene JSON'}
          </button>
          <a className="btn btn-ghost" href="#effects">
            Browse effects
          </a>
        </div>
      </div>

      <div className="builder-out">
        <div className="stage-phone">
          <PlayerInner
            scenes={scenes}
            hook={hook}
            showHook={showHook}
            showChrome={showChrome}
            showKeyboard={showKeyboard}
            showDock={showDock}
          />
        </div>
        <pre className="code-mini" style={{ width: '100%', maxWidth: 372 }}>
          {json}
        </pre>
      </div>
    </div>
  )
}

/* The builder needs the player *inside* the phone shell. */
function PlayerInner(props: {
  scenes: Scene[]
  hook: string
  showHook: boolean
  showChrome: boolean
  showKeyboard: boolean
  showDock: boolean
}) {
  const [i, setI] = useState(0)
  const [run, setRun] = useState(0)
  const t = useRef<number | undefined>(undefined)
  const scene = props.scenes[i] ?? props.scenes[0]

  useEffect(() => {
    if (!scene) return
    t.current = window.setTimeout(() => {
      setI((p) => (p + 1) % props.scenes.length)
      setRun((r) => r + 1)
    }, scene.ms)
    return () => clearTimeout(t.current)
  }, [i, run, scene, props.scenes.length])

  return (
    <Stage
      scenes={props.scenes}
      hook={props.hook}
      showHook={props.showHook}
      showChrome={props.showChrome}
      showKeyboard={props.showKeyboard}
      showDock={props.showDock}
      sceneIndex={i}
      run={run}
    />
  )
}

/* ================================================================
   Page
   ================================================================ */

export default function App() {
  return (
    <>
      <div className="page-glow" />
      <div className="page-grain" />

      <header className="topbar">
        <div className="shell topbar-inner">
          <div className="brand">
            <span className="brand-mark" />
            Glowkit
          </div>
          <nav className="topnav">
            <a href="#breakdown">Breakdown</a>
            <a href="#effects">Effects</a>
            <a href="#builder">Playground</a>
            <a href="#katana">Katana</a>
            <a href="#recipe">Stack</a>
          </nav>
          <a className="pill" href="./" style={{ textDecoration: 'none' }}>
            ← Scroll site
          </a>
          <a className="pill" href="./lore.html" style={{ textDecoration: 'none' }}>
            Lore sample ↗
          </a>
        </div>
      </header>

      <main>
        {/* ---------------- HERO ---------------- */}
        <section className="shell hero">
          <div>
            <div className="kicker">teardown + rebuild</div>
            <h1>
              That neon reel
              <em>is just six effects.</em>
            </h1>
            <p className="hero-lede">
              The reference video is a 95-second vertical short: an amber hook bar, a moving neon
              grid canvas, bloom headlines that slam in, self-drawing diagrams, sparkle bursts and
              device chrome. Below is a working web rebuild of all of it — type your own copy into
              the playground and the same system renders it.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#builder">
                Plug in your content →
              </a>
              <a className="btn btn-ghost" href="#effects">
                See the 9 effects
              </a>
              <a className="btn btn-ghost" href="./lore.html">
                Genshin lore sample ↗
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <b>95s</b>
                <span>reference runtime</span>
              </div>
              <div className="stat">
                <b>6</b>
                <span>repeated primitives</span>
              </div>
              <div className="stat">
                <b>0</b>
                <span>video assets needed</span>
              </div>
              <div className="stat">
                <b>720 × 1280</b>
                <span>master frame</span>
              </div>
            </div>
          </div>

          <Player />
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ---------------- BREAKDOWN ---------------- */}
        <section className="shell sec" id="breakdown">
          <SectionHead
            kicker="shot by shot"
            title={
              <>
                What the reel is <em>actually</em> doing
              </>
            }
            lede="Nothing in the reference video is a one-off. It is the same six moves re-applied to new copy for 95 seconds. Here is the beat map, pulled from the file frame by frame."
          />
          <div className="beats">
            {BEATS.map((b) => (
              <div className="beat" key={b.t}>
                <div className="beat-time">{b.t}</div>
                <div>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </div>
                <div className="beat-tags">
                  {b.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ---------------- EFFECTS ---------------- */}
        <section className="shell sec" id="effects">
          <SectionHead
            kicker="the whole toolkit"
            title={
              <>
                Nine primitives, <em>infinite</em> videos
              </>
            }
            lede="Each card is live — the animation you see is the actual CSS from the reference rebuild, and the snippet underneath is copy-paste ready."
          />
          <div className="effects-grid">
            {EFFECTS.map((e) => (
              <article className="effect" key={e.name}>
                <div className="effect-demo">
                  <div className="mini-grid" />
                  <span className="demo-label">{e.name.split(' · ')[1]}</span>
                  {e.demo}
                </div>
                <div className="effect-body">
                  <h3>{e.name}</h3>
                  <p>{e.desc}</p>
                  <pre className="code-mini">{e.code}</pre>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ---------------- BUILDER ---------------- */}
        <section className="shell sec" id="builder">
          <SectionHead
            kicker="your content, same system"
            title={
              <>
                Type it in, <em>watch it glow</em>
              </>
            }
            lede="This is the part that makes it a website and not a video: the copy is data. Edit the fields on the left and the same scene engine re-renders on the right — no re-render pass, no After Effects."
          />
          <Builder />
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ---------------- KATANA / HIGGSFIELD ---------------- */}
        <section className="shell sec" id="katana">
          <SectionHead
            kicker="installed · mcp + api"
            title={
              <>
                Katana presets, <em>wired in</em>
              </>
            }
            lede="The reel's Katana catalog is a set of named camera recipes you pick instead of prompting. Here it is as real infrastructure: a local MCP server (katana-mcp) exposes the presets and scene builder as agent tools, and /api/hf/* proxies Higgsfield server-side so no key ever reaches the browser. Pick a preset and the stage re-renders with its camera move."
          />
          <KatanaSection />
        </section>

        <div className="shell">
          <div className="divider" />
        </div>

        {/* ---------------- RECIPE ---------------- */}
        <section className="shell sec" id="recipe">
          <SectionHead
            kicker="how to build it"
            title={
              <>
                The <em>build order</em>
              </>
            }
            lede="If you are rebuilding this for another brand, follow these six steps in order. Skip step 2 and it will look like a slide deck; skip step 5 and it will feel dead."
          />
          <div className="recipe-grid">
            {RECIPE.map((r) => (
              <div className="recipe" key={r.n}>
                <span className="recipe-num">{r.n}</span>
                <h3>{r.h}</h3>
                <p>{r.p}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 54 }}>
            <div className="kicker" style={{ marginBottom: 16 }}>
              palette
            </div>
            <div className="palette">
              {PALETTE.map((p) => (
                <div className="pal" key={p.name} style={{ background: p.c, color: p.fg }}>
                  <b style={{ color: p.fg }}>{p.name}</b>
                  <span style={{ color: p.fg, opacity: 0.7 }}>#{p.hex}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="recipe"
            style={{ marginTop: 30, display: 'grid', gap: 12, gridTemplateColumns: '1fr' }}
          >
            <div className="kicker">record it to mp4</div>
            <p style={{ fontSize: 13.5 }}>
              Open this page, size the phone shell to 720 × 1280, then either screen-record the
              live preview at 60 fps or script it with Playwright headless capture and stitch with{' '}
              <code>ffmpeg -framerate 60 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p out.mp4</code>
              . Because every beat is deterministic CSS, the export is frame-accurate and
              re-renderable after a copy change.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell foot">
          <div>GLOWKIT — a web motion system, rebuilt from a reference reel</div>
          <div>React · CSS · SVG · no video assets</div>
        </div>
      </footer>
    </>
  )
}
