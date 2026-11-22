import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

export default function Cursor() {
  const [enabled] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.5 })
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = (e) => {
      const t = e.target.closest?.('a, button, [data-cursor], input, label, select')
      setHover(!!t)
      setLabel(t?.dataset?.cursor || '')
    }
    const press = () => setDown(true)
    const release = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden="true" />
      <motion.div
        className={`cursor-ring${hover ? ' is-hover' : ''}${label ? ' has-label' : ''}${down ? ' is-down' : ''}`}
        style={{ x: sx, y: sy }}
        aria-hidden="true"
      >
        <span className="cursor-ring__inner">
          <span className="cursor-ring__label">{label}</span>
        </span>
      </motion.div>
    </>
  )
}
