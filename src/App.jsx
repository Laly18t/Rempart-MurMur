import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

// composant
import Scene from './Scene'
import TransitionManager from './Composants/TransitionManager'
import { SETTINGS } from './constants'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <TransitionManager textureUrl="./transition.png">
          {({ navigate, setSceneA, setSceneB }) => (
            <>
              <Scene
                onEnterPortal={(id) => navigate(`/portal/${id}`)}
                setSceneA={setSceneA}
                setSceneB={setSceneB}
              />
            
              {SETTINGS.DEBUG && <Perf />}
            </>
          )}
        </TransitionManager>
      </Suspense>
    </Canvas>
  )
}