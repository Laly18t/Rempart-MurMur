import { Canvas } from '@react-three/fiber'
import Scene from './Scene'
import { Suspense } from 'react'
import { Perf } from 'r3f-perf'
import TransitionManager from './Composants/TransitionManager'

export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <TransitionManager textureUrl="./transition.png">
          {({ navigate, setSceneA, setSceneB }) => (
            <>
              {/* Tu peux stocker les FBO de tes scènes ici */}
              <Scene
                onEnterPortal={(id) => navigate(`/portal/${id}`)}
                setSceneA={setSceneA}
                setSceneB={setSceneB}
              />
              <Perf />
            </>
          )}
        </TransitionManager>
      </Suspense>
    </Canvas>
  )
}