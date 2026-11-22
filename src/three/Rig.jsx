import * as THREE from 'three'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import Bottle from './Bottle'
import { useStore } from '../store'
import { fragrances } from '../data/fragrances'

const { damp, lerp, clamp } = THREE.MathUtils
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function useHaloTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.3, 'rgba(255,255,255,0.38)')
    g.addColorStop(0.65, 'rgba(255,255,255,0.08)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(c)
  }, [])
}

/**
 * Choreographs the bottle across the page:
 *  hero (right)  ──scroll──▶  showcase (left, full turn)  ──▶ leaves with the section.
 * Switching fragrance triggers a 360° spin; the label swaps while it faces away.
 */
export default function Rig() {
  const active = useStore((s) => s.active)
  const dir = useStore((s) => s.dir)
  const f = fragrances[active]

  const rig = useRef()
  const spin = useRef()
  const haloMat = useRef()
  const spinTarget = useRef(0)
  const intro = useRef(0)
  const prevActive = useRef(active)
  const [labelF, setLabelF] = useState(f)

  const color = useMemo(() => new THREE.Color(fragrances[0].color), [])
  const target = useMemo(() => new THREE.Color(), [])
  const haloTex = useHaloTexture()

  useEffect(() => {
    if (prevActive.current === active) return
    prevActive.current = active
    spinTarget.current += Math.PI * 2 * dir
    const id = setTimeout(() => setLabelF(fragrances[active]), 210)
    return () => clearTimeout(id)
  }, [active, dir])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const { viewport: vp, size, pointer, clock } = state
    const vh = window.innerHeight

    // scroll progress hero → showcase, and how far the showcase has scrolled away
    const el = document.getElementById('showcase')
    let t = 0
    let exitPx = 0
    if (el) {
      const r = el.getBoundingClientRect()
      t = clamp(1 - r.top / vh, 0, 1)
      exitPx = Math.max(0, -r.top)
    }
    const k = easeInOut(t)

    const loaded = useStore.getState().loaded
    intro.current = damp(intro.current, loaded ? 1 : 0, loaded ? 1.5 : 10, d)
    const i = intro.current

    const mobile = size.width < 860
    const s = mobile ? Math.min(0.62, vp.width / 3.3) : Math.min(0.95, vp.height / 4.9, vp.width / 6)
    const ax = mobile ? 0 : vp.width * 0.2
    const ay = mobile ? vp.height * 0.19 : -0.06
    const bx = mobile ? 0 : -vp.width * 0.22
    const by = mobile ? vp.height * 0.2 : -0.04
    const unit = vp.height / size.height

    const g = rig.current
    g.position.x = damp(g.position.x, lerp(ax, bx, k), 5, d)
    g.position.y = damp(g.position.y, lerp(ay, by, k) + exitPx * unit - (1 - i) * 3.2, 12, d)
    g.scale.setScalar(damp(g.scale.x, s * (0.7 + 0.3 * i), 6, d))

    const time = clock.elapsedTime
    const sway = Math.sin(time * 0.5) * 0.2 * (1 - k)
    const sp = spin.current
    sp.rotation.y = damp(sp.rotation.y, spinTarget.current + k * Math.PI * 2 + sway + pointer.x * 0.35 - (1 - i) * 2.4, 3.2, d)
    sp.rotation.x = damp(sp.rotation.x, -pointer.y * 0.14 + (1 - i) * 0.4, 3, d)
    sp.rotation.z = damp(sp.rotation.z, (mobile ? 0 : lerp(-0.07, 0.05, k)) - pointer.x * 0.05, 3, d)

    target.set(f.color)
    color.lerp(target, 1 - Math.exp(-d * 3.5))
    haloMat.current.color.copy(color)
    haloMat.current.opacity = 0.55 * i
  })

  return (
    <group ref={rig} position={[0, -3, 0]} scale={0.6}>
      <mesh position={[0, 0.1, -1.8]} scale={7.5}>
        <planeGeometry />
        <meshBasicMaterial
          ref={haloMat}
          map={haloTex}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <Sparkles count={60} scale={[4.2, 4.6, 2.4]} size={2.6} speed={0.35} opacity={0.75} noise={0.6} color={f.color} />
      <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.5} floatingRange={[-0.08, 0.08]}>
        <group ref={spin}>
          <Bottle color={color} label={labelF} />
        </group>
      </Float>
    </group>
  )
}
