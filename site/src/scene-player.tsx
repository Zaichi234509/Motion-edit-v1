import { useEffect, useRef, useState } from 'react'
import { SCENES, type Scene } from './scenes'
import { Stage } from './stage'

export interface PlayerProps {
  scenes?: Scene[]
  hook?: string
  showHook?: boolean
  showChrome?: boolean
  showKeyboard?: boolean
  showDock?: boolean
  /** scene to open on — useful when jumping from a chapter list */
  startIndex?: number
}

export function Player({
  scenes = SCENES,
  hook,
  showHook = true,
  showChrome = true,
  showKeyboard = true,
  showDock = true,
  startIndex = 0,
}: PlayerProps) {
  const [i, setI] = useState(() => Math.max(0, Math.min(startIndex, scenes.length - 1)))
  const [run, setRun] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [fill, setFill] = useState(0)
  const timer = useRef<number | undefined>(undefined)

  const scene = scenes[i] ?? scenes[0]

  // advance scenes on a plain timer — no rAF, no 60fps React re-renders
  useEffect(() => {
    if (!playing || !scene) return
    setFill(0)
    const start = performance.now()
    const id = window.setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / scene.ms)
      setFill(p)
    }, 90)
    timer.current = window.setTimeout(() => {
      setI((prev) => (prev + 1) % scenes.length)
      setRun((r) => r + 1)
    }, scene.ms)
    return () => {
      clearInterval(id)
      clearTimeout(timer.current)
    }
  }, [i, playing, run, scene, scenes.length])

  const jump = (next: number) => {
    setI(next)
    setRun((r) => r + 1)
  }

  return (
    <div className="stage-wrap">
      <div className="stage-phone">
        <Stage
          scenes={scenes}
          hook={hook}
          showHook={showHook}
          showChrome={showChrome}
          showKeyboard={showKeyboard}
          showDock={showDock}
          sceneIndex={i}
          run={run}
        />
      </div>

      <div className="player-bar">
        <button
          className="player-btn"
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❚❚' : '▶'}
        </button>
        <div className="player-track">
          <div
            className="player-fill"
            style={{
              width: `${((i + fill) / scenes.length) * 100}%`,
              transition: 'width 120ms linear',
            }}
          />
        </div>
        <span style={{ minWidth: 54, textAlign: 'right' }}>
          {String(i + 1).padStart(2, '0')}/{String(scenes.length).padStart(2, '0')}
        </span>
      </div>

      <div className="player-chips">
        {scenes.map((s, idx) => (
          <button
            key={s.id}
            className="chip"
            data-on={idx === i}
            onClick={() => jump(idx)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
