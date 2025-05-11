import * as THREE from 'three'
import { useRef, useState } from 'react'
import { suspend } from 'suspend-react'
import { useFrame } from '@react-three/fiber'
import { MeshPortalMaterial, useCursor, Text } from '@react-three/drei'
import { easing } from 'maath'
import useSceneStore from '../stores/useSceneStore'
import { SETTINGS } from '../constants'

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
    children,
    onClick,
    debug = false,
}) {
    const { currentScene } = useSceneStore() // store
    const portalRef = useRef()
    const [hovered, setHovered] = useState(false)

    // changement de curseur en hover
    useCursor(hovered)

    // TODO : composant generique 
    useFrame((state, delta) => {
        // animation d'ouverture du portail au click
        if (portalRef.current) {
            easing.damp(portalRef.current, 'blend', currentScene === id ? 1 : 0, 0.2, delta)
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
        </group>
    )
}
