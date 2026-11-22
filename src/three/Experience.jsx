import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import Rig from './Rig'
import Studio from './Studio'
import { useStore } from '../store'

/** Tell the preloader the GPU has produced a frame. */
function Ready() {
  const setSceneReady = useStore((s) => s.setSceneReady)
  useEffect(() => {
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setSceneReady(true))
    })
    return () => cancelAnimationFrame(id)
  }, [setSceneReady])
  return null
}

/** Stop rendering once the showcase has scrolled away — the bottle is off-stage. */
function FrameGuard({ wrapper }) {
  const setFrameloop = useThree((s) => s.setFrameloop)
  useEffect(() => {
    let current = 'always'
    const check = () => {
      const el = document.getElementById('showcase')
      if (!el) return
      const next = el.getBoundingClientRect().bottom < -80 ? 'never' : 'always'
      if (next === current) return
      current = next
      setFrameloop(next)
      if (wrapper.current) wrapper.current.style.visibility = next === 'never' ? 'hidden' : 'visible'
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [setFrameloop, wrapper])
  return null
}

export default function Experience() {
  const wrapper = useRef(null)
  return (
    <div className="webgl" ref={wrapper} aria-hidden="true">
      <Canvas
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 8], fov: 32 }}
      >
        <Suspense fallback={null}>
          <Rig />
          <Studio />
          <Ready />
        </Suspense>
        <FrameGuard wrapper={wrapper} />
      </Canvas>
    </div>
  )
}
