import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

// components
import LustreTest from '../LustreTest'
import InfoBulle from '../../componants/InfoBulle'

import useAnimation from '../../hooks/useAnimation' // hooks

export default function WarScene(props) {
    const { scene, animations } = useGLTF('/models/scene_1942_v5.glb') // load model
    const groupRef = useRef()
    
    useAnimation(scene, animations) // animation hook

    return <>
        <group position={[0, -2, 0]} rotation-y={-3.1} ref={groupRef} {...props} dispose={null}>
            <primitive castShadow receiveShadow object={scene} />
            {/* <LustreTest /> */}
            <InfoBulle position={[0.5, 2, -1]} title="Test" content="Ceci est un lustre art déco" />
        </group>
    </>
}

useGLTF.preload('/models/scene_1942_v5.glb')