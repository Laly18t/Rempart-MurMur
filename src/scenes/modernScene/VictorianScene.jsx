import React, { useRef, useEffect, forwardRef, useState } from 'react'
import { useGLTF, Outlines } from '@react-three/drei'
import { AnimationMixer, LoopOnce, MeshBasicMaterial, TextureLoader } from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'

import useSceneStore from '../../stores/useSceneStore'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
import InfoBulle from '../../componants/InfoBulle'
import { cameraZoom } from '../../utils/cameraUtils'
import usePlaySound from '../../hooks/usePlaySound'
import useFrameAnimation from '../../hooks/useFrameAnimation'

function VictorianScene({ ...props }, ref) {
    const { animations, scene } = useGLTF('/models/scene_1697_v4.glb') // load model
    const { camera } = useThree()

    const voiceOver = useVoiceOverStore()
    const { isSceneFinished, isPlaying, index } = useVoiceOverStore()
    const { currentScene, isZoom, setIsZoom } = useSceneStore()

    const groupRef = ref ?? useRef()
    const mixers = useRef([])
    const cameraRefs = useRef({}) // Pour stocker toutes les caméras
    const salleRef = useRef()
    const salleDRef = useRef()
    const bookRef = useRef()
    const flowerRef = useRef()

    const [showBookOutline, setShowBookOutline] = useState(true)
    const [showFlowerOutline, setShowFlowerOutline] = useState(false)
    const [showPeople, setShowPeople] = useState(true)
    const [visible, setVisible] = useState(false)

    const peopleFrames = [
        '/animations/modern/1697_1.png',
        '/animations/modern/1697_2.png',
        '/animations/modern/1697_3.png',
        '/animations/modern/1697_2.png',
    ]
    const {
        currentTexture: animatedPeopleTexture,
    } = useFrameAnimation(peopleFrames, 0.5, true, true)

    const playBook = usePlaySound('/audio/sounds/book.mp3')
    const playFlower = usePlaySound('/audio/sounds/bouquet.mp3')
    const playFire = usePlaySound('/audio/sounds/incendie_v1.mp3')

    // gestion des cameras
    useEffect(() => {
        scene.traverse((child) => {
            // console.log('child -->', child.name)
            if (child.isMesh) {
                const oldMaterial = child.material

                // On récupère la texture map de l'ancien matériau
                const bakedTexture = oldMaterial.map

                child.material = new MeshBasicMaterial({
                    map: bakedTexture,
                    transparent: oldMaterial.transparent,
                    opacity: oldMaterial.opacity,
                })

                if (child.name === "1697_livre_ouvert") {
                    bookRef.current = child
                    setShowBookOutline(true)
                }

                if (child.name === "1697_bouquet_mot") {
                    flowerRef.current = child
                }
            }
            if (child.name === "bake") {
                salleRef.current = child
                salleRef.current.visible = true
            }
            if (child.name === "bake_noir") {
                salleDRef.current = child
                salleDRef.current.visible = false
            }

            if (child.name === 'cam_ensemble') { //Camera_face
                cameraRefs.current.camera1 = child
            } else if (child.name === 'cam_livre') { //Camera livre
                cameraRefs.current.camera2 = child
            } else if (child.name === 'cam_bouquet') { //Camera fleurs
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

        // action 1 - ouvrir le livre
        if (clickedObject.name === '1697_livre_ouvert' && !isPlaying) {
            if (isZoom && !isPlaying) {
                handleZoom()
            } else {
                setIsZoom(true)
                setShowBookOutline(false)

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

                            playBook.play() // bruitage livre

                            const onFinished = () => {
                                setTimeout(() => { 
                                    handleZoom() 
                                    setShowFlowerOutline(true)
                                }, 10000)
                            }

                            // Ajouter le mixer pour mise à jour via useFrame
                            mixers.current.push({ mixer, action })

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

        // action 2 - voir le bouquet
        if (clickedObject.name === '1697_bouquet_mot' && !isPlaying) {
            setIsZoom(true)
            setShowBookOutline(false)
            console.log('bouquet cliqué')
            setShowFlowerOutline(false)

            if (isZoom && !isPlaying) {
                handleZoom()
            } else {
                cameraZoom(
                    camera,
                    cameraRefs.current.camera3,
                    () => {
                        voiceOver.setIndex(2)
                        playFlower.play() // bruitage bouquet
                    },
                    props.portalGroupRef.current
                )
            }
        }
    }

    // Switch de murs
    useEffect(() => {
        if (salleRef.current && salleDRef.current) {
            if (index === 2 && currentScene === 'monde-moderne') {
                setTimeout(() => {
                    handleZoom()
                    setShowPeople(false)
                    setVisible(false)
                    salleRef.current.visible = false
                    salleDRef.current.visible = true
                    playFire.play() // bruitage incendie
                }, 28000)
            } else {
                playFire.stop() 
            }
        }
    }, [currentScene, isSceneFinished, showPeople, index])

    const handleZoom = () => {
        cameraZoom(
            camera,
            cameraRefs.current.camera1,
            () => { },
            props.portalGroupRef.current,
        )
        setIsZoom(false)
    }

    return <>
        <group position={[0, -2, -1]} rotation-y={-3.14} ref={groupRef} {...props} dispose={null} onClick={handleClick}>

            {/* Outline pour le livre */}
            {bookRef.current && (<>
                <primitive object={bookRef.current}>
                    <Outlines
                        visible={showBookOutline}
                        color="white"
                        thickness={4}
                        opacity={1}
                        transparent={false}
                        angle={Math.PI}
                    />
                </primitive>
            </>)}

            {/* Outline pour le bouquet */}
            {flowerRef.current && (<>
                <primitive object={flowerRef.current}>
                    <Outlines
                        visible={showFlowerOutline}
                        color="white"
                        thickness={2}
                        opacity={1}
                        transparent={false}
                        angle={Math.PI}
                    />
                </primitive>
            </>)}

            <mesh visible={showPeople} position={[-2.7, 1.1, -1.9]} rotation-y={-3}> {/* TODO: temporaire */}
                <boxGeometry args={[1.4, 1.8, 0.00001]} />
                <meshBasicMaterial map={animatedPeopleTexture} transparent={true} />
            </mesh>

            <primitive castShadow receiveShadow object={scene} renderOrder={1} />

            {currentScene === 'monde-moderne' && visible &&
                <>
                    <InfoBulle position={[3.5, 3, -3.5]}
                        className='modernBulle'
                        title="La culture du vide"
                        content="Dans certaines demeures, les étagères alignaient de superbes reliures en cuir… qui ne cachaient que du vide. Ces faux livres, commandés par des nobles soucieux des apparences, servaient à afficher une érudition qu’ils n’avaient pas. À cette époque, posséder une bibliothèque, même factice suffisait à briller en société."
                    />
                    <InfoBulle position={[0.7, 1.7, -3.5]}
                        className='modernBulle'
                        title="De la lumière ?"
                        content="À la fin du XVIIIe siècle, posséder un piano, c’était afficher son rang autant que son goût. Dans les salons bourgeois, il incarnait l’éducation raffinée, surtout celle des jeunes filles, qui devaient savoir en jouer pour briller en société. Chaque mélodie jouée devenait un signe de vertu… et un argument discret en faveur d’un bon mariage."
                    />
                </>
            }

        </group>
    </>
}

export default forwardRef(VictorianScene)

useGLTF.preload('/models/scene_1697_v4.glb')