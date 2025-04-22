import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function WarScene(props) {
    const groupRef = useRef()
    const { scene } = useGLTF('/models/scene_1942.gltf')

    useEffect(() => {
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshNormalMaterial()
                    child.castShadow = true
                    child.receiveShadow = true
                }
            })
        }, [scene])

    return <>
        <group position={[0,-2,0]} rotation-y={ -3.1 } ref={groupRef} {...props} dispose={null}>
            <primitive castShadow receiveShadow object={scene} />
        </group>
        </>
}

useGLTF.preload('/guerreScene.gltf')
