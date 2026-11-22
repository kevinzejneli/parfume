import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { useLabelTexture } from './label'

const GOLD = '#d6ad62'

/**
 * A heavy-glass extrait bottle: refractive body, coloured juice,
 * paper label, gold collar and a faceted onyx cap.
 * `color` is a mutable THREE.Color lerped by the parent rig.
 */
export default function Bottle({ color, label }) {
  const liquid = useRef()
  const labelTex = useLabelTexture(label)
  const bg = useMemo(() => new THREE.Color('#0f0c0a'), [])

  useFrame(() => {
    if (!liquid.current) return
    liquid.current.color.copy(color)
    liquid.current.emissive.copy(color)
  })

  return (
    <group position={[0, -0.16, 0]}>
      {/* glass body */}
      <RoundedBox args={[1.5, 1.9, 0.8]} radius={0.16} smoothness={8} position={[0, -0.45, 0]}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.35}
          samples={6}
          resolution={768}
          thickness={0.32}
          roughness={0.03}
          ior={1.48}
          chromaticAberration={0.07}
          anisotropicBlur={0.12}
          distortion={0.08}
          distortionScale={0.3}
          temporalDistortion={0.04}
          clearcoat={1}
          clearcoatRoughness={0.04}
          color="#fbf6ee"
          background={bg}
        />
      </RoundedBox>

      {/* the juice */}
      <RoundedBox args={[1.22, 1.3, 0.54]} radius={0.12} smoothness={6} position={[0, -0.6, 0]}>
        <meshPhysicalMaterial ref={liquid} roughness={0.16} clearcoat={1} emissiveIntensity={0.24} />
      </RoundedBox>

      {/* paper label */}
      <mesh position={[0, -0.5, 0.406]}>
        <planeGeometry args={[0.9, 0.5625]} />
        <meshBasicMaterial map={labelTex} toneMapped={false} />
      </mesh>

      {/* neck */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.2, 0.23, 0.22, 48]} />
        <meshPhysicalMaterial color="#f4efe8" roughness={0.05} clearcoat={1} transparent opacity={0.45} />
      </mesh>

      {/* gold collar */}
      <mesh position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.12, 64]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
      </mesh>

      {/* faceted onyx cap */}
      <mesh position={[0, 1.27, 0]} rotation-y={Math.PI / 8}>
        <cylinderGeometry args={[0.36, 0.38, 0.94, 8]} />
        <meshPhysicalMaterial color="#0d0b0a" metalness={0.35} roughness={0.12} clearcoat={1} clearcoatRoughness={0.04} flatShading />
      </mesh>
      <mesh position={[0, 0.82, 0]} rotation-y={Math.PI / 8}>
        <cylinderGeometry args={[0.39, 0.39, 0.05, 8]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} flatShading />
      </mesh>
      <mesh position={[0, 1.745, 0]} rotation-y={Math.PI / 8}>
        <cylinderGeometry args={[0.362, 0.362, 0.02, 8]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} flatShading />
      </mesh>
    </group>
  )
}
