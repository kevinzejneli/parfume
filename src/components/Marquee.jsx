import { Fragment, useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'

const wrap = (min, max, v) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/** A ticker whose speed and skew react to scroll velocity. */
function Row({ children, baseVelocity = 2, className = '' }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const skew = useTransform(smooth, [-2500, 2500], [7, -7])
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    let move = direction.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) direction.current = -1
    else if (f > 0) direction.current = 1
    move += direction.current * move * f
    baseX.set(baseX.get() + move)
  })

  return (
    <div className={`marquee__row ${className}`}>
      <motion.div className="marquee__track" style={{ x, skewX: skew }}>
        {[0, 1, 2, 3].map((k) => (
          <span className="marquee__group" key={k} aria-hidden={k > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

const NOTES = ['Bergamot', 'Tuberose', 'Orris', 'Oud', 'Vetiver', 'Labdanum', 'Saffron', 'Fig leaf']
const ORIGINS = ['Calabria', 'Tamil Nadu', 'Florence', 'Assam', 'Les Cayes', 'Andalusia', 'Grasse', 'Kashmir']

export default function Marquee() {
  return (
    <section className="marquee" aria-label="Raw materials">
      <Row baseVelocity={-1.6} className="marquee__row--serif">
        {NOTES.map((n, i) => (
          <Fragment key={n}>
            <span className={i % 2 ? 'is-outline' : ''}>{n}</span>
            <span className="marquee__star">✦</span>
          </Fragment>
        ))}
      </Row>
      <Row baseVelocity={1.1} className="marquee__row--mono">
        {ORIGINS.map((o, i) => (
          <Fragment key={o}>
            <span>
              {NOTES[i]} — {o}
            </span>
            <span className="marquee__dot" />
          </Fragment>
        ))}
      </Row>
    </section>
  )
}
