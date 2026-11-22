import * as THREE from 'three'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import Studio from './Studio'
import { fragrances } from '../data/fragrances'

const { damp } = THREE.MathUtils
const GOLD = '#d6ad62'
const PAPER = '#ece4d4'
const INK = '#1b1512'

/* ------------------------------------------------------------------ textures */

function canvasTexture(w, h, draw, { transparent = false } = {}) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const paint = () => {
    const ctx = c.getContext('2d')
    if (transparent) ctx.clearRect(0, 0, w, h)
    draw(ctx, w, h)
    tex.needsUpdate = true
  }
  paint()
  document.fonts.ready.then(paint)
  return tex
}

const spacing = (ctx, px) => {
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`
}

function paper(ctx, w, h) {
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < (w * h) / 220; i++) {
    ctx.fillStyle = `rgba(70,48,24,${Math.random() * 0.06})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5)
  }
}

const vialLabel = (f) =>
  canvasTexture(192, 300, (ctx, w, h) => {
    paper(ctx, w, h)
    ctx.strokeStyle = INK
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, w - 20, h - 20)
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    spacing(ctx, 6)
    ctx.font = '500 17px "IBM Plex Mono"'
    ctx.fillText('SILLAGE', w / 2 + 3, 52)
    spacing(ctx, 0)
    ctx.font = 'italic 400 34px "Bodoni Moda Variable"'
    ctx.fillText('N°', w / 2, 118)
    ctx.font = '400 92px "Bodoni Moda Variable"'
    ctx.fillText(f.no, w / 2, 206)
    ctx.beginPath()
    ctx.arc(w / 2, 238, 7, 0, Math.PI * 2)
    ctx.fillStyle = f.color
    ctx.fill()
    ctx.fillStyle = INK
    spacing(ctx, 3)
    ctx.font = '400 13px "IBM Plex Mono"'
    ctx.fillText('2 ML', w / 2 + 2, 272)
    spacing(ctx, 0)
  })

const lidLabel = () =>
  canvasTexture(1024, 548, (ctx, w, h) => {
    paper(ctx, w, h)
    ctx.strokeStyle = INK
    ctx.lineWidth = 4
    ctx.strokeRect(24, 24, w - 48, h - 48)
    ctx.lineWidth = 1.5
    ctx.strokeRect(40, 40, w - 80, h - 80)
    ctx.fillStyle = INK
    ctx.textAlign = 'center'
    ctx.font = 'italic 400 168px "Bodoni Moda Variable"'
    ctx.fillText('Sillage', w / 2, 290)
    ctx.fillRect(w / 2 - 150, 340, 300, 2)
    spacing(ctx, 9)
    ctx.font = '500 24px "IBM Plex Mono"'
    ctx.fillText('COFFRET DÉCOUVERTE', w / 2 + 4, 406)
    spacing(ctx, 5)
    ctx.font = '400 20px "IBM Plex Mono"'
    ctx.fillText('8 × 2 ML  —  EXTRAITS DE PARFUM', w / 2 + 2, 450)
    spacing(ctx, 0)
  })

const engraving = () =>
  canvasTexture(
    1024,
    64,
    (ctx, w, h) => {
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      spacing(ctx, 14)
      ctx.font = '500 30px "IBM Plex Mono"'
      ctx.fillText('SILLAGE  ·  DÉCOUVERTE', w / 2 + 7, h / 2 + 2)
      spacing(ctx, 0)
    },
    { transparent: true },
  )

const softShadow = () =>
  canvasTexture(
    256,
    256,
    (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
      g.addColorStop(0, 'rgba(0,0,0,0.85)')
      g.addColorStop(0.55, 'rgba(0,0,0,0.35)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    },
    { transparent: true },
  )

/* ------------------------------------------------------------------ geometry */

/** Lathe-turned vial: rounded heel, straight wall, soft shoulder into the neck. */
function useVialGeometry() {
  return useMemo(() => {
    const outer = []
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * (Math.PI / 2)
      outer.push(new THREE.Vector2(0.2 * Math.sin(a), -0.75 + 0.12 * (1 - Math.cos(a))))
    }
    outer.push(
      new THREE.Vector2(0.2, 0.52),
      new THREE.Vector2(0.196, 0.58),
      new THREE.Vector2(0.17, 0.63),
      new THREE.Vector2(0.132, 0.665),
      new THREE.Vector2(0.126, 0.75),
    )

    const inner = []
    for (let i = 0; i <= 10; i++) {
      const a = (i / 10) * (Math.PI / 2)
      inner.push(new THREE.Vector2(0.172 * Math.sin(a), -0.715 + 0.1 * (1 - Math.cos(a))))
    }
    inner.push(new THREE.Vector2(0.172, 0.24), new THREE.Vector2(0.0001, 0.24))

    return {
      glass: new THREE.LatheGeometry(outer, 48),
      liquid: new THREE.LatheGeometry(inner, 40),
      label: new THREE.CylinderGeometry(0.205, 0.205, 0.46, 24, 1, true, -0.74, 1.48),
    }
  }, [])
}

/* ------------------------------------------------------------------ pieces */

function Vial({ f, index, position, delay, geo, playAt, onPick }) {
  const lift = useRef()
  const hovered = useRef(false)
  const label = useMemo(() => vialLabel(f), [f])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const started = playAt.current !== null && t > playAt.current + delay
    const g = lift.current
    g.position.y = damp(g.position.y, started ? (hovered.current ? 0.34 : 0) : 5.5, started && !hovered.current ? 4 : 7, d)
    g.rotation.y = damp(g.rotation.y, hovered.current ? 0.9 : 0, 4, d)
  })

  return (
    <group position={position}>
      {/* the slot it rests in */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.004}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial color="#120806" roughness={1} />
      </mesh>
      <group
        ref={lift}
        position-y={5.5}
        onPointerOver={(e) => {
          e.stopPropagation()
          hovered.current = true
        }}
        onPointerOut={() => {
          hovered.current = false
        }}
        onClick={(e) => {
          e.stopPropagation()
          onPick(index)
        }}
      >
        <group position-y={0.75}>
          <mesh geometry={geo.liquid}>
            <meshPhysicalMaterial color={f.color} emissive={f.color} emissiveIntensity={0.16} roughness={0.2} clearcoat={1} side={THREE.DoubleSide} />
          </mesh>
          <mesh geometry={geo.glass}>
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={1}
              thickness={0.22}
              roughness={0.03}
              ior={1.5}
              clearcoat={1}
              clearcoatRoughness={0.04}
              envMapIntensity={1.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh geometry={geo.label} position-y={-0.2}>
            <meshStandardMaterial map={label} emissiveMap={label} emissive="#ffffff" emissiveIntensity={0.45} roughness={0.85} />
          </mesh>
          {/* gold collar, onyx cap, gold crown */}
          <mesh position-y={0.765}>
            <cylinderGeometry args={[0.152, 0.152, 0.04, 32]} />
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} />
          </mesh>
          <mesh position-y={0.975}>
            <cylinderGeometry args={[0.143, 0.15, 0.38, 32]} />
            <meshPhysicalMaterial color="#0d0b0a" metalness={0.3} roughness={0.14} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
          <mesh position-y={1.17}>
            <cylinderGeometry args={[0.143, 0.143, 0.014, 32]} />
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function Tray() {
  const engraveTex = useMemo(engraving, [])
  const shadowTex = useMemo(softShadow, [])
  const leather = <meshPhysicalMaterial color="#2a1b13" roughness={0.42} clearcoat={0.6} clearcoatRoughness={0.35} />
  const gold = <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
  const W = 4.9
  const D = 2.6
  const H = 0.6
  const T = 0.1

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.16} scale={[8, 4.6, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={shadowTex} transparent depthWrite={false} opacity={0.9} />
      </mesh>

      <RoundedBox args={[W, 0.14, D]} radius={0.04} smoothness={3} position={[0, -0.07, 0]}>
        {leather}
      </RoundedBox>

      {/* velvet floor */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.002}>
        <planeGeometry args={[W - 2 * T, D - 2 * T]} />
        <meshPhysicalMaterial color="#3a1a12" roughness={1} sheen={1} sheenColor="#b35d42" sheenRoughness={0.45} />
      </mesh>

      {/* walls */}
      <mesh position={[0, H / 2, D / 2 - T / 2]}>
        <boxGeometry args={[W, H, T]} />
        {leather}
      </mesh>
      <mesh position={[0, H / 2, -D / 2 + T / 2]}>
        <boxGeometry args={[W, H, T]} />
        {leather}
      </mesh>
      <mesh position={[-W / 2 + T / 2, H / 2, 0]}>
        <boxGeometry args={[T, H, D - 2 * T]} />
        {leather}
      </mesh>
      <mesh position={[W / 2 - T / 2, H / 2, 0]}>
        <boxGeometry args={[T, H, D - 2 * T]} />
        {leather}
      </mesh>

      {/* gold rim */}
      <mesh position={[0, H + 0.008, D / 2 - T / 2]}>
        <boxGeometry args={[W + 0.01, 0.018, T + 0.01]} />
        {gold}
      </mesh>
      <mesh position={[0, H + 0.008, -D / 2 + T / 2]}>
        <boxGeometry args={[W + 0.01, 0.018, T + 0.01]} />
        {gold}
      </mesh>
      <mesh position={[-W / 2 + T / 2, H + 0.008, 0]}>
        <boxGeometry args={[T + 0.01, 0.018, D]} />
        {gold}
      </mesh>
      <mesh position={[W / 2 - T / 2, H + 0.008, 0]}>
        <boxGeometry args={[T + 0.01, 0.018, D]} />
        {gold}
      </mesh>

      {/* foil engraving on the front */}
      <mesh position={[0, H * 0.5, D / 2 + 0.002]}>
        <planeGeometry args={[2.9, 0.18]} />
        <meshBasicMaterial map={engraveTex} color={GOLD} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

function Lid() {
  const ref = useRef()
  const tex = useMemo(lidLabel, [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    ref.current.position.y = 1.95 + Math.sin(t * 0.8) * 0.07
    ref.current.rotation.x = -0.14 + Math.sin(t * 0.6) * 0.025
  })
  return (
    <group ref={ref} position={[0, 1.95, -1.65]}>
      <RoundedBox args={[4.3, 2.3, 0.07]} radius={0.03} smoothness={3}>
        <meshStandardMaterial color="#d6c9b1" roughness={0.75} />
      </RoundedBox>
      <mesh position-z={0.037}>
        <planeGeometry args={[4.2, 2.247]} />
        <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.35} roughness={0.8} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ scene */

// staggered two-row layout so the back row peeks between the front row
const SLOTS = [
  [-1.89, -0.5],
  [-0.81, -0.5],
  [0.27, -0.5],
  [1.35, -0.5],
  [-1.35, 0.55],
  [-0.27, 0.55],
  [0.81, 0.55],
  [1.89, 0.55],
]
const CONTENT_CENTER_Y = 1.4 // vertical middle of tray + lid, in local units
const LOOK_Y = 1.0

function Box({ pointer, play, onPick }) {
  const root = useRef()
  const playAt = useRef(null)
  const geo = useVialGeometry()
  const camera = useThree((s) => s.camera)

  useEffect(() => {
    camera.lookAt(0, LOOK_Y, 0)
  }, [camera])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    if (play && playAt.current === null) playAt.current = state.clock.elapsedTime

    const { viewport, size, clock } = state
    const narrow = size.width < 640
    const s = Math.min(1, viewport.width / (narrow ? 5.4 : 6.0))
    const g = root.current
    g.scale.setScalar(damp(g.scale.x, s, 6, d))
    // keep the composition optically centred whatever the scale
    g.position.y = LOOK_Y - CONTENT_CENTER_Y * g.scale.x

    const baseY = narrow ? Math.sin(clock.elapsedTime * 0.45) * 0.2 : -0.36
    g.rotation.y = damp(g.rotation.y, baseY + pointer.current.x * 0.5, 3, d)
    g.rotation.x = damp(g.rotation.x, pointer.current.y * 0.1, 3, d)
  })

  return (
    <group ref={root}>
      <Tray />
      <Lid />
      {fragrances.map((f, i) => (
        <Vial
          key={f.id}
          f={f}
          index={i}
          geo={geo}
          playAt={playAt}
          onPick={onPick}
          delay={0.1 + i * 0.09}
          position={[SLOTS[i][0], 0, SLOTS[i][1]]}
        />
      ))}
    </group>
  )
}

export default function DiscoveryScene({ active, play, pointer, onPick }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 2.6, 7.6], fov: 30 }}
    >
      <Suspense fallback={null}>
        <Studio />
        <Box pointer={pointer} play={play} onPick={onPick} />
      </Suspense>
    </Canvas>
  )
}
