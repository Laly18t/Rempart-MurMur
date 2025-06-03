import { useVideoTexture } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"

import ArrowButton from "../ArrowButton"
import useAppStore from "../../stores/useAppStore"
import useVoiceOverStore from "../../stores/useVoiceOverStore"
import usePlaySound from "../../hooks/usePlaySound"
import videoSrc from '/animations/intro_2.webm'

export default function Intro({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)
    const voiceOver = useVoiceOverStore()
    const { viewport } = useThree()

    const handleClickButton = () => {
        nextStep()
    }

    const videoTexture = useVideoTexture(
        videoSrc,
        {
            muted: true,
            loop: false,
            start: step === 3
        }
    )

    return <>
        {/* bouton pour le son - TODO: refonte graphique */}
        <group visible={step > 2} {...props}>

            {step === 3 && (
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[viewport.width + 1.6, viewport.height + 1]} />
                    <meshBasicMaterial transparent={true} map={videoTexture} />
                </mesh>
            )}

            {!voiceOver.isPlaying && <ArrowButton position={[2.2, -1, 0]} onClick={handleClickButton} />}
        </group>

    </>
}