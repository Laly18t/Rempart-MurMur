import { TextureLoader } from 'three'
import { Suspense, useRef, useState } from 'react'
import { useLoader, useThree } from '@react-three/fiber'

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

// stores
import useSceneStore from './stores/useSceneStore'
import Intro from './componants/UI/Intro'
import Outro from './componants/UI/Outro'
import ScrollableScene from './componants/ScrollableScene'
import { useEasedCamera } from './hooks/useEasedCamera'
import ParcheminBackground from './componants/ParcheminBackground'
import ArrowButton from './componants/ArrowButton'
import useAppStore from './stores/useAppStore'
import CTA_end from './componants/UI/CTA_end'

// scene centrale
export default function Scene() {
    const { currentScene, setCurrentScene } = useSceneStore()
    const portalRef = useRef()
    const { camera } = useThree()
    const [canEnterPortal, setCanEnterPortal] = useState(true) // bloquer l'entree dans un portail

    // load des textures + cadres
    const warFrame = useLoader(TextureLoader, ASSETS.WAR_FRAME)
    const modernFrame = useLoader(TextureLoader, ASSETS.MODERN_FRAME)
    const medievalFrame = useLoader(TextureLoader, ASSETS.MEDIEVAL_FRAME)

    // hooks
    // const scrollRef = useRef(0)
    const scrollRef = useScrollControl()  // gestion du scroll
    useActivePortal() // gestion du portail actif
    // useCameraControl(scrollRef, camera) // gestion de la camera
    useEasedCamera(scrollRef, camera) // gestion de la camera

    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)

    const handleClickButton = () => {
        setStep(step + 1)
    }

    console.log('step', step)

    return <>
        {/* activation voix-off */}
        <VoiceOver
            onAudioEnd={(index) => {
                console.log("Audio terminé:", index)
                // TODO: enable portal
            }}
        />

        <ParcheminBackground visible={step < 5} />

        {/* Group avec chaque etape de l'XP */}
        <ScrollableScene>
            {/* Partie 0 - Introduction */}
            <Intro />

            {/* Portail 1 - Medieval */}
            <group ref={portalRef}>
                <Portal
                    id={DATA.medieval.name}
                    onClick={() => {
                        if (canEnterPortal)
                            setCurrentScene(DATA.medieval.name)
                            const worldPosition = new THREE.Vector3()
                            portalRef.current.getWorldPosition(worldPosition)
                            worldPosition.z += 1.5
                            setCurrentScene(DATA.medieval.name, worldPosition)
                    }}
                    textureDecoration={medievalFrame}
                    badgeDecoration={ASSETS.MEDIEVAL_BADGE}
                    portalStep={3}
                >
                    <Suspense>
                        <MedievalScene />
                    </Suspense>
                </Portal>
                <ArrowButton position={[2.5, -0.2, 0]} onClick={handleClickButton} />
            </group>

            {/* Portail 2 - Modern */}
            <group ref={portalRef}>
                <Portal
                    id={DATA.moderne.name}
                    onClick={() => {
                        if (canEnterPortal) setCurrentScene(DATA.moderne.name)
                    }}
                    textureDecoration={modernFrame}
                    badgeDecoration={ASSETS.MODERN_BADGE}
                    portalStep={4}
                >
                    <Suspense>
                        <VictorianScene />
                        <ambientLight intensity={0.6} />
                        <spotLight position={[0, 5, 5]} intensity={0.8} />
                    </Suspense>
                </Portal>
                <ArrowButton position={[2.4, 0, 0]} onClick={handleClickButton} />
            </group>

            {/* Portail 3 - 2nd guerre mondiale */}
            <group ref={portalRef}>
                <Portal
                    id={DATA.guerre.name}
                    onClick={() => {
                        if (canEnterPortal) setCurrentScene(DATA.guerre.name)
                    }}
                    textureDecoration={warFrame}
                    badgeDecoration={ASSETS.WAR_BADGE}
                    portalStep={5}
                >
                    <Suspense>
                        <WarScene />
                        <ambientLight intensity={0.6} />
                        <spotLight position={[0, 5, 5]} intensity={0.8} />
                    </Suspense>
                </Portal>
                <ArrowButton position={[2.3, 0, 0]} onClick={handleClickButton} />
            </group>

            {/* Partie 4 - Conclusion */}
            <Outro />

            {/* Partie 5 - CTA de fin */}
            <CTA_end />

        </ScrollableScene>
    </>
}