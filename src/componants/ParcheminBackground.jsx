import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import useTextureLoader from "../hooks/useTextureLoader"
import { ASSETS } from '../constants'
import useAppStore from "../stores/useAppStore"

export default function ParcheminBackground({visible = true}) {
    const meshRef = useRef()
    const materialRef = useRef()
    // Utiliser useRef pour suivre l'opacité actuelle
    const opacityRef = useRef(visible ? 1 : 0)
    
    const textureParchemin = useTextureLoader(ASSETS.TEXTURE_PARCHEMIN)
    const maxWidth = useAppStore((state) => state.maxWidth)
    const offset = 100
    const width = maxWidth + offset * 2

    // Animamtion opacity
    useFrame(() => {
        if (!materialRef.current) return
        
        const fadeSpeed = 0.008 // Vitesse de transition
        const targetOpacity = visible ? 1 : 0
        
        // Si l'opacité actuelle n'est pas égale à la cible, l'animer progressivement
        if (opacityRef.current !== targetOpacity) {
            if (opacityRef.current < targetOpacity) {
                opacityRef.current = Math.min(opacityRef.current + fadeSpeed, targetOpacity)
            } else {
                opacityRef.current = Math.max(opacityRef.current - fadeSpeed, targetOpacity)
            }
            materialRef.current.opacity = opacityRef.current // liaison avec le matériau
        }
    })

    // Configuration initiale du matériau
    useEffect(() => {
        if (materialRef.current) {
            materialRef.current.transparent = true
            materialRef.current.opacity = visible ? 1 : 0
            opacityRef.current = visible ? 1 : 0
        }
    }, [])
    
    return (
        <group>
            {/* Parchemin */}
            <mesh ref={meshRef} position={[(width / 2) - offset, 0, -2]}>
                <planeGeometry args={[width, 20]} />
                <meshBasicMaterial 
                    ref={materialRef}
                    map={textureParchemin}
                    transparent={true}
                />
            </mesh>
        </group>
    )
}