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
import Conclusion from './componants/UI/Conclusion'
import ScrollableScene from './componants/ScrollableScene'
import {useEasedCamera} from './hooks/useEasedCamera'
import ParcheminBackground from './componants/ParcheminBackground'

// scene centrale
export default function Scene() {
    const { currentScene, setCurrentScene } = useSceneStore()
    const groupRef = useRef()
    const { camera } = useThree()
    const [canEnterPortal, setCanEnterPortal] = useState(true) // bloquer l'entree dans un portail

    // load des textures + cadres
    const warFrame = useLoader(TextureLoader, ASSETS.WAR_FRAME)
    const medievalFrame = useLoader(TextureLoader, ASSETS.MEDIEVAL_FRAME)

    // hooks
    // const scrollRef = useRef(0)
    const scrollRef = useScrollControl()  // gestion du scroll
    // useActivePortal() // gestion du portail actif
    // useCameraControl(scrollRef, camera) // gestion de la camera
    useEasedCamera(scrollRef, camera) // gestion de la camera

    return <>
        {/* activation voix-off */}
        <VoiceOver
            onAudioEnd={(index) => {
                console.log("Audio terminé:", index)
                // TODO: enable portal
            }}
        />

        <ParcheminBackground />

        <ScrollableScene>

                <Intro />
                 {/* Portail 1 - Medieval */}
                <Portal
                    id={DATA.medieval.name}
                    name={DATA.medieval.date}
                    // position={CONSTANTS.POSITIONS_PARCHEMIN[DATA.medieval.name]}
                    onClick={() => {
                        if (canEnterPortal)
                            setCurrentScene(DATA.medieval.name)
                    }}
                    textureDecoration={medievalFrame}
                >
                    <Suspense>
                        <MedievalScene />
                    </Suspense>
                </Portal>

                {/* Portail 2 - Victorien */}
                <Portal
                    id={DATA.moderne.name}
                    name={DATA.moderne.date}
                    // position={CONSTANTS.POSITIONS_PARCHEMIN[DATA.moderne.name]}
                    onClick={() => {
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
                    // position={CONSTANTS.POSITIONS_PARCHEMIN[DATA.guerre.name]}
                    onClick={() => {
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
                <Conclusion />

        </ScrollableScene>


        

        
    </>
}