import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useStore } from '../store'
import { EASE_IN_OUT } from './ui'

/** Builds a wavy liquid surface as a clip-path polygon. */
function liquidClip(level, time) {
  const pts = ['0% 100%']
  const steps = 24
  const amp = level <= 0 || level >= 100 ? 0 : 2.2
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100
    const y = 100 - level + Math.sin(i * 0.55 + time * 3.2) * amp + Math.sin(i * 0.23 - time * 2.1) * amp * 0.6
    pts.push(`${x}% ${Math.max(0, Math.min(100, y)).toFixed(2)}%`)
  }
  pts.push('100% 100%')
  return `polygon(${pts.join(',')})`
}

export default function Preloader() {
  const setLoaded = useStore((s) => s.setLoaded)
  const sceneReady = useStore((s) => s.sceneReady)
  const [state, setState] = useState({ p: 0, clip: liquidClip(0, 0) })
  const [done, setDone] = useState(false)
  const ready = useRef({ fonts: false, scene: false, forced: false })
  ready.current.scene = sceneReady

  useEffect(() => {
    Promise.all([
      document.fonts.load('italic 400 120px "Bodoni Moda Variable"'),
      document.fonts.load('400 120px "Bodoni Moda Variable"'),
      document.fonts.load('400 16px "Jost Variable"'),
      document.fonts.load('400 12px "IBM Plex Mono"'),
    ])
      .catch(() => {})
      .finally(() => {
        ready.current.fonts = true
      })

    const force = setTimeout(() => (ready.current.forced = true), 7000)
    const start = performance.now()
    let raf
    let val = 0
    let finished = false
    let exitTimer

    const tick = (now) => {
      const r = ready.current
      const isReady = r.forced || (r.fonts && r.scene)
      const timeCap = Math.min(100, ((now - start) / 2100) * 100)
      const target = Math.min(isReady ? 100 : 84, timeCap)
      val += (target - val) * 0.065
      if (target === 100 && val > 99.5) val = 100
      setState({ p: val, clip: liquidClip(val, (now - start) / 1000) })
      if (val >= 100) {
        if (!finished) {
          finished = true
          exitTimer = setTimeout(() => {
            setDone(true)
            setLoaded(true)
          }, 380)
        }
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(force)
      clearTimeout(exitTimer)
    }
  }, [setLoaded])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 1.15, ease: EASE_IN_OUT }}
        >
          <div className="preloader__row">
            <span className="eyebrow">Maison de parfum</span>
            <span className="eyebrow">Extraits — Grasse</span>
          </div>

          <div className="preloader__mark" aria-label="Sillage">
            <span className="preloader__outline">Sillage</span>
            <span className="preloader__fill" style={{ clipPath: state.clip }} aria-hidden="true">
              Sillage
            </span>
          </div>

          <div className="preloader__row">
            <span className="eyebrow">Distilling a first impression</span>
            <span className="preloader__count">
              {String(Math.round(state.p)).padStart(3, '0')}
              <small>%</small>
            </span>
          </div>
          <div className="preloader__bar">
            <span style={{ transform: `scaleX(${state.p / 100})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
