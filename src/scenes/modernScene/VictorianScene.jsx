import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshNormalMaterial } from 'three'

export default function VictorianScene(props) {
    const { scene } = useGLTF('/models/victorianScene.gltf') // load model
    const groupRef = useRef()

    // temporaire
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new MeshNormalMaterial()
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [scene])

    return <>
        <group position={[0,0,0]} rotation-y={ -3.1 } ref={groupRef} {...props} dispose={null}>
            <primitive castShadow receiveShadow object={scene} />
        </group>
        </>
}

useGLTF.preload('/models/victorianScene.gltf')