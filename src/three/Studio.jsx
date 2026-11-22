import { Environment, Lightformer } from '@react-three/drei'

/** Warm product-studio lighting, baked once into an environment map (no network HDRs). */
export default function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer form="circle" intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
        <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
        <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
        <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
      </group>
      <Lightformer form="rect" intensity={5} color="#ffd9a8" position={[-4, 2, 3]} rotation-y={Math.PI / 4} scale={[1.2, 6, 1]} />
      <Lightformer form="rect" intensity={3} color="#ffffff" position={[4, 0, 3]} rotation-y={-Math.PI / 4} scale={[0.6, 6, 1]} />
      <Lightformer form="ring" intensity={2} color="#ffe9c9" position={[0, 0, 6]} scale={3} />
    </Environment>
  )
}
