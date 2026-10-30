import { useMemo } from 'react'
import type { Edge, Node, Scene, Spark } from './scenes'

/* ------------------------------------------------------------------
   Device chrome — the "filmed a laptop on a desk" move.
   Cheap to draw, and it instantly sells the shot as a screen recording.
   ------------------------------------------------------------------ */

const DOCK_COLORS = [
  '#5b8cff', '#f4f4f6', '#a0a6b8', '#34c759', '#3b82f6', '#8b5cf6',
  '#f59e0b', '#ef4444', '#22d3ee', '#ec4899', '#84cc16', '#f97316',
  '#6366f1', '#14b8a6', '#e11d48', '#94a3b8', '#e2e8f0', '#d946ef',
]

const KB_ROWS = [
  ['esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'del'],
  ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'ret'],
  ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift'],
]

export function Chrome() {
  return (
    <div className="chrome">
      <div className="chrome-dots">
        <i />
        <i />
        <i />
      </div>
      <div className="chrome-menu">
        <span>Untitled Player</span>
        <span>File</span>
        <span>View</span>
        <span>Window</span>
      </div>
    </div>
  )
}

export function Dock() {
  return (
    <div className="dock" aria-hidden="true">
      <div className="dock-shelf">
        {DOCK_COLORS.map((c, i) => (
          <span className="dock-icon" key={i} style={{ background: c }} />
        ))}
      </div>
    </div>
  )
}

export function Keyboard() {
  return (
    <div className="keyboard" aria-hidden="true">
      {KB_ROWS.map((row, ri) => (
        <div className="kb-row" key={ri}>
          {row.map((k, ki) => (
            <span
              className={`kb-key${k === 'shift' || k === 'caps' || k === 'del' ? ' wide' : ''}`}
              key={ki}
            />
          ))}
        </div>
      ))}
      <div className="kb-row">
        <span className="kb-key wide" />
        <span className="kb-key" />
        <span className="kb-key space" />
        <span className="kb-key" />
        <span className="kb-key wide" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Bloom headline
   ------------------------------------------------------------------ */

function Headline({ scene }: { scene: Scene }) {
  const words = scene.head.split(' ')
  const accents = scene.accents ?? {}
  const motionClass =
    scene.motion === 'punch' ? 'punch' : scene.motion === 'wipe' ? 'wipe' : 'rise'

  return (
    <h3
      className={`glow-type ${motionClass}`}
      data-text={scene.head}
      data-blur="true"
      style={{
        fontSize: `${scene.size ?? 42}px`,
        textAlign: scene.align === 'center' ? 'center' : 'left',
        alignSelf: scene.align === 'center' ? 'center' : 'flex-start',
        maxWidth: '100%',
      }}
    >
      {words.map((w, i) => {
        const cls = accents[w] ?? accents[scene.head]
        const space = i < words.length - 1 ? ' ' : ''
        return (
          <span key={i} className={cls || undefined}>
            {w}
            {space}
          </span>
        )
      })}
    </h3>
  )
}

/* ------------------------------------------------------------------
   Typed-on subline — word by word, blur to sharp
   ------------------------------------------------------------------ */

function Subline({ text, delay = 0.35 }: { text: string; delay?: number }) {
  const words = text.split(' ')
  return (
    <p className="scene-sub">
      {words.map((w, i) => (
        <span
          className="w"
          key={i}
          style={{ animationDelay: `${delay + i * 0.055}s` }}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </p>
  )
}

/* ------------------------------------------------------------------
   Sparks
   ------------------------------------------------------------------ */

function Sparks({ sparks }: { sparks: Spark[] }) {
  return (
    <>
      {sparks.map((s, i) => (
        <span
          className="spark"
          key={i}
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              '--s': `${s.s}px`,
              '--delay': `${s.delay}s`,
              '--dur': '1.6s',
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------
   Diagram — nodes + self-drawing edges
   ------------------------------------------------------------------ */

function curve(a: Node, b: Node) {
  const x1 = a.x
  const y1 = a.y
  const x2 = b.x
  const y2 = b.y
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2 - 7
  return {
    d: `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`,
    x1,
    y1,
    x2,
    y2,
    mx,
    my,
  }
}

function Diagram({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
  const byId = useMemo(() => {
    const m: Record<string, Node> = {}
    nodes.forEach((n) => (m[n.id] = n))
    return m
  }, [nodes])

  return (
    <>
      <svg
        className="diagram"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(192,132,252,0.25)" />
            <stop offset="55%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="rgba(192,132,252,0.3)" />
          </linearGradient>
          <filter id="edgeGlow" x="-60%" y="-120%" width="220%" height="340%">
            <feGaussianBlur stdDeviation="0.9" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((e, i) => {
          const a = byId[e.from]
          const b = byId[e.to]
          if (!a || !b) return null
          const c = curve(a, b)
          return (
            <g className="draw" key={i}>
              <path
                d={c.d}
                fill="none"
                stroke="url(#edgeGrad)"
                strokeWidth="0.55"
                strokeDasharray="2 1.4"
                filter="url(#edgeGlow)"
                style={{ '--len': 160, '--delay': `${0.3 + i * 0.25}s` } as React.CSSProperties}
                vectorEffect="non-scaling-stroke"
              />
              {e.label ? (
                <text
                  x={c.mx}
                  y={c.my - 2}
                  fill="rgba(216,180,254,0.85)"
                  fontSize="2.4"
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="middle"
                  letterSpacing="0.1"
                >
                  {e.label}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>

      {nodes.map((n, i) => (
        <div
          className={`node-card ${n.tone}`}
          key={n.id}
          style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${0.12 + i * 0.16}s` }}
        >
          <div className="ticks">
            <i />
            <i />
            <i />
            <i />
          </div>
          {n.tag ? <span className="n-tag">{n.tag}</span> : null}
          <div className="n-title">{n.title}</div>
          {n.caption ? <div className="n-cap">{n.caption}</div> : null}
        </div>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------
   One scene
   ------------------------------------------------------------------ */

export function SceneBody({ scene, run }: { scene: Scene; run: number }) {
  return (
    <div className="cam" key={`${scene.id}-${run}`} style={{ ['--cam-dur' as string]: `${scene.ms}ms` }}>
      {scene.nodes?.length ? <Diagram nodes={scene.nodes} edges={scene.edges ?? []} /> : null}
      {scene.sparks?.length ? <Sparks sparks={scene.sparks} /> : null}
      <div
        className="scene"
        style={{
          alignItems: scene.align === 'center' ? 'center' : 'stretch',
          justifyContent: scene.nodes?.length ? 'flex-start' : 'center',
          paddingTop: scene.nodes?.length ? 14 : 16,
        }}
      >
        {scene.kicker ? <div className="scene-kicker rise">{scene.kicker}</div> : null}
        <Headline scene={scene} />
        {scene.sub ? <Subline text={scene.sub} delay={scene.motion === 'punch' ? 0.5 : 0.32} /> : null}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   The vertical stage player
   ------------------------------------------------------------------ */

export interface StageProps {
  scenes: Scene[]
  hook?: string
  showHook?: boolean
  showChrome?: boolean
  showKeyboard?: boolean
  showDock?: boolean
  sceneIndex?: number
  run?: number
}

export function Stage({
  scenes,
  hook,
  showHook = true,
  showChrome = true,
  showKeyboard = true,
  showDock = true,
  sceneIndex = 0,
  run = 0,
}: StageProps) {
  const scene = scenes[Math.min(sceneIndex, scenes.length - 1)]
  if (!scene) return null

  return (
    <div className="stage">
      {showHook ? (
        <div className="hookbar">
          <div className="hookbar-text">{hook ?? 'New model just dropped \ud83e\udd2f'}</div>
        </div>
      ) : null}

      {showChrome ? <Chrome /> : null}

      <div className="canvas">
        <div className="canvas-grid" />
        <div className="canvas-scan" />
        <SceneBody scene={scene} run={run} />
        <div className="canvas-vignette" />
      </div>

      {showDock ? <Dock /> : null}
      {showKeyboard ? <Keyboard /> : null}
    </div>
  )
}
