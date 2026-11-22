import { useEffect } from 'react'
import Lenis from 'lenis'
import { useStore } from '../store'

let lenis = null
export const getLenis = () => lenis

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

export function useSmoothScroll() {
  const loaded = useStore((s) => s.loaded)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.3 })
    let id
    const raf = (time) => {
      lenis?.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !loaded)
    if (!lenis) return
    if (loaded) lenis.start()
    else lenis.stop()
  }, [loaded])
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.8, easing: easeOutQuart })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function lockScroll(locked) {
  if (!lenis) {
    document.documentElement.classList.toggle('is-locked', locked)
    return
  }
  if (locked) lenis.stop()
  else lenis.start()
}
