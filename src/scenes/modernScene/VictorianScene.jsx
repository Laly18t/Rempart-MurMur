import React, { useRef, useEffect, useMemo, forwardRef } from 'react'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import { MeshNormalMaterial, TextureLoader } from 'three'
import { useFrame, useLoader, useThree } from '@react-three/fiber'

import useSceneStore from '../../stores/useSceneStore'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
import InfoBulle from '../../componants/InfoBulle'
import { cameraZoom } from '../../utils/cameraUtils'
import usePlaySound from '../../hooks/usePlaySound'

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

    const people = useLoader(TextureLoader, '/people_modern.PNG')
    const playRadio = usePlaySound('/audio/sounds/radio.mp3')
    const playTrappe = usePlaySound('/audio/sounds/trappe_on.mp3')

    // gestion des cameras
    useEffect(() => {
        scene.traverse((child) => {
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
        if (clickedObject.name === 'livre') {
            console.log('livre cliqué')
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
        if (clickedObject.name === 'bouquet') {
            console.log('bouquet cliqué')
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

            <mesh position={[-2.7, 1.15, -1.7]} rotation-y={-3}> {/* TODO: temporaire */}
                <boxGeometry args={[1.4, 1.8, 0.00001]} />
                <meshBasicMaterial map={people} transparent={true} />
                {/* <meshBasicMaterial color='red' /> */}
            </mesh>

            <primitive castShadow receiveShadow object={scene} />
            <ambientLight intensity={1} />
            <spotLight position={[0, 5, 5]} intensity={0.8} />

            {currentScene === 'monde-moderne' &&
                <>
                    <InfoBulle position={[3.8, 3, 1.6]}
                        className='modernBulle'
                        title="A l'abris de tous"
                        content="Les résistants cachaient souvent des documents compromettants dans des meubles du quotidien. Une commode pouvait ainsi dissimuler des tracts, des faux papiers ou des messages codés, à l'abri des regards lors des perquisitions."
                    />
                    <InfoBulle position={[-1.5, 0.5, 1.6]}
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