import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useStore } from '../store'
import { scrollToId } from '../lib/scroll'
import { Arrow, EASE, MagneticButton, RevealLines, Roll } from './ui'

function Badge() {
  return (
    <svg viewBox="0 0 200 200" className="badge__svg" aria-hidden="true">
      <defs>
        <path id="badge-circle" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
      </defs>
      <text>
        <textPath href="#badge-circle" textLength="474" lengthAdjust="spacing">
          EXTRAIT DE PARFUM ✦ 28% CONCENTRATION ✦ HAND-POURED ✦
        </textPath>
      </text>
      <text x="100" y="114" textAnchor="middle" className="badge__s">
        S
      </text>
    </svg>
  )
}

export default function Hero() {
  const loaded = useStore((s) => s.loaded)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -160])
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  const fade = (delay) => ({
    initial: { opacity: 0, y: 26 },
    animate: loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    transition: { delay, duration: 1.2, ease: EASE },
  })

  return (
    <section id="hero" ref={ref} className="hero">
      <motion.div className="hero__inner" style={{ y, opacity }}>
        <motion.p className="eyebrow hero__eyebrow" {...fade(0.15)}>
          <span className="pulse" /> Maison de parfum — Extraits, Grasse
        </motion.p>
        <RevealLines as="h1" className="hero__title" play={loaded} delay={0.25} lines={['The scent', 'you leave', <em key="b">behind.</em>]} />
        <motion.p className="hero__lede" {...fade(0.75)}>
          Eight extraits de parfum, composed by hand and poured in batches of three hundred. Worn close to the skin — remembered long
          after you have left the room.
        </motion.p>
        <motion.div className="hero__ctas" {...fade(0.9)}>
          <MagneticButton className="mbtn--accent" onClick={() => scrollToId('collection')}>
            Shop the collection
          </MagneticButton>
          <button className="textlink" onClick={() => scrollToId('showcase')}>
            <Roll>Turn the bottle</Roll>
            <Arrow />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero__badge"
        initial={{ opacity: 0, scale: 0.5, rotate: -60 }}
        animate={loaded ? { opacity: 1, scale: 1, rotate: 0 } : {}}
        transition={{ delay: 1.2, duration: 1.6, ease: EASE }}
      >
        <Badge />
      </motion.div>

      <motion.div className="hero__foot" {...fade(1.05)}>
        <dl className="hero__stats">
          <div>
            <dt>
              28<sup>%</sup>
            </dt>
            <dd>Oil concentration</dd>
          </div>
          <div>
            <dt>
              12<sup>h+</sup>
            </dt>
            <dd>On skin</dd>
          </div>
          <div>
            <dt>300</dt>
            <dd>Bottles per batch</dd>
          </div>
        </dl>
        <button className="hero__scroll" onClick={() => scrollToId('showcase')} aria-label="Scroll to the signature collection">
          <span>Scroll</span>
          <i />
        </button>
      </motion.div>
    </section>
  )
}
