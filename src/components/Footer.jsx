import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { scrollToId } from '../lib/scroll'
import { Arrow, EASE, RevealLines, Roll } from './ui'

const COLS = [
  ['Shop', ['Extraits', 'Coffret découverte', 'Refills', 'Gift cards']],
  ['Maison', ['The atelier', 'Raw materials', 'Journal', 'Stockists']],
  ['Care', ['Shipping', 'Returns', 'Engraving', 'Contact']],
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSent(true)
  }

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__letter">
          <span className="eyebrow">(06) — Correspondence</span>
          <RevealLines className="section-title" lines={['Letters from', <em key="a">the atelier</em>]} />
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.p key="thanks" className="footer__thanks" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
                Merci. The first letter arrives with the next new moon.
              </motion.p>
            ) : (
              <motion.form key="form" className="footer__form" onSubmit={submit} exit={{ opacity: 0, y: -16 }}>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input id="email" type="email" placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit" aria-label="Subscribe">
                  <Arrow size={22} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
          <p className="footer__small">Four letters a year. New compositions, harvest notes, nothing else.</p>
        </div>

        <div className="footer__cols">
          {COLS.map(([title, links]) => (
            <div key={title}>
              <h5>{title}</h5>
              <ul>
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      <Roll>{l}</Roll>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__mark" aria-hidden="true">
        {'Sillage'.split('').map((c, i) => (
          <span className="footer__mark-mask" key={i}>
            <motion.span
              initial={{ y: '105%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '0px 0px -5% 0px' }}
              transition={{ duration: 1.3, ease: EASE, delay: i * 0.06 }}
            >
              {c}
            </motion.span>
          </span>
        ))}
      </div>

      <div className="footer__bottom">
        <span>© 2026 Sillage Parfums — a demo storefront</span>
        <span>Grasse · Paris · Online</span>
        <button onClick={() => scrollToId('hero')} className="textlink">
          <Roll>Back to top</Roll>
          <Arrow dir="up" size={16} />
        </button>
      </div>
    </footer>
  )
}
