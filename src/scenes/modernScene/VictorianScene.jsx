import React, { useRef, useEffect, useMemo, forwardRef, useState } from 'react'
import { useGLTF, PerspectiveCamera, Outlines } from '@react-three/drei'
import { MeshNormalMaterial, TextureLoader } from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'

import useSceneStore from '../../stores/useSceneStore'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
import InfoBulle from '../../componants/InfoBulle'
import { cameraZoom } from '../../utils/cameraUtils'
import usePlaySound from '../../hooks/usePlaySound'
import useFrameAnimation from '../../hooks/useFrameAnimation'

function VictorianScene({ ...props }, ref) {
    const { animations, scene } = useGLTF('/models/scene_1697.glb') // load model
    const groupRef = ref ?? useRef()
    const { set, gl, camera } = useThree()

    const voiceOver = useVoiceOverStore()
    const { isSceneFinished } = useVoiceOverStore()
    const { currentScene } = useSceneStore()

    const mixers = useRef([])
    const cameraRefs = useRef({}) // Pour stocker toutes les caméras
    const salleRef = useRef()
    const salleDRef = useRef()
    const bookRef = useRef()
    const flowerRef = useRef()
    const [showBookOutline, setShowBookOutline] = useState(false)
    const [showFlowerOutline, setShowFlowerOutline] = useState(false)

    const peopleFrames = [
        '/animations/modern/1697_1.png',
        '/animations/modern/1697_2.png',
        '/animations/modern/1697_3.png',
        '/animations/modern/1697_2.png',
    ]
    const { 
        currentTexture: animatedPeopleTexture,
        startAnimation,
        stopAnimation,
        isPlaying 
    } = useFrameAnimation(peopleFrames, 0.5, true, true)

    const playRadio = usePlaySound('/audio/sounds/radio.mp3')
    const playTrappe = usePlaySound('/audio/sounds/trappe_on.mp3')

    // gestion des cameras
    useEffect(() => {
        scene.traverse((child) => {
            // console.log('child', child.name)
            if (!child.isMesh) {
                console.log('child', child.name, child.isMesh)
            } 
            if (child.isMesh && child.name === "1697_groupe11") {
                bookRef.current = child
                setShowBookOutline(true)
            }
            if (child.isMesh && child.name === "1697_groupe61") {
                flowerRef.current = child
                setShowFlowerOutline(true)
            }

            if (child.name === '1697_camera') { //Camera_face
                console.log('child camera -- ', child)
                cameraRefs.current.camera1 = child.children[0].children[0]
                console.log('camera1', cameraRefs.current.camera1)
            } else if (child.name === 'cam_livre') { //Camera livre
                cameraRefs.current.camera2 = child
                console.log('camera2', cameraRefs.current.camera2)
            } else if (child.name === 'cam_bouquet') { //Camera fleurs
                cameraRefs.current.camera3 = child
                console.log('camera3', cameraRefs.current.camera3)
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

        // action 1 - ouvrir le livre
        if (clickedObject.name === '1697_groupe11') {
            console.log('livre cliqué')
            setShowBookOutline(false)
            console.log('cameraRefs', cameraRefs.current.camera2)

            cameraZoom(
                camera,
                cameraRefs.current.camera2,
                () => {
                    voiceOver.setIndex(1)

                    const clip = animations.find(a => a.name === 'animation_0')
                    const mixer = new AnimationMixer(scene)
                    const action = mixer.clipAction(clip)

                    if (clip) {
                        action.setLoop(LoopOnce, 1)
                        action.clampWhenFinished = true
                        action.reset().play()

                        // playTrappe.play() // bruitage trappe

                        // Ajouter le mixer pour mise à jour via useFrame
                        mixers.current.push({ mixer, action })
                    }
                },
                props.portalGroupRef.current
            )
        }

        // action 2 - ouvrir la trappe
        if (clickedObject.name === '1697_groupe61') {
            console.log('bouquet cliqué')
            setShowFlowerOutline(false)

            cameraZoom(
                camera,
                cameraRefs.current.camera3,
                () => {
                    voiceOver.setIndex(2)
                    // playRadio.play() // bruitage radio
                },
                props.portalGroupRef.current
            )
        }
    }


    return <>
        <group position={[0, -2, -1]} rotation-y={-3.14} ref={groupRef} {...props} dispose={null} onClick={handleClick}>

            {/* Outline pour le lustre */}
            {bookRef.current && (
                <>
                    <primitive castShadow receiveShadow object={bookRef.current}>
                        <Outlines
                            visible={showBookOutline}
                            color="white"
                            thickness={8}
                            opacity={1}
                            transparent={false}
                            angle={Math.PI}
                        />
                    </primitive>
                </>
            )}
            {/* Outline pour le lustre */}
            {flowerRef.current && (
                <>
                    <primitive castShadow receiveShadow  object={flowerRef.current}>
                        <Outlines
                            visible={showFlowerOutline}
                            color="white"
                            thickness={8}
                            opacity={1}
                            transparent={false}
                            angle={Math.PI}
                        />
                    </primitive>
                </>
            )}

            <mesh position={[-2.7, 1.1, -1.9]} rotation-y={-3}> {/* TODO: temporaire */}
                <boxGeometry args={[1.4, 1.8, 0.00001]} />
                <meshBasicMaterial map={animatedPeopleTexture} transparent={true} />
                {/* <meshBasicMaterial color='red' /> */}
            </mesh>

            <primitive castShadow receiveShadow object={scene} />
            <ambientLight intensity={1.5} />
            <spotLight position={[0, 5, 5]} intensity={0.8} />

            {currentScene === 'monde-moderne' &&
                <>
                    <InfoBulle position={[3.5, 3, -3.5]}
                        className='modernBulle'
                        title="A l'abris de tous"
                        content="Les résistants cachaient souvent des documents compromettants dans des meubles du quotidien. Une commode pouvait ainsi dissimuler des tracts, des faux papiers ou des messages codés, à l'abri des regards lors des perquisitions."
                    />
                    <InfoBulle position={[0.7, 1.7, -3.5]}
                        className='modernBulle'
                        title="De la lumière ?"
                        content="Les résistants cachaient souvent des documents compromettants dans des meubles du quotidien. Une commode pouvait ainsi dissimuler des tracts, des faux papiers ou des messages codés, à l'abri des regards lors des perquisitions."
                    />
                </>
            }
        </group>
    </>
}

export default forwardRef(VictorianScene)

useGLTF.preload('/models/scene_1697.glb')