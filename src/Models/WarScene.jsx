import React, { useRef, useEffect } from 'react'
import { ScrollControls, useGLTF, useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

export default function WarScene(props) {
    // load model
    const { scene, animations, cameras } = useGLTF('/models/scene_1942_v2.glb')

    const groupRef = useRef()
    const mixerRef = useRef()

    console.log(scene)

    useEffect(() => {
        // mixer
        mixerRef.current = new THREE.AnimationMixer(scene)

        // boucle d'anim
        animations.forEach((clip) => {
            const action = mixerRef.current.clipAction(clip)
            action.play()
            action.setLoop(THREE.LoopRepeat)
        })

        scene.traverse((child) => {

        })

        return () => {
            // clean
            mixerRef.current.stopAllAction()
        }
    }, [scene, animations, cameras])

    // MAJ mixer a chaque frame (pour l'anim)
    useFrame((state, delta) => {
        // anim trappe
        mixerRef.current?.update(delta)
    })

    return <>
        <group position={[0, -2, 0]} rotation-y={-3.1} ref={groupRef} {...props} dispose={null}>
            <primitive castShadow receiveShadow object={scene} />
        </group>
    </>
}

useGLTF.preload('/models/scene_1942_v2.glb')