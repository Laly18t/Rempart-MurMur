import { Text, useVideoTexture  } from "@react-three/drei"
import { useLoader, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef, useMemo } from "react"
import { TextureLoader, VideoTexture } from "three"

import useAppStore from "../../stores/useAppStore"
import ArrowButton from "../ArrowButton"

export default function Conclusion({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)
    const { viewport } = useThree()

    const [showCTA, setShowCTA] = useState(false)
    const [hovered, setHovered] = useState(false)
    const textureButton = useLoader(TextureLoader, './ui/icons/cta_background_defaut.png')

    const gifTexture = usePreloadedVideoTexture('/animations/benevole.webm')

    const videoTexture = useVideoTexture(
        '/animations/intro.webm',
        {
            muted: false,
            loop: false,
            start: step === 7
        }
    )

    const handleReturnButton = () => {
        setStep(step - 1)
    }

    // Timer 35s une fois que ce composant est montré
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCTA(true)
        }, 45000) // 35000

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (hovered) {
            console.log("Hover -->")
        }
    }, [hovered])

    return (
        <group {...props}>

            {/* Mesh interactif */}
            {step === 7 && (
                <mesh position={[0, 0, -1]}>
                    <planeGeometry args={[viewport.width + 1.6, viewport.height + 1]} />
                    <meshBasicMaterial transparent={true} map={videoTexture} />
                </mesh>
            )}

            {/* CTA de fin visible après 35s */}
            {showCTA && (<>
                <mesh
                    position={[0, -1.35, 0]}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                    scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
                >
                    <planeGeometry args={[1.5, 0.5]} />
                    <meshBasicMaterial map={textureButton} transparent={true} />
                    <Text
                        font="/fonts/IMFellEnglish-Regular.woff"
                        position={[0, 0.12, 0.01]}
                        color={'#F8EEE5'}
                        fontSize={0.3}
                        anchorY="center"
                        anchorX="center"
                        lineHeight={0.8}
                        style={{ cursor: 'pointer', textTransform: 'uppercase', }}
                    >
                        Participer
                    </Text>
                </mesh>
                <mesh position={[0, 0, -0.9]}>
                    <planeGeometry args={[viewport.width + 1.6, viewport.height + 1]} />
                    <meshBasicMaterial map={gifTexture} transparent={true} />
                </mesh>
            </>)}

            {/* Navigation */}
            <ArrowButton position={[-2, -1.15, 0]} scale={[-1, 1, 1]} onClick={handleReturnButton} />
        </group>
    )
}



export function usePreloadedVideoTexture(src, { loop = true, muted = true, autoplay = true } = {}) {
    const videoRef = useRef()

    const texture = useMemo(() => {
        const video = document.createElement('video')
        video.src = src
        video.crossOrigin = 'anonymous'
        video.loop = loop
        video.muted = muted
        video.autoplay = autoplay
        video.playsInline = true
        video.preload = 'auto'
        video.load() // 🔁 lance le préchargement
        videoRef.current = video
        return new VideoTexture(video)
    }, [src])

    return texture
}