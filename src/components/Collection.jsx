import { forwardRef, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { fragrances, families } from '../data/fragrances'
import { useStore, makeItem } from '../store'
import { scrollToId } from '../lib/scroll'
import BottleSVG from './BottleSVG'
import { EASE, RevealLines, Roll } from './ui'

const ProductCard = forwardRef(function ProductCard({ f, index, order }, ref) {
  const media = useRef(null)
  const setActive = useStore((s) => s.setActive)
  const addItem = useStore((s) => s.addItem)

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(30)
  const srx = useSpring(rx, { stiffness: 180, damping: 18 })
  const sry = useSpring(ry, { stiffness: 180, damping: 18 })
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.55), rgba(255,255,255,0) 55%)`

  const onMove = (e) => {
    const r = media.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 18)
    rx.set(-(py - 0.5) * 18)
    gx.set(px * 100)
    gy.set(py * 100)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  const view = () => {
    setActive(index)
    scrollToId('showcase')
  }

  return (
    <motion.article
      ref={ref}
      layout
      className="card"
      style={{ '--c': f.color }}
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px' }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.3 } }}
      transition={{ duration: 1, ease: EASE, delay: (order % 4) * 0.08 }}
    >
      <motion.div
        ref={media}
        className="card__media"
        style={{ rotateX: srx, rotateY: sry }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={view}
        data-cursor="View 3D"
      >
        <div className="card__bg" />
        <span className="card__no">N° {f.no}</span>
        <span className="card__family">{f.family}</span>
        <div className="card__shadow" />
        <div className="card__bottle">
          <BottleSVG f={f} />
        </div>
        <motion.div className="card__glare" style={{ background: glare }} />
      </motion.div>

      <div className="card__info">
        <div>
          <h3>{f.name}</h3>
          <p>{f.notes.heart.join(' · ')}</p>
        </div>
        <div className="card__buy">
          <span className="card__price">from €{f.price}</span>
          <button className="card__add" onClick={() => addItem(makeItem(f, 50))} aria-label={`Add ${f.name} 50 ml to bag`}>
            <Roll>Add +</Roll>
          </button>
        </div>
      </div>
    </motion.article>
  )
})

export default function Collection() {
  const [filter, setFilter] = useState('All')
  const list = useMemo(
    () => fragrances.map((f, i) => ({ f, i })).filter(({ f }) => filter === 'All' || f.family === filter),
    [filter],
  )

  return (
    <section id="collection" className="collection">
      <div className="collection__head">
        <div>
          <span className="eyebrow eyebrow--dark">(02) — The collection</span>
          <RevealLines className="section-title" lines={['Eight ways to', <em key="e">be remembered</em>]} />
        </div>
        <div className="filters" role="tablist" aria-label="Filter by family">
          {families.map((fam) => (
            <button key={fam} role="tab" aria-selected={filter === fam} className={filter === fam ? 'is-active' : ''} onClick={() => setFilter(fam)}>
              {filter === fam && <motion.span layoutId="filter-pill" className="filters__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
              <span>{fam}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid">
        <AnimatePresence mode="popLayout">
          {list.map(({ f, i }, order) => (
            <ProductCard key={f.id} f={f} index={i} order={order} />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
