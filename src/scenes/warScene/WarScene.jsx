import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { useGLTF, PerspectiveCamera, useAnimations, Outlines } from '@react-three/drei'
import { AnimationMixer, MeshNormalMaterial, TextureLoader } from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { LoopOnce } from 'three'

import { DATA } from '../../constants'
import useSceneStore from '../../stores/useSceneStore'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
import usePlaySound from '../../hooks/usePlaySound'
import { cameraZoom } from '../../utils/cameraUtils'
import InfoBulle from '../../componants/InfoBulle'
import useFrameAnimation from '../../hooks/useFrameAnimation'


function WarScene({ ...props }, ref) {
    const groupRef = ref ?? useRef()
    const { animations, scene } = useGLTF('/models/scene_1942_v2.glb')
    const { set, gl, camera } = useThree()

    const voiceOver = useVoiceOverStore()
    const { isSceneFinished } = useVoiceOverStore()
    const { currentScene } = useSceneStore()

    const mixers = useRef([])
    const cameraRefs = useRef({}) // Pour stocker toutes les caméras
    const salleRef = useRef()
    const salleDRef = useRef()
    const radioRef = useRef()
    const trappeRef = useRef()
    const [showRadioOutline, setShowRadioOutline] = useState(false)
    const [showTrappeOutline, setShowTrappeOutline] = useState(false)

    const playRadio = usePlaySound('/audio/sounds/radio.mp3')
    const playTrappe = usePlaySound('/audio/sounds/trappe_on.mp3')

    const peopleFrames = [
        '/animations/war/1942_1.png',
        '/animations/war/1942_2.png',
        '/animations/war/1942_3.png',
        '/animations/war/1942_2.png',
    ]
    const { 
        currentTexture: animatedPeopleTexture,
        startAnimation,
        stopAnimation,
        isPlaying 
    } = useFrameAnimation(peopleFrames, 0.5, true, true)


    // gestion des cameras
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name === "radio") {
                radioRef.current = child
                setShowRadioOutline(true)
            }
            if (child.isMesh && child.name === "couvercle") {
                trappeRef.current = child
                setShowTrappeOutline(true)
            }

            if (child.name.endsWith('_1')) { //Camera_face
                cameraRefs.current.camera1 = child
            } else if (child.name.endsWith('_2')) { //Camera_radio
                cameraRefs.current.camera2 = child
            } else if (child.name.endsWith('_3')) { //Camera_trappe
                cameraRefs.current.camera3 = child
            }
        })

        if (groupRef.current && cameraRefs.current.camera1) {
            groupRef.current.mainCamera = cameraRefs.current.camera1 // camera par defaut
        }
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
            setShowRadioOutline(false)

            cameraZoom(
                camera,
                cameraRefs.current.camera2,
                () => {
                    voiceOver.setIndex(1)
                    playRadio.play() // bruitage radio
                },
                props.portalGroupRef.current
            )
        }

        // action 2 - ouvrir la trappe
        if (clickedObject.name === 'couvercle' || clickedObject.name === 'tapis') {
            console.log('Trappe cliqué')
            setShowTrappeOutline(false)

            cameraZoom(
                camera,
                cameraRefs.current.camera3,
                () => {
                    voiceOver.setIndex(é)

                    const clip = animations.find(a => a.name === 'animation_0')
                    const mixer = new AnimationMixer(scene)
                    const action = mixer.clipAction(clip)

                    if (clip) {
                        action.setLoop(LoopOnce, 1)
                        action.clampWhenFinished = true
                        action.reset().play()

                        playTrappe.play() // bruitage trappe

                        // Ajouter le mixer pour mise à jour via useFrame
                        mixers.current.push({ mixer, action })
                    }
                },
                props.portalGroupRef.current
            )
        }
    }

    // Switch de murs
    useEffect(() => {
        if (scene) {
            salleRef.current = scene.getObjectByName('salle')
            salleDRef.current = scene.getObjectByName('salle_detruite')
        }
    }, [scene])
    useEffect(() => {
        if (salleRef.current && salleDRef.current) {
            if (!isSceneFinished) {
                salleRef.current.visible = true
                salleDRef.current.visible = false
            }

            if (currentScene === 'monde-guerre' && isSceneFinished) {
                console.log('switch', salleRef.current.visible)
                salleRef.current.visible = false
                salleDRef.current.visible = true
            }
        }
    }, [currentScene, isSceneFinished])

    return (
        <group position={[0, -2, -3]} rotation-y={-3.14} ref={groupRef} {...props} dispose={null} onClick={handleClick}>

            {/* Outline pour la radio */}
            {radioRef.current && (<>
                <primitive castShadow receiveShadow  object={radioRef.current}>
                    <Outlines
                        visible={showRadioOutline}
                        color="white"
                        thickness={8}
                        opacity={1}
                        transparent={false}
                        angle={Math.PI}
                    />
                </primitive>
            </>)}
            {/* Outline pour la trappe */}
            {trappeRef.current && (<>
                <primitive castShadow receiveShadow object={trappeRef.current}>
                    <Outlines
                        visible={showTrappeOutline}
                        color="white"
                        thickness={8}
                        opacity={1}
                        transparent={false}
                        angle={Math.PI}
                    />
                </primitive>
            </>)}

            <mesh position={[2, 1.55, 1.7]} rotation-y={-3}> {/* TODO: temporaire */}
                <boxGeometry args={[1.8, 2.8, 0.00001]} />
                <meshBasicMaterial map={animatedPeopleTexture} transparent={true} />
                {/* <meshBasicMaterial color='red' /> */}
            </mesh>

            <primitive castShadow receiveShadow object={scene} />
            <ambientLight intensity={1.2} />
            <spotLight position={[0, 5, 5]} intensity={0.8} />

            {currentScene === 'monde-guerre' &&
                <>
                    <InfoBulle position={[3.5, 2, 1.6]}
                        className='warBulle'
                        title="A l'abris de tous"
                        content="Les résistants cachaient souvent des documents compromettants dans des meubles du quotidien. Une commode pouvait ainsi dissimuler des tracts, des faux papiers ou des messages codés, à l'abri des regards lors des perquisitions."
                    />
                    <InfoBulle position={[-2.4, 1, 1.6]}
                        className='warBulle'
                        title="De la lumière ?"
                        content="Les résistants cachaient souvent des documents compromettants dans des meubles du quotidien. Une commode pouvait ainsi dissimuler des tracts, des faux papiers ou des messages codés, à l'abri des regards lors des perquisitions."
                    />
                </>
            }
        </group>
    )
}

export default forwardRef(WarScene)

useGLTF.preload('/models/scene_1942_v2.glb')