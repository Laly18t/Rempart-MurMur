import * as THREE from 'three'
import { useRef, useState } from 'react'
import { suspend } from 'suspend-react'
import { useFrame } from '@react-three/fiber'
import { MeshPortalMaterial, useCursor, Text } from '@react-three/drei'
import { easing } from 'maath'
import useSceneStore from '../hooks/useSceneStore'

// font chargee dynamiquement
const bold = import('@pmndrs/assets/fonts/inter_bold.woff')

export default function Portal({
    id,
    name,
    position,
    rotation = [0, 0, 0],
    width = 10,
    height = 8,
    bg = "#eab676",
    textureDecoration,
    children,
    onClick
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

    return (
        <group position={position} rotation={rotation}>
            {/* decoration autour du portail */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 18]} />
                <meshBasicMaterial
                    map={textureDecoration}
                    transparent
                />
            </mesh>

            {/* nom du portail */}
            <Text
                font={suspend(bold).default}
                fontSize={1.2}
                position={[0, 4, 0]}
                color="white"
                anchorX="center"
                anchorY="top"
            >
                {name}
            </Text>

            {/* portail cliquable */}
            <mesh
                name={id}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onClick}
            >
                <planeGeometry args={[width, height]} />
                <MeshPortalMaterial ref={portalRef} events={currentScene === id} side={THREE.DoubleSide}>
                    <color attach="background" args={[bg]} />
                    {children}
                </MeshPortalMaterial>
            </mesh>
        </group>
    )
}
