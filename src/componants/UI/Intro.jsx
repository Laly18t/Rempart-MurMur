import { Html, Text, useVideoTexture } from "@react-three/drei"
import { useLoader, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { TextureLoader } from "three"

import ArrowButton from "../ArrowButton"
import useAppStore from "../../stores/useAppStore"
import useVoiceOverStore from "../../stores/useVoiceOverStore"
import usePlaySound from "../../hooks/usePlaySound"
import videoSrc from '/animations/intro_v2.webm'

export default function Intro({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)
    const voiceOver = useVoiceOverStore()
    const videoRef = useRef(null)
    const { viewport } = useThree()

    const handleClickButton = () => {
        nextStep()
    }

    const videoTexture = useVideoTexture(
        videoSrc,
        {
            muted: false,
            loop: false,
            start: step === 3
        }
    )

    const playSound = usePlaySound(`/audio/sounds/parchemin_v1_1.wav`)

    // play de la musique de fond
    useEffect(() => {
        if (step === 3) {
            // playSound.play()
            console.log('play', step)
        } else {
            playSound.stop()
        }
    }, [step])

    return <>
        {/* bouton pour le son - TODO: refonte graphique */}
        <group visible={step > 2} {...props}>
            {debug && <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 18]} />
                <meshBasicMaterial color={"limegreen"} />
            </mesh>}

            {step === 3 && (
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[viewport.width + 1.6, viewport.height + 1]} />
                    <meshBasicMaterial map={videoTexture} />
                </mesh>
            )}

            {!voiceOver.isPlaying && <ArrowButton position={[2.2, -1, 0]} onClick={handleClickButton} />}
        </group>

    </>
}