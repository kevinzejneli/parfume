import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { FadeIn } from './ui'

const TEXT =
  "We don't make perfume for the room you walk into. We make it for the one you *leave* — the trace on a scarf, the warmth on a stairwell, the question someone asks after you've *gone.*"

function Word({ children, progress, range, accent }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  const blur = useTransform(progress, range, ['blur(6px)', 'blur(0px)'])
  return (
    <motion.span className={`word${accent ? ' word--accent' : ''}`} style={{ opacity, filter: blur }}>
      {children}
    </motion.span>
  )
}

export default function Manifesto() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.55'] })
  const words = TEXT.split(' ')
  const n = words.length

  return (
    <section id="atelier" className="manifesto">
      <span className="eyebrow eyebrow--dark">(04) — The atelier</span>
      <p ref={ref} className="manifesto__text">
        {words.map((w, i) => {
          const accent = w.startsWith('*')
          const clean = w.replace(/\*/g, '')
          return (
            <Word key={i} progress={scrollYProgress} range={[i / n, Math.min(1, (i + 2) / n)]} accent={accent}>
              {clean}
            </Word>
          )
        })}
      </p>
      <FadeIn className="manifesto__sign">
        <span className="manifesto__signature">Élise Marchetti</span>
        <span className="eyebrow eyebrow--dark">Founder &amp; perfumer</span>
      </FadeIn>
    </section>
  )
}
