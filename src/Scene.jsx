import { TextureLoader } from 'three'
import { Suspense, useRef, useState } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'

// composants
import Portal from './componants/Portal'
import VoiceOver from './componants/VoiceOver'
import MedievalScene from './scenes/medievalScene/MedievalScene'   // 1317
import VictorianScene from './scenes/modernScene/VictorianScene' // 1749
import WarScene from './scenes/warScene/WarScene'             // 1942

// constants
import CONSTANTS, { ASSETS, DATA } from './constants'

// hooks
import useScrollControl from './hooks/useScrollControl'
import useCameraControl from './hooks/useCameraControl'
import useSceneTransition from './hooks/useSceneTransition'
import useTextureLoader from './hooks/useTextureLoader'
import useActivePortal from './hooks/useActivePortal'
import useSceneStore from './hooks/useSceneStore'

// scene centrale
export default function Scene() {
    const { currentScene, setCurrentScene } = useSceneStore()
    const groupRef = useRef()
    const { camera } = useThree()
    const [canEnterPortal, setCanEnterPortal] = useState(true) // bloquer l'entree dans un portail

    // load des textures + cadres
    const textureParchemin = useTextureLoader(ASSETS.TEXTURE_PARCHEMIN)
    const warFrame = useLoader(TextureLoader, ASSETS.WAR_FRAME)

    // hooks
    const { voiceStep } = useActivePortal() // gestion du portail actif
    const scrollRef = useScrollControl(currentScene)  // gestion du scroll
    // useSceneTransition(gl, camera, scene, setSceneA, setSceneB) // gestion des transitions
    useCameraControl(currentScene, scrollRef, camera) // gestion de la camera

    return <>
        {/* activation voix-off */}
        <VoiceOver
            voiceStep={voiceStep}
            onComplete={(step) => {
                if (step === 'intro') {
                    setCanEnterPortal(true)
                }
            }}
            onSegmentChange={(index) => {
                console.log(`Audio ${index} fini pour ${voiceStep}`)
            }}
        />
        <mesh position={[0, 0, 4]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.1, 0.6, 2.5]} />
            <meshBasicMaterial color="red" />
            <Text fontSize={0.3} rotation={[0, -Math.PI / 2, 0]} anchorY="top" anchorX="left" lineHeight={0.8} position={[-1, 0.1, -0.9]}>
                Activer le son
            </Text>
        </mesh>

        <group ref={groupRef}>
            {/* Parchemin */}
            <mesh position={[0, 0, -3]}>
                <planeGeometry args={[370, 20]} />
                <meshBasicMaterial map={textureParchemin} />
            </mesh>

            {/* Portail 1 - Medieval */}
            <Portal
                id={DATA.medieval.name}
                name={DATA.medieval.date}
                position={CONSTANTS.POSITIONS_PARCHEMIN[DATA.medieval.name]}
                onClick={() => {
                    console.log('clic', canEnterPortal)
                    if (canEnterPortal) setCurrentScene(DATA.medieval.name)
                }}
                textureDecoration={warFrame}
            >
                <Suspense>
                    <MedievalScene />
                </Suspense>
            </Portal>

            {/* Portail 2 - Victorien */}
            <Portal
                id={DATA.moderne.name}
                name={DATA.moderne.date}
                position={CONSTANTS.POSITIONS_PARCHEMIN[DATA.moderne.name]}
                onClick={() =>{
                    if (canEnterPortal) setCurrentScene(DATA.moderne.name)
                }}
                textureDecoration={warFrame}
            >
                <Suspense>
                    <VictorianScene />
                    <ambientLight intensity={0.6} />
                    <spotLight position={[0, 5, 5]} intensity={0.8} />
                </Suspense>
            </Portal>

            {/* Portail 3 - 2nd guerre mondiale */}
            <Portal
                id={DATA.guerre.name}
                name={DATA.guerre.date}
                position={CONSTANTS.POSITIONS_PARCHEMIN[DATA.guerre.name]}
                onClick={() =>{
                    if (canEnterPortal) setCurrentScene(DATA.guerre.name)
                }}
                textureDecoration={warFrame}
            >
                <Suspense>
                    <WarScene />
                    <ambientLight intensity={0.6} />
                    <spotLight position={[0, 5, 5]} intensity={0.8} />
                </Suspense>
            </Portal>
        </group>
    </>
}