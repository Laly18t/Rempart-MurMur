import React, { useRef, useEffect, useState, useCallback } from 'react'
import { MeshNormalMaterial } from 'three'
import { useGLTF } from '@react-three/drei'
import { Select } from "@react-three/postprocessing"
import { debounce } from "lodash"

import Lustre from './Lustre' // composant


export default function MedievalScene(props) {
    const { scene } = useGLTF('/models/medievalScene.gltf') // load model
    const groupRef = useRef()

    // gestion du outline
    const [hovered, setHovered] = useState(null)


    // // temporaire
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
        <group position={[0, -2, 0]} rotation-y={-3.1} ref={groupRef} {...props} dispose={null}>
            <primitive castShadow receiveShadow object={scene} />
            <Select
                enabled={hovered === 'lustre'}
                onPointerOver={() => {
                    setHovered('lustre')
                }}
                onPointerOut={() => setHovered(null)}
            >
                <Lustre />
            </Select>
        </group>
        
    </>
}

useGLTF.preload('/models/medievalScene.gltf')