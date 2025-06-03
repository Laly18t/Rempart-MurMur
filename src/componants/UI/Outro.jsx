import { Text, useCursor, useVideoTexture } from "@react-three/drei"
import { useLoader, useThree } from "@react-three/fiber"
import { useState, useEffect, useRef, useMemo } from "react"
import { TextureLoader, VideoTexture } from "three"

import useAppStore from "../../stores/useAppStore"
import ArrowButton from "../ArrowButton"
import { TEXTS } from "../../constants"

export default function Conclusion({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)
    const { viewport } = useThree()

    const [showCTA, setShowCTA] = useState(false)
    const [showPopup1, setShowPopup1] = useState(false)
    const [showPopup2, setShowPopup2] = useState(false)
    const [showPopup3, setShowPopup3] = useState(false)
    const [hovered, setHovered] = useState(false)
    const textureButton = useLoader(TextureLoader, './ui/icons/cta_background_defaut.png')
    const popUpTexture = useLoader(TextureLoader, './ui/cadre_horizontal.png')

    const gifTexture = useVideoTexture(
        '/animations/benevole.webm',
        {
            muted: true,
            loop: true,
            autoplay: true,
        }
    )

    const videoTexture = useVideoTexture(
        '/animations/outro_2.webm',
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
        if (step === 7) {
            const timer = setTimeout(() => {
                setShowCTA(true)
            }, 50000) // 35s
            const timer1 = setTimeout(() => {
                setShowPopup1(true)
            }, 35000) // 35s
            const timer2 = setTimeout(() => {
                setShowPopup2(true)
            }, 38000) // 35s
            const time3 = setTimeout(() => {
                setShowPopup3(true)
            }, 41000) // 35s

            return () => clearTimeout(timer)
        }
    }, [step])

    useEffect(() => {
        if (hovered) {
            console.log("Hover -->")
        }
    }, [hovered])

    return (
        <group {...props}>

            {/* Mesh interactif */}
            {step === 7 && (
                <mesh position={[0, 0, -1.1]}>
                    <planeGeometry args={[viewport.width + 1.6, viewport.height + 1]} />
                    <meshBasicMaterial transparent={true} map={videoTexture} />
                </mesh>
            )}

            {/* CTA de fin visible après 35s */}
            {showCTA && (<>
                <mesh
                    position={[0, -1.3, 0]}
                    onPointerEnter={() => {
                        setHovered(true)
                    }}
                    onPointerLeave={() => setHovered(false)}
                    onClick={() => {
                        window.open('https://www.rempart.com/fr/trouver-un-chantier', '_blank')
                    }}
                    scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
                    style={{ cursor: 'pointer' }}
                >
                    <planeGeometry args={[1.2, 0.3]} />
                    <meshBasicMaterial map={textureButton} transparent={true} />
                    <Text
                        font="/fonts/IMFellEnglish-Regular.woff"
                        position={[0, 0.05, 0.01]}
                        color={'#F8EEE5'}
                        fontSize={0.15}
                        anchorY="center"
                        anchorX="center"
                        lineHeight={0.8}
                        style={{ cursor: 'pointer', textTransform: 'uppercase', }}
                    >
                        Participer
                    </Text>
                </mesh>
            </>)}

            <mesh position={[2.5, 1.35, -1]} visible={showPopup1}>
                <planeGeometry args={[2, 1]} />
                <meshBasicMaterial transparent={true} map={popUpTexture} />
                <Text
                    font="/fonts/IMFellEnglish-Regular.woff"
                    position={[-0.65, 0.3, 0.01]}
                    color={'#000000'}
                    fontSize={0.1}
                    lineHeight={0.8}
                    style={{ cursor: 'pointer', textTransform: 'uppercase', }}
                >
                    {TEXTS.TEMOIGNAGE_1.NAME}
                </Text>
                <Text
                    font="/fonts/AlegreyaSans-Regular.woff"
                    position={[0, 0.1, 0.01]}
                    color={'#000000'}
                    fontSize={0.1}
                    anchorY="center"
                    anchorX="center"
                    lineHeight={1}
                    style={{ cursor: 'pointer', textTransform: 'uppercase', }}
                >
                    {TEXTS.TEMOIGNAGE_1.TEXT}
                </Text>
            </mesh>

            <mesh position={[2, 0.4, -1.01]} visible={showPopup2}>
                <planeGeometry args={[2, 1]} />
                <meshBasicMaterial transparent={true} map={popUpTexture} />
                <Text
                    font="/fonts/IMFellEnglish-Regular.woff"
                    position={[-0.65, 0.3, 0.01]}
                    color={'#000000'}
                    fontSize={0.1}
                    lineHeight={0.8}
                    style={{ cursor: 'pointer', textTransform: 'uppercase', }}
                >
                    {TEXTS.TEMOIGNAGE_2.NAME}
                </Text>
                <Text
                    font="/fonts/AlegreyaSans-Regular.woff"
                    position={[-0.15, 0.1, 0.01]}
                    color={'#000000'}
                    fontSize={0.1}
                    anchorY="center"
                    anchorX="center"
                    lineHeight={1}
                    style={{ cursor: 'pointer', textTransform: 'uppercase', }}
                >
                    {TEXTS.TEMOIGNAGE_2.TEXT}
                </Text>
            </mesh>

            <mesh position={[-2.7, -1.3, -1.01]} visible={showPopup3}>
                <planeGeometry args={[2, 1]} />
                <meshBasicMaterial transparent={true} map={popUpTexture} />
                <Text
                    font="/fonts/IMFellEnglish-Regular.woff"
                    position={[-0.7, 0.3, 0.01]}
                    color={'#000000'}
                    fontSize={0.1}
                    lineHeight={0.8}
                    style={{ cursor: 'pointer', textTransform: 'uppercase', }}
                >
                    {TEXTS.TEMOIGNAGE_3.NAME}
                </Text>
                <Text
                    font="/fonts/AlegreyaSans-Regular.woff"
                    position={[-0.05, 0.2, 0.01]}
                    color={'#000000'}
                    fontSize={0.1}
                    anchorY="center"
                    anchorX="center"
                    lineHeight={1}
                    style={{ cursor: 'pointer', textTransform: 'uppercase', }}
                >
                    {TEXTS.TEMOIGNAGE_3.TEXT}
                </Text>
            </mesh>

            {/* <mesh position={[0, 0, -0.9]}>
                    <planeGeometry args={[viewport.width + 1.6, viewport.height + 1]} />
                    <meshBasicMaterial map={gifTexture} transparent={true} />
                </mesh> */}


            {/* Navigation */}
            {/* <ArrowButton position={[-2, -1.15, 0]} scale={[-1, 1, 1]} onClick={handleReturnButton} /> */}
        </group>
    )
}
