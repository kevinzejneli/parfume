import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT = [0.76, 0, 0.24, 1]

/** Button that leans toward the pointer, with a liquid fill on hover. */
export function MagneticButton({ children, className = '', strength = 0.32, ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 })
  const lx = useTransform(sx, (v) => v * 0.45)
  const ly = useTransform(sy, (v) => v * 0.45)

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button ref={ref} className={`mbtn ${className}`} style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset} {...rest}>
      <span className="mbtn__fill" aria-hidden="true" />
      <motion.span className="mbtn__label" style={{ x: lx, y: ly }}>
        {children}
      </motion.span>
    </motion.button>
  )
}

/** Text that rolls to a duplicate of itself on hover of its parent. */
export function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll__a">{children}</span>
      <span className="roll__b" aria-hidden="true">
        {children}
      </span>
    </span>
  )
}

export function Arrow({ dir = 'right', size = 18 }) {
  const rotate = { right: 0, left: 180, up: -90, down: 90 }[dir]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d="M3 12h17M14 6l6 6-6 6" />
    </svg>
  )
}

/** Headline whose lines rise out of masks — on mount (play) or when scrolled into view. */
export function RevealLines({ lines, className = '', as: Tag = 'h2', delay = 0, play }) {
  const trigger =
    play === undefined
      ? { whileInView: { y: '0%' }, viewport: { once: true, margin: '-10% 0px' } }
      : { animate: { y: play ? '0%' : '115%' } }
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <motion.span className="line__inner" initial={{ y: '115%' }} {...trigger} transition={{ duration: 1.25, ease: EASE, delay: delay + i * 0.1 }}>
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function FadeIn({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Comp>
  )
}
