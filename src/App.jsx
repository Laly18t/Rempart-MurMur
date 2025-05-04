import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

// composant
import Scene from './Scene'
import { SETTINGS } from './constants'
import UIlayer from './componants/UI/UIlayer'

export default function App() {
  return <>
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <Scene
        />

        {SETTINGS.DEBUG && <Perf />}
      </Suspense>
    </Canvas>

    <UIlayer />
  </>
}