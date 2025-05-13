import * as THREE from 'three'
import { useRef, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { MeshPortalMaterial, useCursor, Text } from '@react-three/drei'
import { easing } from 'maath'
import useSceneStore from '../stores/useSceneStore'
import { SETTINGS } from '../constants'
import useAppStore from '../stores/useAppStore'
import { TextureLoader } from 'three'

// font chargee dynamiquement
const bold = import('@pmndrs/assets/fonts/inter_bold.woff')

export default function Portal({
    id,
    position,
    rotation = [0, 0, 0],
    width = SETTINGS.PORTAL_SIZE.WIDTH,
    height = SETTINGS.PORTAL_SIZE.HEIGHT,
    bg = "#eab676",
    textureDecoration,
    badgeDecoration,
    children,
    onClick,
    debug = false,
}) {
    const { currentScene, outScene } = useSceneStore() // store
    const { step } = useAppStore() // store
    const portalRef = useRef()
    const badgeRef = useRef()
    const [hovered, setHovered] = useState(false)

    const texture = useLoader(TextureLoader, `.${badgeDecoration}`)

    // changement de curseur en hover
    useCursor(hovered)

    // TODO : composant generique 
    useFrame((state, delta) => {
        // animation d'ouverture du portail au click
        if (portalRef.current) {
            easing.damp(portalRef.current, 'blend', currentScene === id ? 1 : 0, 0.2, delta)
        }

        // effet pop du badge
        if (badgeRef.current && outScene) {
            // TODO: gérer la persistance du badge si il a été aff
            const targetOpacity = outScene === id ? 1 : 0 
            easing.damp(badgeRef.current, 'opacity', targetOpacity, 0.7, delta)
        }
    })

    const portalSize = {
        width: 2.245,
        height: 1.56,
    }

    return (
        <group position={position} rotation={rotation}>
            {/* decoration autour du portail */}
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[6, 3.375]} />
                <meshBasicMaterial
                    map={textureDecoration}
                    transparent
                />
            </mesh>

            {debug && (
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[width, height]} />
                    <meshBasicMaterial color={"tomato"} />
                </mesh>
            )}

            {/* portail cliquable */}
            <mesh
                name={id}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onClick}
            >
                <planeGeometry args={[portalSize.width, portalSize.height]} />
                <MeshPortalMaterial ref={portalRef} events={currentScene === id} side={THREE.DoubleSide}>
                    <color attach="background" args={[bg]} />
                    {children}
                </MeshPortalMaterial>
            </mesh>

            {/* badge decoratif */}
                <mesh position={[1, -0.8, 0.2]}> {/* TODO: temporaire */}
                    <planeGeometry args={[1.3, 1.3]} /> 
                    <meshBasicMaterial ref={badgeRef} map={texture} opacity={0} transparent={true} />
                </mesh>
        </group>
    )
}
