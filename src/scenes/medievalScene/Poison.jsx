
import React, { useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

export default function Poison(props) {
    const { nodes, materials } = useGLTF('/models/objects/fiole-poison.gltf')
    const { camera } = useThree()
    const groupRef = useRef()

    const [isLookingPoison, setLookPoison] = useState(false)

    // recup du clique dans la scene
    const handlePointerDown = (event) => {
        if (event.object?.userData?.clickable) {
            event.object.onClick?.()
        }
    }

    return (
        <group ref={groupRef} {...props} dispose={null} onPointerDown={handlePointerDown} onClick={() => {
            if (isLookingPoison) { return }
            camera.position.lerp(new THREE.Vector3(35, 1, 3), 0.05)
            console.log('clic')
            setLookPoison(true)
        }}>
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