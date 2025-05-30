import { Html, Text, useVideoTexture } from "@react-three/drei"
import { useLoader, useThree } from "@react-three/fiber"
import { TextureLoader } from "three"

import ArrowButton from "../ArrowButton"
import useAppStore from "../../stores/useAppStore"
import IntroAnimation from "../animations/IntroAnimation"
import useVoiceOverStore from "../../stores/useVoiceOverStore"
import { useEffect, useRef } from "react"
import usePlaySound from "../../hooks/usePlaySound"
import videoSrc from '/ui/intro_v1.mp4'

export default function Intro({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)
    const voiceOver = useVoiceOverStore()
    const videoRef = useRef(null)
    const { viewport } = useThree()
    console.log(viewport)

    const handleClickButton = () => {
        nextStep()
    }

    const videoTexture = useVideoTexture(
        videoSrc,
        {
            muted: false,
            loop: false,
            start: step === 2
        }
    )

    const texture = useLoader(TextureLoader, './castle_clean.PNG')
    const playSound = usePlaySound(`/audio/sounds/parchemin_v1_1.wav`)

    // play de la musique de fond
    useEffect(() => {
        if (step === 2) {
            // playSound.play()
            console.log('play', step)
        } else {
            playSound.stop()
        }
    }
        , [step])

    return <>
        {/* bouton pour le son - TODO: refonte graphique */}
        <group visible={step > 1} {...props}>
            {debug && <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 18]} />
                <meshBasicMaterial color={"limegreen"} />
            </mesh>}

            {step === 2 && (
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[viewport.width + 1.6, viewport.height + 1]} />
                    <meshBasicMaterial map={videoTexture} />
                </mesh>
            )}
            {/* <mesh position={[0, 0.1, 0]}> 
                <planeGeometry args={[6.3, 2.8]} />
                <meshBasicMaterial map={texture} transparent={true} />
            </mesh> */}
            {/* {step === 2 && (
            <Html position={[-2, 2, 0]} fullscreen>
                <video ref={videoRef} autoPlay preload="auto" playsInline className="fullscreen-video" >
                    <source
                        src={videoSrc}
                        type="video/mp4"
                    />
                    Votre navigateur ne supporte pas la balise vidéo.
                </video>
            </Html>
            )} */}

            {/* TODO: avoir la bonne animation */}
            {/* {step > 1 && <IntroAnimation />} */}

            {!voiceOver.isPlaying && <ArrowButton position={[2.2, -1, 0]} onClick={handleClickButton} />}
        </group>

    </>
}