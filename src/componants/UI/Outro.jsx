import { Text, useVideoTexture } from "@react-three/drei"
import { useLoader, useThree } from "@react-three/fiber"
import { useState, useEffect } from "react"

import useAppStore from "../../stores/useAppStore"
import ArrowButton from "../ArrowButton"
import videoSrc from '/animations/intro.webm'
import { TextureLoader } from "three"

export default function Conclusion({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)
    const { viewport } = useThree()
    
    const [showCTA, setShowCTA] = useState(false)
    const [hovered, setHovered] = useState(false)
    const textureButton = useLoader(TextureLoader, './ui/icons/cta_background_defaut.png')

    const videoTexture = useVideoTexture(
            videoSrc,
            {
                muted: true,
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
        }, 55000) // 35000

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

            {/* Titre principal */}
            <Text
                position={[0, 1.5, 0.1]}
                color={'red'}
                fontSize={0.4}
                anchorY="center"
                anchorX="center"
                lineHeight={0.8}
            >
                2025
            </Text>

            {/* CTA de fin visible après 35s */}
            {showCTA && (
                <mesh 
                    position={[0, -1.3, 0]}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                    scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
                >
                    <planeGeometry args={[2, 0.5]} />
                    <meshBasicMaterial map={textureButton} transparent={true} />
                    <Text
                        position={[0, 0.15, 0.01]}
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
            )}

            {/* Navigation */}
            <ArrowButton position={[-2, -1.15, 0]} scale={[-1, 1, 1]} onClick={handleReturnButton} />
        </group>
    )
}