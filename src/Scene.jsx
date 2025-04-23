import { TextureLoader } from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useLoader, useThree } from '@react-three/fiber'
import { useRoute } from 'wouter'

// composants
import Portal from './Composants/Portal'
import VoiceOver from './Composants/VoiceOver'
import MedievalScene from './Models/MedievalScene'   // 1317
import VictorianScene from './Models/VictorianScene' // 1749
import WarScene from './Models/WarScene'             // 1940

// constants
import CONSTANTS, { ASSETS, DATA } from './constants'

// hooks
import useScrollControl from './hooks/useScrollControl'
import useCameraControl from './hooks/useCameraControl'
import useSceneTransition from './hooks/useSceneTransition'
import useTextureLoader from './hooks/useTextureLoader'
import useActivePortal from './hooks/useActivePortal'

// scene centrale
export default function Scene({ onEnterPortal, setSceneA, setSceneB }) {
    const groupRef = useRef()
    const { camera, gl, scene } = useThree()
    const [canEnterPortal, setCanEnterPortal] = useState(false) // bloquer l'entree dans un portail

    // load des textures + cadres
    const textureParchemin = useTextureLoader(ASSETS.TEXTURE_PARCHEMIN)
    const warFrame = useLoader(TextureLoader, ASSETS.WAR_FRAME)

    // gestion du portail actif
    const { activePortalId, voiceStep } = useActivePortal(onEnterPortal)

    // gestion du scroll
    const scrollRef = useScrollControl(activePortalId)

    // gestion des transitions
    useSceneTransition(gl, camera, scene, setSceneA, setSceneB)

    // gestion de la camera
    useCameraControl(activePortalId, scrollRef, camera)

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
                    if (canEnterPortal) onEnterPortal(DATA.medieval.name)
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
                    if (canEnterPortal) onEnterPortal(DATA.moderne.name)
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
                    if (canEnterPortal) onEnterPortal(DATA.guerre.name)
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