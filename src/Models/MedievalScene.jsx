import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// composant
import Lustre from './Lustre'

export default function MedievalScene(props) {
    const groupRef = useRef()
    // load model
    const { scene } = useGLTF('/models/medievalScene.gltf')

    // materiaux par default
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
            <Lustre position={[0,2,0]}  />
        </group>
        </>
}

useGLTF.preload('/models/medievalScene.gltf')