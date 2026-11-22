import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useStore } from '../store'
import { lockScroll, scrollToId } from '../lib/scroll'
import { EASE, EASE_IN_OUT, Roll } from './ui'

const LINKS = [
  ['collection', 'Collection'],
  ['showcase', 'Signature'],
  ['materials', 'Materials'],
  ['discovery', 'Discovery'],
]

export default function Nav() {
  const loaded = useStore((s) => s.loaded)
  const count = useStore((s) => s.cart.reduce((a, c) => a + c.qty, 0))
  const openCart = useStore((s) => s.openCart)
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    if (Math.abs(v - prev) < 3) return
    setHidden(v > prev && v > 260)
  })

  useEffect(() => {
    if (!loaded) return
    lockScroll(menu)
  }, [menu, loaded])

  const go = (id) => {
    setMenu(false)
    setTimeout(() => scrollToId(id), menu ? 450 : 0)
  }

  return (
    <>
      <motion.header
        className="nav"
        initial={{ y: -120 }}
        animate={{ y: loaded && (!hidden || menu) ? 0 : -120 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <button className="nav__logo" onClick={() => go('hero')} aria-label="Sillage, back to top">
          Sillage
          <span>Maison de parfum</span>
        </button>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map(([id, label], i) => (
            <button key={id} onClick={() => go(id)}>
              <span className="nav__idx">0{i + 1}</span>
              <Roll>{label}</Roll>
            </button>
          ))}
        </nav>

        <div className="nav__actions">
          <button className="nav__bag" onClick={openCart} aria-label={`Open bag, ${count} items`}>
            <Roll>Bag</Roll>
            <motion.span key={count} className="nav__count" initial={{ scale: 1.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}>
              {count}
            </motion.span>
          </button>
          <button className={`nav__menu${menu ? ' is-open' : ''}`} onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Menu">
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.8, ease: EASE_IN_OUT }}
          >
            <ul>
              {LINKS.map(([id, label], i) => (
                <li key={id}>
                  <motion.button
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ delay: 0.28 + i * 0.07, duration: 0.9, ease: EASE }}
                    onClick={() => go(id)}
                  >
                    <span>0{i + 1}</span>
                    {label}
                  </motion.button>
                </li>
              ))}
            </ul>
            <p className="eyebrow">Extraits de parfum — hand-poured in batches of 300</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
