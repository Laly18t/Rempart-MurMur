import { TextureLoader } from 'three'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useLoader, useThree } from '@react-three/fiber'

// composants
import Portal from './componants/Portal'
import VoiceOver from './componants/VoiceOver'
import MedievalScene from './scenes/medievalScene/MedievalScene'   // 1317
import VictorianScene from './scenes/modernScene/VictorianScene' // 1749
import WarScene from './scenes/warScene/WarScene'             // 1942

// constants
import CONSTANTS, { ASSETS, DATA, SETTINGS } from './constants'

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
import ParcheminBackground from './componants/ParcheminBackground'
import ArrowButton from './componants/ArrowButton'
import useAppStore from './stores/useAppStore'
import usePlaySound from './hooks/usePlaySound'

// scene centrale
export default function Scene() {
    const setCurrentScene = useSceneStore((state) => state.setCurrentScene)
    const {currentScene, outScene} = useSceneStore()
    const getCurrentScene = useSceneStore.getState

    // Create separate refs for each portal
    const medievalPortalRef = useRef()
    const modernPortalRef = useRef()
    const warPortalRef = useRef()

    // load des textures + cadres
    const warFrame = useLoader(TextureLoader, ASSETS.WAR_FRAME)
    const modernFrame = useLoader(TextureLoader, ASSETS.MODERN_FRAME)
    const medievalFrame = useLoader(TextureLoader, ASSETS.MEDIEVAL_FRAME)

    const playParcheminIntro = usePlaySound("/audio/sounds/parchemin/son_intro.ogg")
    const playParcheminOutro = usePlaySound("/audio/sounds/parchemin/son_fin.ogg")
    const playParcheminMusic1 = usePlaySound("/audio/sounds/parchemin/son_entre_1317_1697.ogg")
    const playParcheminMusic2 = usePlaySound("/audio/sounds/parchemin/son_entre_1697_1942.ogg")

    // hooks
    // const scrollRef = useRef(0)
    // const scrollRef = useScrollControl()  // gestion du scroll
    useActivePortal() // gestion du portail actif
    // useCameraControl(scrollRef, camera) // gestion de la camera
    // useEasedCamera(scrollRef, camera) // gestion de la camera

    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)
    const setStep = useAppStore((state) => state.setStep)

    const handleClickButton = () => {
        nextStep()
    }
    const handleReturnButton = () => {
        setStep(step - 1)
    }

    useEffect(() => {
        // play de la musique de fond
        if (step === 3 || step === 4) {
            playParcheminIntro.play()
        } else if (step === 7) {
            playParcheminMusic2.stop()
            playParcheminOutro.play()
        } else if (step === 5) {
            playParcheminIntro.stop()
            playParcheminMusic1.play()
        } else if (step === 6) {
            playParcheminMusic1.stop()
            playParcheminMusic2.play()
        } 
    }, [step])

    return <>
        {/* activation voix-off */}
        <VoiceOver />

        <ParcheminBackground />

        {/* Group avec chaque etape de l'XP */}
        <ScrollableScene>
            {/* Partie 0 - Introduction */}
            <Intro />

            {/* Portail 1 - Medieval */}
            <group ref={medievalPortalRef}>
                <Portal
                    id={DATA.medieval.name}
                    onClick={()=> {
                        setCurrentScene(DATA.medieval.name)
                        playParcheminIntro.stop()
                    }}
                    textureDecoration={medievalFrame}
                    badgeDecoration={ASSETS.MEDIEVAL_BADGE}
                    playMusicName={DATA.medieval.date}
                    portalGroupRef={medievalPortalRef}
                >
                        <MedievalScene />
                </Portal>
                {outScene && 
                    <ArrowButton position={[2.5, -0.2, 0]} onClick={handleClickButton} />
                }
                {/* <ArrowButton cote={true} position={[-2.5, 0.2, 0]} onClick={handleReturnButton} /> */}
            </group>

            {/* Portail 2 - Modern */}
            <group ref={modernPortalRef}>
                <Portal
                    id={DATA.moderne.name}
                    onClick={() => { 
                        setCurrentScene(DATA.moderne.name)
                        playParcheminMusic1.stop()
                    }}
                    textureDecoration={modernFrame}
                    badgeDecoration={ASSETS.MODERN_BADGE}
                    playMusicName={DATA.moderne.date}
                    portalGroupRef={modernPortalRef}
                >
                        <VictorianScene />
                </Portal>
                {outScene && 
                    <ArrowButton position={[2.4, 0, 0]} onClick={handleClickButton} />
                }
                {/* <ArrowButton cote={true} position={[-2.4, 0, 0]} onClick={handleReturnButton} />s */}
            </group>

            {/* Portail 3 - 2nd guerre mondiale */}
            <group ref={warPortalRef}>
                <Portal
                    id={DATA.guerre.name}
                    onClick={() => { 
                        setCurrentScene(DATA.guerre.name)
                        playParcheminMusic2.stop()
                    }}
                    textureDecoration={warFrame}
                    badgeDecoration={ASSETS.WAR_BADGE}
                    playMusicName={DATA.guerre.date}
                    portalGroupRef={warPortalRef}
                >
                    <WarScene />
                </Portal>
                {outScene && 
                    <ArrowButton position={[2.3, 0, 0]} onClick={handleClickButton} /> 
                }
                {/* <ArrowButton cote={true} position={[-2.3, 0, 0]} onClick={handleReturnButton} /> */}
            </group>

            {/* Partie 4 - Conclusion */}
            <Outro />

        </ScrollableScene>
    </>
}
