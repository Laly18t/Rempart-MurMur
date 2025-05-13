import { Text } from "@react-three/drei"
import ConclusionAnimation from "../animations/ConclusionAnimation"
import useAppStore from "../../stores/useAppStore"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import ArrowButton from "../ArrowButton"
import { useState, useEffect } from "react"

export default function Conclusion({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)
    const nextStep = useAppStore((state) => state.nextStep)

    const [textureIndex, setTextureIndex] = useState(0) // 0: clean, 1: dammage, 2: final
    const [showCTA, setShowCTA] = useState(false)

    const textures = useLoader(TextureLoader, [
        './castle_clean.PNG',
        './castle_dammage.PNG',
        './castle_renovation.PNG'
    ])

    const handleMeshClick = () => {
        // Toggle entre 0 et 1 uniquement
        setTextureIndex(prev => prev === 0 ? 1 : 0)
    }

    const handleCTAClick = () => {
        setTextureIndex(2)
    }

    const handleReturnButton = () => {
        setStep(step - 1)
    }

    // Timer 35s une fois que ce composant est monté
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCTA(true)
        }, 35000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <group {...props}>
            {debug && (
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[28, 18]} />
                    <meshBasicMaterial color={"limegreen"} />
                </mesh>
            )}

            {/* Mesh interactif */}
            <mesh position={[0, 0.4, 0]} onClick={handleMeshClick}>
                <planeGeometry args={[5.5, 2.4]} />
                <meshBasicMaterial
                    map={textures[textureIndex]}
                    transparent={true}
                />
            </mesh>

            {/* Titre principal */}
            <Text
                position={[0, -1, 0]}
                color={'red'}
                fontSize={0.2}
                anchorY="center"
                anchorX="center"
                lineHeight={0.8}
            >
                Le château traverse les âges
            </Text>

            {/* CTA de fin visible après 35s */}
            {showCTA && (
                <Text
                    position={[0, -1.5, 0]}
                    color={'orange'}
                    fontSize={0.3}
                    anchorY="center"
                    anchorX="center"
                    lineHeight={0.8}
                    onClick={handleCTAClick}
                    style={{ cursor: 'pointer' }}
                >
                    CTA de fin
                </Text>
            )}

            {/* {step > 1 && <ConclusionAnimation />} */}
            {/* Navigation */}
            <ArrowButton position={[-2, -1.15, 0]} scale={[-1, 1, 1]} onClick={handleReturnButton} />
        </group>
    )
}