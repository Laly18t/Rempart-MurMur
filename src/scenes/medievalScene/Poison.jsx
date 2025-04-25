
import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

import { POSITIONS_ZOOM } from '../../constants'
import useZoom from '../../hooks/useZoom'

export default function Poison(props) {
    const { nodes, materials } = useGLTF('/models/objects/fiole-poison.gltf')
    const groupRef = useRef()
    const { camera } = useThree()
    
    // zoom
    const CAMERA_TARGET_IN = new Vector3(35.3, -1, -0.5)
    const CAMERA_TARGET_OUT = new Vector3(...POSITIONS_ZOOM['monde-medieval'])
    const toggleZoom = useZoom(CAMERA_TARGET_IN, CAMERA_TARGET_OUT) // hook de zoom

    const handleClick = () => {
        toggleZoom()
    }

    return (
        <group 
        ref={groupRef} 
        onClick={handleClick}
        {...props} 
        >
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.fiole.geometry}
                material={nodes.fiole.material}
                position={[0, 0.01, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.bouchon.geometry}
                material={nodes.bouchon.material}
                position={[0, 0.1, 0]}
            />
        </group>
    )
}

useGLTF.preload('/models/objects/fiole-poison.gltf')