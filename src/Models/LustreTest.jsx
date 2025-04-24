import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

// Composant du lustre
export default function LustreTest(props) {
    const { scene } = useGLTF('/models/objects/lustre.gltf') // load
    const groupRef = useRef()

    return (
        <group  
            ref={groupRef} 
            dispose={null} 
            position={[0, 2, 0]}
            rotateY={0.5}
        >
            <primitive object={scene} />
        </group>
    )
}

useGLTF.preload('/models/objects/lustre.gltf')
