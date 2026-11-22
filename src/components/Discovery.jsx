import { useEffect, useRef, useState } from 'react'
import { useInView } from 'motion/react'
import { useStore, discoveryItem } from '../store'
import { scrollToId } from '../lib/scroll'
import DiscoveryScene from '../three/DiscoveryScene'
import { FadeIn, MagneticButton, RevealLines } from './ui'

export default function Discovery() {
  const addItem = useStore((s) => s.addItem)
  const setActive = useStore((s) => s.setActive)
  const scene = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })

  // mount the WebGL box shortly before it scrolls in, render only while visible
  const near = useInView(scene, { margin: '600px 0px' })
  const visible = useInView(scene, { margin: '80px 0px' })
  const play = useInView(scene, { once: true, amount: 0.35 })
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (near) setMounted(true)
  }, [near])

  const onMove = (e) => {
    const r = scene.current.getBoundingClientRect()
    pointer.current = {
      x: ((e.clientX - r.left) / r.width - 0.5) * 2,
      y: ((e.clientY - r.top) / r.height - 0.5) * 2,
    }
  }
  const onLeave = () => {
    pointer.current = { x: 0, y: 0 }
  }
  const pick = (i) => {
    setActive(i)
    scrollToId('showcase')
  }

  return (
    <section id="discovery" className="discovery">
      <div className="discovery__scene" ref={scene} onPointerMove={onMove} onPointerLeave={onLeave} data-cursor="Tilt">
        <div className="discovery__glow" aria-hidden="true" />
        <div className="discovery__canvas">{mounted && <DiscoveryScene active={visible} play={play} pointer={pointer} onPick={pick} />}</div>
        <p className="discovery__hint">Tap a vial to see it full size</p>
      </div>

      <div className="discovery__copy">
        <span className="eyebrow">(05) — Coffret découverte</span>
        <RevealLines className="section-title" lines={['Eight vials.', <em key="d">Eight days.</em>]} />
        <FadeIn as="p" className="discovery__lede" delay={0.1}>
          Not ready to choose? Live with the whole collection first. Eight 2 ml vials — enough to wear each one properly, morning to night,
          skin to scarf.
        </FadeIn>
        <FadeIn as="ul" className="discovery__list" delay={0.2}>
          <li>
            <b>8 × 2 ml</b> extraits, one of every composition
          </li>
          <li>
            <b>€38</b> credited toward your first full bottle
          </li>
          <li>
            <b>Complimentary</b> tracked delivery
          </li>
        </FadeIn>
        <FadeIn delay={0.3}>
          <MagneticButton className="mbtn--accent" onClick={() => addItem(discoveryItem)}>
            Add the set — €38
          </MagneticButton>
        </FadeIn>
      </div>
    </section>
  )
}
