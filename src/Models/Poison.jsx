
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Poison(props) {
    const { nodes, materials } = useGLTF('/models/objects/fiole-poison.gltf')
    return (
        <group {...props} dispose={null}>
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