import { useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------
   Scroll + reveal primitives.
   All of it is IntersectionObserver / rAF — no animation library.
   ------------------------------------------------------------------ */

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const set = () => setReduced(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])
  return reduced
}

/**
 * Fires once when the element first enters the viewport.
 * Returns a ref and a boolean; add `.is-in` to whatever you attach it to.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string; once?: boolean } = {},
) {
  const { threshold = 0.18, rootMargin = '0px 0px -12% 0px', once = true } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true)
            if (once) io.disconnect()
          } else if (!once) {
            setInView(false)
          }
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, inView] as const
}

/**
 * How far a (usually tall) section has been scrolled through: 0 at the moment
 * its top hits the viewport top, 1 when its bottom reaches the viewport bottom.
 * Used to drive the sticky diagram and the scroll-highlight paragraph.
 */
export function useSectionProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const calc = () => {
      const r = el.getBoundingClientRect()
      const travel = r.height - window.innerHeight
      const passed = -r.top
      const v = travel <= 0 ? (r.top <= 0 ? 1 : 0) : passed / travel
      setP(Math.min(1, Math.max(0, v)))
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(calc)
    }

    calc()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return [ref, p] as const
}

/** Whole-page scroll progress for the top bar. */
export function usePageProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const calc = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(calc)
    }
    calc()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return p
}

/**
 * Publishes scrollY as a unitless CSS variable `--sy` on <html>, so decorative
 * parallax can be pure CSS: translateY(calc(var(--sy) * 0.12px)).
 * No React re-render per frame.
 */
export function useScrollVar() {
  useEffect(() => {
    let raf = 0
    const set = () => {
      document.documentElement.style.setProperty('--sy', String(window.scrollY))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(set)
    }
    set()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
}

/** Eased count-up that starts when `active` flips true. */
export function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!active) return
    if (reduced) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration, reduced])

  return value
}
