import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

// composant
import Scene from './Scene'
import { SETTINGS } from './constants'

export default function App() {
  return <>
    <Canvas flat camera={{ position: [0, 0, 5], fov: 75 }} eventSource={document.getElementById('root')} eventPrefix="client">
      <Suspense fallback={null}>
        <Scene
        />

        {SETTINGS.DEBUG && <Perf />}
      </Suspense>
    </Canvas>
  </>
}