import * as THREE from 'three'
import { useRef, useState } from 'react'
import { suspend } from 'suspend-react'
import { useFrame } from '@react-three/fiber'
import { MeshPortalMaterial, useCursor, Text } from '@react-three/drei'
import { useLocation, useRoute } from 'wouter'
import { easing } from 'maath'

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
    children
}) {
    const portalRef = useRef()
    const [hovered, setHovered] = useState(false)
    const [, setLocation] = useLocation()
    const [, params] = useRoute('/portal/:id')

    // changement de curseur en hover
    useCursor(hovered)

    useFrame((state, delta) => {
        // animation d'ouverture du portail au click
        if (portalRef.current) {
            easing.damp(portalRef.current, 'blend', params?.id === id ? 1 : 0, 0.2, delta)
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
                onClick={(e) => {
                    e.stopPropagation()
                    setLocation('/portal/' + id)
                }}
            >
                <planeGeometry args={[width, height]} />
                <MeshPortalMaterial ref={portalRef} events={params?.id === id} side={THREE.DoubleSide}>
                    <color attach="background" args={[bg]} />
                    {children}
                </MeshPortalMaterial>
            </mesh>
        </group>
    )
}
