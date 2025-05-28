import React, { forwardRef, useEffect, useRef } from 'react'
import { useGLTF, PerspectiveCamera, useAnimations } from '@react-three/drei'
import { AnimationMixer, MeshNormalMaterial, TextureLoader } from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { LoopOnce } from 'three'

import { DATA } from '../../constants'
import useSceneStore from '../../stores/useSceneStore'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
import usePlaySound from '../../hooks/usePlaySound'


function WarScene({ ...props }, ref) {
    const groupRef = ref ?? useRef()
    const { nodes, materials, animations, scene } = useGLTF('/models/scene_1942_v7.glb')
    const { actions } = useAnimations(animations, groupRef)
    const setSceneInfo = useSceneStore((state) => (state.setSceneInfo))
    const voiceOver = useVoiceOverStore()
    const mixers = useRef([])

    const people = useLoader(TextureLoader, '/people_war.PNG')
    const playRadio = usePlaySound('/audio/sounds/radio.mp3')
    const playTrappe = usePlaySound('/audio/sounds/trappe_on.mp3')
    

    // utiliser la camera principale
    useEffect(() => {
        scene.traverse((child) => {
            if (child.name === 'camera_generale') { //Camera_face
                groupRef.current.mainCamera = child
            }
        })
    }, [scene])

    // mixer pour animation
    useFrame((state, delta) => {
        mixers.current.forEach(({ mixer }) => mixer.update(delta))
    })

    const handleClick = (e) => {
        const clickedObject = e.object
        console.log('Objet cliqué:', clickedObject.name)

        // action 1 - allumer la radio
        if (clickedObject.name === 'radio') {
            console.log('Radio cliqué')
            voiceOver.setIndex(1)

            playRadio.play() // bruitage radio
        }

        // action 2 - ouvrir la trappe
        if (clickedObject.name === 'couvercle') {
            console.log('Radio cliqué')
            voiceOver.setIndex(1)

            const clip = animations.find(a => a.name === 'animation_0')
            const target = scene.getObjectByName('couvercle')

            if (clip && target) {
                const mixer = new AnimationMixer(target)
                const action = mixer.clipAction(clip)
                action.setLoop(LoopOnce, 1)
                action.clampWhenFinished = true
                action.reset().play()

                playTrappe.play() // bruitage trappe

                // Ajouter le mixer pour mise à jour via useFrame
                mixers.current.push({ mixer, action })
            }
        }
    }



    useEffect(() => {
        if (groupRef.current) {
            const cameras = [
                groupRef.current.getObjectByName('camera_radio'),
                groupRef.current.getObjectByName('camera_trappe'),
                groupRef.current.getObjectByName('camera_generale'),
            ]
            // setSceneInfo(DATA.guerre.name, { group: groupRef.current, cameras })
        }
        // scene.traverse((child) => {

        //     if (child.name === 'camera_generale') { //Caméra_face
        //         console.log('Camera trouvée:', child)
        //         group.current.mainCamera = child
        //     }
        // })
    }, [groupRef])

    return (
        <group position={[0, -2, -3]} rotation-y={-3.14} ref={groupRef} {...props} dispose={null} onClick={handleClick}>
            <mesh position={[-2.7, 1.15, -1.7]} rotation-y={-3}> {/* TODO: temporaire */}
                <boxGeometry args={[1.3, 2.5, 0.00001]} />
                <meshBasicMaterial map={people} transparent={true} />
                {/* <meshBasicMaterial color='red' /> */}
            </mesh>
            <primitive castShadow receiveShadow object={scene} />
            <ambientLight intensity={0.6} />
            <spotLight position={[0, 5, 5]} intensity={0.8} />
            {/* <InfoBulle position={[.52, 1.5, -1.5]} onClick={handleClickInfoBulle} /> */}
        </group>
    )
}

export default forwardRef(WarScene)

useGLTF.preload('/models/scene_1942_v7.glb')