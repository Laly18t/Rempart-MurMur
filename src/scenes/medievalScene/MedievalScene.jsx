import React, { useState, useEffect, useMemo, useRef, forwardRef } from 'react'
import { AnimationMixer, MeshNormalMaterial, TextureLoader } from 'three'
import { Select } from "@react-three/postprocessing"
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera, Html } from '@react-three/drei'
import { LoopOnce, Vector3, Quaternion, Euler } from 'three'

// composants
import Lustre from './Lustre'
import InfoBulle from '../../componants/InfoBulle'
import useVoiceOverStore from '../../stores/useVoiceOverStore' // store
import useSceneStore from '../../stores/useSceneStore'
import usePlaySound from '../../hooks/usePlaySound'
import { cameraZoom } from '../../utils/cameraUtils'


function MedievalScene({ ...props }, ref) {
    const { scene: sceneOn, animations } = useGLTF('/models/scene_1317_v7_a.glb')
    const { scene: sceneOff } = useGLTF('/models/scene_1317_v6_e.glb')
    const [useSwitchBaking, setSwitchBaking] = useState(true)
    const groupRef = ref ?? useRef()
    const mixers = useRef([])
    const cameraRefs = useRef({})
    const { set, gl, camera } = useThree()
    const voiceOver = useVoiceOverStore()
    const { isSceneFinished } = useVoiceOverStore()
    const { currentScene } = useSceneStore()
    const salleRef = useRef()
    const salleDRef = useRef()
    const [visible, setVisible] = useState(false)

    const people = useLoader(TextureLoader, '/people_medieval.PNG')
    const playCandles = usePlaySound('/audio/sounds/bougie.wav')
    const playPoison = usePlaySound('/audio/sounds/fiole.mp3')


    // gestion des cameras
    useEffect(() => {
        const currentScene = useSwitchBaking ? sceneOff : sceneOn

        currentScene.traverse((child) => {
            if (child.name.endsWith('_1')) { //Camera generale
                cameraRefs.current.camera1 = child
            } else if (child.name.endsWith('_2')) { //Camera lustre
                cameraRefs.current.camera2 = child
            } else if (child.name.endsWith('_3')) { //Camera fiole
                cameraRefs.current.camera3 = child
            }
        })

        if (groupRef.current && cameraRefs.current.camera1) {
            groupRef.current.mainCamera = cameraRefs.current.camera1 // camera par defaut
        }
    }, [useSwitchBaking])

    // mixer pour animation
    useFrame((state, delta) => {
        mixers.current.forEach(({ mixer }) => mixer.update(delta))
    })

    const handleClick = (e) => {
        const clickedObject = e.object
        console.log('Objet cliqué:', clickedObject.name)

        // action 1 - allumer la lumiere
        if (clickedObject.name === 'EXPORT_LUSTRE') {
            console.log('Lustre cliqué')
            setVisible(!visible)
            cameraZoom(
                camera,
                cameraRefs.current.camera2,
                () => {
                    playCandles.play() // bruitage bougie
                    setSwitchBaking(prev => !prev)
                    voiceOver.setIndex(1)
                },
                props.portalGroupRef.current
            )
        }

        // action 2 - trouver le poison
        if (clickedObject.name === 'EXPORT_FIOLE') {
            console.log('Fiole cliquée')

            cameraZoom(
                camera,
                cameraRefs.current.camera3,
                () => {
                    const clip = animations.find(a => a.name === 'animation_0')
                    const target = sceneOn.getObjectByName('EXPORT_FIOLE')

                    if (clip && target) {
                        const mixer = new AnimationMixer(target)
                        const action = mixer.clipAction(clip)
                        action.setLoop(LoopOnce, 1)
                        action.clampWhenFinished = true
                        action.reset().play()
                        voiceOver.setIndex(2)

                        playPoison.play() // bruitage fiole

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
        if (salleRef.current && salleDRef.current) {
            if (currentScene === 'monde-medieval' && isSceneFinished) {
                console.log('switch', salleRef.current.visible)
                salleRef.current.visible = false
                salleDRef.current.visible = true
            }
        }
    }, [currentScene, isSceneFinished])
    useEffect(() => {
        if (salleRef.current && salleDRef.current) {
            if (!isSceneFinished) {
                salleRef.current.visible = true
                salleDRef.current.visible = false
            }
        }
    }, [useSwitchBaking, isSceneFinished])
    useEffect(() => {
        if (sceneOn) {
            salleRef.current = sceneOn.getObjectByName('EXPORT_SALLE')
            salleDRef.current = sceneOn.getObjectByName('EXPORT_SALLE_D')
        }
    }, [sceneOn])

    const handleZoom = () => {
        cameraZoom(camera, cameraRefs.current.camera1, () => { }, props.portalGroupRef.current)
        setVisible(!visible)
    }

    return <>
        <ambientLight intensity={useSwitchBaking ? 0.2 : 1.8} />

        <group
            position={[0, -2, -1]}
            rotation-y={-3.1}
            ref={groupRef}
            {...props}
            dispose={null}
            onClick={handleClick}
        >
            {!useSwitchBaking &&
                <>
                    {/* Salle avec lumiere */}
                    <primitive
                        object={sceneOn}
                    />
                    <mesh position={[0.2, 1.2, 0.2]} rotation-y={-3.14}>
                        <boxGeometry args={[0.9, 2, 0.00001]} />
                        <meshBasicMaterial map={people} transparent={true} />
                    </mesh>
                    
                    {currentScene === 'monde-medieval' && <>
                        <InfoBulle 
                            position={[6.3, 3, 1.6]}
                            className='medievalBulle'
                            title='Les murs en disent long'
                            content='À cette époque, les murs en pierre étaient recouverts de lourdes tentures pour bloquer le froid et couper les bruits. Mais attention, ce n’était pas juste pour l’isolation : chaque tapisserie était un symbole de richesse. Entre scènes religieuses, héraldiques ou épiques, elles montraient non seulement le bon goût du seigneur, mais aussi son pouvoir.'
                        />
                        <InfoBulle position={[0.7, 1, 1.6]}
                            className='medievalBulle'
                            title='Ta chaise dit tout de toi'
                            content='À cette époque, les murs en pierre étaient recouverts de lourdes tentures pour bloquer le froid et couper les bruits. Mais attention, ce n’était pas juste pour l’isolation : chaque tapisserie était un symbole de richesse. Entre scènes religieuses, héraldiques ou épiques, elles montraient non seulement le bon goût du seigneur, mais aussi son pouvoir.'
                        />
                    </>}
                </>
            }

            {/* Salle sans lumiere */}
            {useSwitchBaking &&
                <primitive object={sceneOff} />
            }

            {visible &&
                // <Html position={[2,0,2]}>Retour à la scène</Html>
                <mesh position={[-2, 3, 2]} onClick={handleZoom} >
                    <boxGeometry />
                    <meshBasicMaterial color={'red'} />
                </mesh>
            }
        </group>

    </>
}

export default forwardRef(MedievalScene)

useGLTF.preload('/models/scene_1317_v7_a.glb')
useGLTF.preload('/models/scene_1317_v6_e.glb')
