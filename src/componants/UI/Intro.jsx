import { Text } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"

import ArrowButton from "../ArrowButton"
import useAppStore from "../../stores/useAppStore"
import IntroAnimation from "../animations/IntroAnimation"
import useVoiceOverStore from "../../stores/useVoiceOverStore"

export default function Intro({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)
    const voiceOver = useVoiceOverStore()
    const handleClickButton = () => {
        nextStep()
    }

    const texture = useLoader(TextureLoader, './intro_castle.png')

    return <>
        {/* bouton pour le son - TODO: refonte graphique */}
        <group visible={step > 1} {...props}>
            {debug && <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 18]} />
                <meshBasicMaterial color={"limegreen"} />
            </mesh>}
            <Text position={[0, -1, 0]} color={'red'} fontSize={0.3} anchorY="center" anchorX="center" lineHeight={0.8} >
                Introduction
            </Text>

            <mesh position={[0,0.4,0]}> {/* TODO: temporaire */}
                <planeGeometry args={[5.5, 2.4]} /> 
                <meshBasicMaterial map={texture} transparent={true} />
            </mesh>

            {/* TODO: avoir la bonne animation */}
            {/* {step > 1 && <IntroAnimation />} */}

            {!voiceOver.isPlaying && <ArrowButton position={[2, -1.15, 0]} onClick={handleClickButton} />}
        </group>

    </>
}