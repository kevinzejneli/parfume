import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'motion/react'
import { materials } from '../data/fragrances'
import { RevealLines } from './ui'

const ROMAN = ['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.']

function MaterialCard({ m, i, progress }) {
  // each orb drifts at its own rate while the track moves
  const drift = useTransform(progress, [0, 1], [60 + i * 10, -60 - i * 10])
  return (
    <article className="mat-card" style={{ '--a': m.colors[0], '--b': m.colors[1], '--c2': m.colors[2] }}>
      <motion.div className="mat-card__orb" style={{ x: drift }} aria-hidden="true">
        <span />
        <span />
        <span />
      </motion.div>
      <div className="mat-card__top">
        <span className="mat-card__idx">{ROMAN[i]}</span>
        <span className="eyebrow">{m.origin}</span>
      </div>
      <div className="mat-card__bottom">
        <h3>{m.name}</h3>
        <p>{m.fact}</p>
        <dl>
          {m.stats.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div>
            <dt>Found in</dt>
            <dd>{m.usedIn}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export default function Materials() {
  const target = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)
  const distMV = useMotionValue(0)

  useLayoutEffect(() => {
    const measure = () => {
      const d = Math.max(0, track.current.scrollWidth - window.innerWidth)
      setDist(d)
      distMV.set(d)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [distMV])

  const { scrollYProgress } = useScroll({ target, offset: ['start start', 'end end'] })
  const x = useTransform([scrollYProgress, distMV], ([p, d]) => -p * d)

  return (
    <section id="materials" ref={target} className="materials" style={{ height: `calc(100svh + ${dist}px)` }}>
      <div className="materials__sticky">
        <div className="materials__head">
          <span className="eyebrow">(03) — Sourcing</span>
          <span className="eyebrow">Scroll ↓ to travel</span>
        </div>
        <motion.div ref={track} className="materials__track" style={{ x }}>
          <div className="mat-intro">
            <RevealLines className="section-title" lines={['The raw', <em key="m">materials</em>]} />
            <p>
              Every bottle names where its ingredients come from. Six of them travel further than the rest — here is where, and why they are
              worth the wait.
            </p>
          </div>
          {materials.map((m, i) => (
            <MaterialCard key={m.name} m={m} i={i} progress={scrollYProgress} />
          ))}
          <div className="mat-outro">
            <span className="mat-outro__big">
              <em>Slow</em> by
              <br />
              design.
            </span>
            <p>From harvest to bottle, a single batch takes up to fourteen months.</p>
          </div>
        </motion.div>
        <div className="materials__progress">
          <motion.span style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  )
}
