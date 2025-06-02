import { Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { isMobile } from "react-device-detect"

// composant
import Scene from './Scene'
import Rig from './componants/Rig'
import MobileComponant from './componants/MobileComponant'
import { SETTINGS } from './constants'

export default function App() {
  
  return <>
    {isMobile ? 
      (<MobileComponant />) : (
      <Canvas 
        frameloop="demand"
        gl={{ 
          antialias: true,
          powerPreference: "high-performance"
        }}
        flat
        camera={{ position: [0, 0, SETTINGS.DEFAULT_ZOOM], 
        fov: 50 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <Scene />
        <Rig />

        {SETTINGS.DEBUG && <Perf />}
      </Suspense>
    </Canvas>
    )}
    
  </>
}