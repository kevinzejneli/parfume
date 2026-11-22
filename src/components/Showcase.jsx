import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { useStore, makeItem } from '../store'
import { fragrances, priceFor } from '../data/fragrances'
import { Arrow, EASE, MagneticButton } from './ui'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.025 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.28, ease: 'easeIn' } },
}
const rise = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.95, ease: EASE } },
  exit: { y: '-110%', transition: { duration: 0.34, ease: [0.7, 0, 0.84, 0] } },
}
const bar = {
  hidden: { scaleX: 0 },
  show: (v) => ({ scaleX: v, transition: { duration: 1.2, ease: EASE, delay: 0.25 } }),
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const TIERS = [
  ['top', 'Top'],
  ['heart', 'Heart'],
  ['base', 'Base'],
]

export default function Showcase() {
  const active = useStore((s) => s.active)
  const setActive = useStore((s) => s.setActive)
  const next = useStore((s) => s.next)
  const prev = useStore((s) => s.prev)
  const addItem = useStore((s) => s.addItem)
  const f = fragrances[active]
  const [size, setSize] = useState(100)
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.45 })
  const price = priceFor(f, size)

  useEffect(() => {
    if (!inView) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [inView, next, prev])

  return (
    <section id="showcase" ref={ref} className="showcase">
      <div className="showcase__stage">
        <div className="showcase__hint">
          <span className="eyebrow">Signature — 360°</span>
          <span className="showcase__keys">
            <kbd>←</kbd>
            <kbd>→</kbd> to browse the collection
          </span>
        </div>
      </div>

      <div className="showcase__panel">
        <div className="showcase__top">
          <span className="eyebrow">(01) — Extrait de parfum</span>
          <span className="showcase__counter">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.b key={f.no} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                {f.no}
              </motion.b>
            </AnimatePresence>
            <i>/ 0{fragrances.length}</i>
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={f.id} className="showcase__body" variants={container} initial="hidden" animate="show" exit="exit">
            <h2 className="showcase__title">
              <span className="line">
                <motion.span className="line__inner" variants={rise}>
                  {f.name}
                </motion.span>
              </span>
            </h2>
            <motion.p className="showcase__tagline" variants={item}>
              {f.tagline}
            </motion.p>
            <motion.p className="showcase__desc" variants={item}>
              {f.description}
            </motion.p>

            <motion.div className="showcase__grid" variants={item}>
              <dl className="pyramid">
                {TIERS.map(([k, label]) => (
                  <div key={k}>
                    <dt>{label}</dt>
                    <dd>{f.notes[k].join(' · ')}</dd>
                  </div>
                ))}
              </dl>
              <div className="accords">
                {f.accords.map(([name, v]) => (
                  <div className="accord" key={name}>
                    <div className="accord__row">
                      <span>{name}</span>
                      <span>{v}</span>
                    </div>
                    <div className="accord__track">
                      <motion.span variants={bar} custom={v / 100} />
                    </div>
                  </div>
                ))}
                <div className="intensity">
                  <span>Trail</span>
                  <div>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i key={n} className={n <= f.intensity ? 'on' : ''} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="showcase__buy">
          <div className="sizes" role="radiogroup" aria-label="Size">
            {[50, 100].map((s) => (
              <button key={s} role="radio" aria-checked={size === s} className={size === s ? 'is-active' : ''} onClick={() => setSize(s)}>
                {size === s && <motion.span layoutId="size-pill" className="sizes__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                <span>{s} ml</span>
              </button>
            ))}
          </div>
          <div className="showcase__price">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={price} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                €{price}
              </motion.span>
            </AnimatePresence>
          </div>
          <MagneticButton className="mbtn--accent" onClick={() => addItem(makeItem(f, size))}>
            Add to bag
          </MagneticButton>
        </div>

        <div className="showcase__nav">
          <button className="arrowbtn" onClick={prev} aria-label="Previous fragrance">
            <Arrow dir="left" />
          </button>
          <div className="swatches">
            {fragrances.map((x, i) => (
              <button
                key={x.id}
                className={`swatch${i === active ? ' is-active' : ''}`}
                style={{ '--c': x.color }}
                onClick={() => setActive(i)}
                aria-label={x.name}
                data-name={x.name}
              >
                {i === active && <motion.span layoutId="swatch-ring" className="swatch__ring" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              </button>
            ))}
          </div>
          <button className="arrowbtn" onClick={next} aria-label="Next fragrance">
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  )
}
