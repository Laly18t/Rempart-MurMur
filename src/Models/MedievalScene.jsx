import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useGLTF } from '@react-three/drei'
import { Select, EffectComposer, Outline, Selection } from "@react-three/postprocessing"
import * as THREE from 'three'

// composant
import Lustre from './Lustre'

export default function MedievalScene(props) {
    const groupRef = useRef()
    // gestion du outline
    const [hovered, hover] = useState(null)
    // const debouncedHover = useCallback(debounce(hover, 30), [])
    // const over = () => debouncedHover("lustre")
    // const out = () => debouncedHover(null)
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
                {/* <Select enabled={hovered === "lustre"} onPointerOver={over} onPointerOut={out}> */}
                    <Lustre />
                {/* </Select> */}
            </group>

        {/* <EffectComposer multisampling={4}>
            <Outline visibleEdgeColor="white" hiddenEdgeColor="white" blur edgeStrength={3} />
        </EffectComposer> */}
        </>
}

useGLTF.preload('/models/medievalScene.gltf')



// function debounce(func, delay) {
//     let timer
//     return function (...args) {
//         clearTimeout(timer)
//         timer = setTimeout(() => func.apply(this, args), delay)
//     }
// }