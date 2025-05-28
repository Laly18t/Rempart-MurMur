import React, {useState, useEffect, useMemo, useRef, forwardRef} from 'react'
import {AnimationMixer, MeshNormalMaterial, TextureLoader} from 'three'
import { Select } from "@react-three/postprocessing"
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import {useGLTF, PerspectiveCamera, Html} from '@react-three/drei'
import { LoopOnce } from 'three'

// composants
import Lustre from './Lustre' 
import InfoBulle from '../../componants/InfoBulle'
import useVoiceOverStore from '../../stores/useVoiceOverStore' // store
import useSceneStore from '../../stores/useSceneStore'
import usePlaySound from '../../hooks/usePlaySound'

function MedievalScene({ ...props }, ref) {
    const { scene: sceneOn, animations, cameras: camerasOn } = useGLTF('/models/scene_1317_v4_a.glb')
    const { scene: sceneOff, cameras: camerasOff } = useGLTF('/models/scene_1317_v3_e.glb')
    const [useSwitchBaking, setSwitchBaking] = useState(true)
    const groupRef = ref ?? useRef()
    const mixers = useRef([])
    const voiceOver = useVoiceOverStore()
    const { isSceneFinished } = useVoiceOverStore()
    const { currentScene } = useSceneStore()
    const salleRef = useRef()
    const salleDRef = useRef()

    const people = useLoader(TextureLoader, '/people_medieval.PNG')
    const playCandles = usePlaySound('/audio/sounds/bougie.wav')
    const playPoison = usePlaySound('/audio/sounds/fiole.mp3')
    

    // utiliser la camera principale
    useEffect(() => {
        const currentScene = useSwitchBaking ? sceneOff : sceneOn

        currentScene.traverse((child) => {
            if (child.name.endsWith('_1')) { //Camera_face
                groupRef.current.mainCamera = child
            }
        })
    }, [useSwitchBaking])

    // mixer pour animation
    useFrame((state, delta) => {
        mixers.current.forEach(({ mixer }) => mixer.update(delta))
    })

    const handleClick = (e) => {
        const clickedObject = e.object
        // console.log('Objet cliqué:', clickedObject.name)
        
        // action 1 - allumer la lumiere
        if (clickedObject.name === 'EXPORT_LUSTRE') {
            console.log('Lustre cliqué')
            setSwitchBaking(prev => !prev)
            voiceOver.setIndex(1)
            playCandles.play() // bruitage bougie
        }

        // action 2 - trouver le poison
        if (clickedObject.name === 'EXPORT_FIOLE') {
            console.log('Fiole cliquée')
            const clip = animations.find(a => a.name === 'animation_0')
            const target = sceneOn.getObjectByName('EXPORT_FIOLE')

            if (clip && target) {
                const mixer = new AnimationMixer(target)
                const action = mixer.clipAction(clip)
                action.setLoop(LoopOnce, 1)
                action.clampWhenFinished = true
                action.reset().play()
                playPoison.play() // bruitage fiole
                
                // Ajouter le mixer pour mise à jour via useFrame
                mixers.current.push({ mixer, action })
            } 
        }
    }

    // Switch de murs
    useEffect(() => {
        if (currentScene === 'monde-medieval' && isSceneFinished) {
            console.log('switch')
            if (salleRef.current && salleDRef.current) {
                salleRef.current.visible = false
                salleDRef.current.visible = true
            }
        }
    }, [currentScene, isSceneFinished])

    return <>
        <ambientLight intensity={useSwitchBaking ? 0.2 : 2} />

        <group
            position={[0,-2, -1]}
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
                        ref={(instance) => {
                            if (instance) {
                                salleRef.current = instance.getObjectByName('EXPORT_SALLE')
                                salleDRef.current = instance.getObjectByName('EXPORT_SALLE_D')
                                // salleRef.current.visible = true
                                // salleDRef.current.visible = false
                                
                            }}
                        }
                    />
                    <mesh position={[0.2, 1.2, 0.2]} rotation-y={ -3.14 }>
                        <boxGeometry args={[0.9, 2, 0.00001]} /> 
                        <meshBasicMaterial map={people} transparent={true}  />
                    </mesh>

                    <InfoBulle position={[3, 2, 1.6]}
                    title='Les murs en disent long'
                    content='À cette époque, les murs en pierre étaient recouverts de lourdes tentures pour bloquer le froid et couper les bruits. Mais attention, ce n’était pas juste pour l’isolation : chaque tapisserie était un symbole de richesse. Entre scènes religieuses, héraldiques ou épiques, elles montraient non seulement le bon goût du seigneur, mais aussi son pouvoir.'
                    />
                    <InfoBulle position={[-1, 1, 1.6]}
                        title='Ta chaise dit tout de toi'
                        content='À cette époque, les murs en pierre étaient recouverts de lourdes tentures pour bloquer le froid et couper les bruits. Mais attention, ce n’était pas juste pour l’isolation : chaque tapisserie était un symbole de richesse. Entre scènes religieuses, héraldiques ou épiques, elles montraient non seulement le bon goût du seigneur, mais aussi son pouvoir.'
                    />
                </>
            }

            {/* Salle sans lumiere */}
            {useSwitchBaking && 
                <primitive object={sceneOff} />
            }
            
        </group>

    </>
}

export default forwardRef(MedievalScene)

useGLTF.preload('/models/scene_1317_v4_a.glb')
useGLTF.preload('/models/scene_1317_v3_e.glb')
