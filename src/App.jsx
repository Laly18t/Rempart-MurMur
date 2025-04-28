import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

// composant
import Scene from './Scene'
import Loader from './componants/Loader'
import { SETTINGS } from './constants'

export default function App() {
  return <>
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <Scene
        />

        {SETTINGS.DEBUG && <Perf />}
      </Suspense>
    </Canvas>
    <Loader />
  </>
}