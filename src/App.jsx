import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

// composant
import Scene from './Scene'
import Rig from './componants/Rig'
import { SETTINGS } from './constants'

export default function App() {
  return <>
    <Canvas flat gl={{ antialias: false }} camera={{ position: [0, 0, SETTINGS.DEFAULT_ZOOM], fov: 50 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <Scene />
        <Rig />

        {SETTINGS.DEBUG && <Perf />}
      </Suspense>
    </Canvas>
  </>
}