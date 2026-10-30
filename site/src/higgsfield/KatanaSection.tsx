import { useEffect, useMemo, useState } from 'react'
import { Player } from '../scene-player'
import { hf, type HfStatus } from './client'
import {
  KATANA_PRESETS,
  PRESET_BY_ID,
  estimateCredits,
  presetToScene,
  suggestPreset,
  type KatanaPreset,
} from './presets'

/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { status: HfStatus | null }) {
  const tone = !status
    ? { c: '#6f6889', t: 'checking…' }
    : status.configured
      ? { c: '#d9ff3d', t: 'API key live' }
      : { c: '#c084fc', t: 'local mode' }

  return (
    <span
      className="pill"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        borderColor: `${tone.c}66`,
        color: tone.c,
        background: `${tone.c}14`,
      }}
      title={status?.note}
    >
      <i
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: tone.c,
          boxShadow: `0 0 8px ${tone.c}`,
          display: 'block',
        }}
      />
      {tone.t}
    </span>
  )
}

function PresetCard({
  preset,
  active,
  onPick,
}: {
  preset: KatanaPreset
  active: boolean
  onPick: () => void
}) {
  return (
    <button
      onClick={onPick}
      style={{
        textAlign: 'left',
        cursor: 'pointer',
        padding: '15px 16px 16px',
        borderRadius: 14,
        border: `1px solid ${active ? 'rgba(216,180,254,.85)' : 'rgba(168,132,255,.16)'}`,
        background: active
          ? 'linear-gradient(180deg, rgba(88,28,135,.55), rgba(20,11,32,.8))'
          : 'linear-gradient(180deg, rgba(19,11,32,.7), rgba(9,5,16,.5))',
        boxShadow: active ? '0 0 34px -12px rgba(168,85,247,.95)' : 'none',
        transition: 'border-color .25s, background .25s, transform .25s',
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
        color: 'inherit',
        font: 'inherit',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 13.5, letterSpacing: '-0.01em' }}>
          {preset.name}
        </span>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            letterSpacing: '.08em',
            color: '#9a93b4',
            whiteSpace: 'nowrap',
          }}
        >
          {estimateCredits(preset)} cr
        </span>
      </span>
      <span style={{ fontSize: 12, color: '#918aa8', lineHeight: 1.45 }}>{preset.tagline}</span>
      <span
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 9.5,
          color: '#7f7898',
          letterSpacing: '.02em',
          lineHeight: 1.5,
        }}
      >
        {preset.camera}
      </span>
      <span style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 2 }}>
        {preset.keywords.slice(0, 3).map((k) => (
          <span className="tag" key={k} style={{ fontSize: 8, padding: '2px 6px' }}>
            {k}
          </span>
        ))}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ */

export function KatanaSection() {
  const [status, setStatus] = useState<HfStatus | null>(null)
  const [activeId, setActiveId] = useState<string>('crash-zoom')
  const [head, setHead] = useState('CRASH ZOOM')
  const [brief, setBrief] = useState('a hook that stops the scroll')

  useEffect(() => {
    let alive = true
    hf.status()
      .then((s) => alive && setStatus(s))
      .catch(() => alive && setStatus(null))
    return () => {
      alive = false
    }
  }, [])

  const preset = PRESET_BY_ID[activeId] ?? KATANA_PRESETS[0]

  const scene = useMemo(
    () =>
      presetToScene(preset, {
        head: head || preset.name.toUpperCase(),
        sub: `${preset.camera} · strength ${preset.strength}`,
        kicker: `katana · ${preset.id}`,
      }),
    [preset, head],
  )

  const suggested = useMemo(() => suggestPreset(brief), [brief])

  const applySuggestion = () => {
    setActiveId(suggested.id)
    setHead(suggested.name.toUpperCase())
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }} className="katana-grid">
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 18,
          }}
        >
          <StatusBadge status={status} />
          <span className="pill" style={{ borderColor: 'rgba(168,132,255,.22)', color: '#9a93b4' }}>
            mcp.higgsfield.ai/mcp
          </span>
          <span className="pill" style={{ borderColor: 'rgba(168,132,255,.22)', color: '#9a93b4' }}>
            katana-mcp · local
          </span>
        </div>

        <div className="field">
          <label>Brief → preset (deterministic match)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="what the shot has to do"
            />
            <button className="btn btn-ghost" onClick={applySuggestion} style={{ flex: '0 0 auto' }}>
              Apply
            </button>
          </div>
          <span style={{ fontSize: 11.5, color: '#7f7898', fontFamily: 'JetBrains Mono, monospace' }}>
            suggests → {suggested.name}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(238px, 1fr))',
            gap: 12,
            marginTop: 20,
          }}
        >
          {KATANA_PRESETS.map((p) => (
            <PresetCard
              key={p.id}
              preset={p}
              active={p.id === activeId}
              onPick={() => {
                setActiveId(p.id)
                setHead(p.name.toUpperCase())
              }}
            />
          ))}
        </div>

        <div className="field" style={{ marginTop: 24 }}>
          <label>Headline for this preset (feeds the scene engine)</label>
          <input value={head} onChange={(e) => setHead(e.target.value)} />
        </div>

        {status && !status.configured ? (
          <p style={{ fontSize: 12.5, marginTop: 16, color: '#8d86a4', lineHeight: 1.6 }}>
            <strong style={{ color: '#c084fc' }}>Local mode.</strong> {status.note} Set{' '}
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#d8b4fe' }}>
              HF_API_KEY_ID
            </code>{' '}
            and{' '}
            <code style={{ fontFamily: 'JetBrains Mono, monospace', color: '#d8b4fe' }}>
              HF_API_KEY_SECRET
            </code>{' '}
            to pull the live motion catalog and enable generation.
          </p>
        ) : null}
      </div>

      <div className="builder-out">
        <Player scenes={[scene]} hook={`Katana · ${preset.name}`} />
        <pre className="code-mini" style={{ width: '100%', maxWidth: 372 }}>
          {JSON.stringify(
            {
              preset: preset.id,
              camera: preset.camera,
              strength: preset.strength,
              seconds: preset.seconds,
              credits: estimateCredits(preset),
              scene: { motion: scene.motion, ms: scene.ms, size: scene.size },
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  )
}
