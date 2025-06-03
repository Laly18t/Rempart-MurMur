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
    const { animations, scene } = useGLTF('/models/1942_draco.glb', true)
    const { set, gl, camera } = useThree()

    const voiceOver = useVoiceOverStore()
    const { isSceneFinished, isPlaying, index } = useVoiceOverStore()
    const { currentScene, isZoom, setIsZoom } = useSceneStore()

    const mixers = useRef([])
    const cameraRefs = useRef({}) // Pour stocker toutes les caméras
    const salleRef = useRef()
    const salleDRef = useRef()
    const radioRef = useRef()
    const trappeRef = useRef()
    const [showRadioOutline, setShowRadioOutline] = useState(false)
    const [showTrappeOutline, setShowTrappeOutline] = useState(false)
    const [showPeople, setShowPeople] = useState(true)
    const [visible, setVisible] = useState(false)
    

    const playRadio = usePlaySound('/audio/sounds/radio.mp3')
    const playTrappe = usePlaySound('/audio/sounds/trappe_on.mp3')
    const playFire = usePlaySound('/audio/sounds/incendie_v1.mp3')

    const peopleFrames = [
        '/animations/war/1942_1.png',
        '/animations/war/1942_2.png',
        '/animations/war/1942_3.png',
        '/animations/war/1942_2.png',
    ]
    const {
        currentTexture: animatedPeopleTexture,
    } = useFrameAnimation(peopleFrames, 0.5, true, true)


    // gestion des cameras
    useEffect(() => {
        scene.traverse((child) => {
            console.log('Child name:', child.name)
            if (child.isMesh && child.name === "radio") {
                radioRef.current = child
                setShowRadioOutline(true)
            }
            if (child.isMesh && child.name === "couvercle") {
                trappeRef.current = child
                setShowTrappeOutline(false)
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
        if (clickedObject.name === 'radio' && !isPlaying) {
            console.log('Radio cliqué')
            setShowRadioOutline(false)
            setShowTrappeOutline(true)

            if (isZoom && !isPlaying) {
                handleZoom() // on retourne sur la caméra par défaut
            } else {
                cameraZoom(
                    camera,
                    cameraRefs.current.camera2,
                    () => {
                        voiceOver.setIndex(1)
                        playRadio.play() // bruitage radio
                        setTimeout(() => {handleZoom()}, 12000)
                    },
                    props.portalGroupRef.current
                )
            }
        }

        // action 2 - ouvrir la trappe
        if (clickedObject.name === 'couvercle' && !isPlaying || clickedObject.name === 'tapis' && !isPlaying) {
            console.log('Trappe cliqué')
            setShowTrappeOutline(false)

            if (isZoom && !isPlaying) {
                handleZoom() // on retourne sur la caméra par défaut
                voiceOver.setIndex(3)
            } else {
                cameraZoom(
                    camera,
                    cameraRefs.current.camera3,
                    () => {
                        voiceOver.setIndex(2)
                        setVisible(false)

                        const clip = animations.find(a => a.name === 'Anim_0')
                        const mixer = new AnimationMixer(scene)
                        const action = mixer.clipAction(clip)

                        if (clip) {
                            action.setLoop(LoopOnce, 1)
                            action.clampWhenFinished = true
                            action.reset().play()

                            playTrappe.play() // bruitage trappe

                            // Ajouter le mixer pour mise à jour via useFrame
                            mixers.current.push({ mixer, action })
                            const onFinished = () => {
                                setTimeout(() => {handleZoom()}, 5000) // seconde = 5000
                                setVisible(true)
                            }

                            mixer.addEventListener('finished', onFinished)

                            return () => {
                                mixer.removeEventListener('finished', onFinished)
                            }
                        }
                    },
                    props.portalGroupRef.current
                )
            }
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
                setVisible(true)
            }

            if (index === 2) {
                console.log('switch', salleRef.current.visible)
                setShowPeople(false)
                setVisible(false)
                salleRef.current.visible = false
                salleDRef.current.visible = true
                playFire.play() // bruitage explosion
            }
        }
    }, [currentScene, isSceneFinished, index])

    const handleZoom = () => {
        cameraZoom(
            camera,
            cameraRefs.current.camera1,
            () => { },
            props.portalGroupRef.current,
        )
        setIsZoom(false)
    }

    return (
        <group position={[0, -2, -3]} rotation-y={-3.14} ref={groupRef} {...props} dispose={null} onClick={handleClick}>

            {/* Outline pour la radio */}
            {radioRef.current && (<>
                <primitive position={[-2, 1.28, 4]} object={radioRef.current}>
                    <Outlines
                        visible={showRadioOutline}
                        color="white"
                        thickness={4}
                        opacity={1}
                        transparent={false}
                        angle={Math.PI}
                    />
                </primitive>
            </>)}
            {/* Outline pour la trappe */}
            {trappeRef.current && (<>
                <primitive position={[-2.7, 0.3, 0.55]} object={trappeRef.current}>
                    <Outlines
                        visible={showTrappeOutline}
                        color="white"
                        thickness={5}
                        opacity={1}
                        transparent={false}
                        angle={Math.PI}
                    />
                </primitive>
            </>)}

            <mesh visible={showPeople} position={[1, 1.75, 2.9]} rotation-y={-3}> {/* TODO: temporaire */}
                <boxGeometry args={[1.8, 2.8, 0.00001]} />
                <meshBasicMaterial map={animatedPeopleTexture} transparent={true} />
                {/* <meshBasicMaterial color='red' /> */}
            </mesh>

            <primitive castShadow receiveShadow object={scene} />
            <ambientLight intensity={1.2} />
            <spotLight position={[0, 5, 5]} intensity={0.8} />

            {currentScene === 'monde-guerre' && visible &&
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

useGLTF.preload('/models/1942_draco.glb')