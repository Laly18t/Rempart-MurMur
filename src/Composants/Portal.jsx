import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshPortalMaterial, useCursor, Text } from '@react-three/drei'
import * as THREE from 'three'
import { suspend } from 'suspend-react'
import { useLocation, useRoute } from 'wouter'
import { easing } from 'maath'

// Font chargée dynamiquement
const bold = import('@pmndrs/assets/fonts/inter_bold.woff')

export default function Portal({
    id,
    name,
    position,
    rotation = [0, 0, 0],
    width = 11,
    height = 10,
    bg = "#e4cdac",
    textureDecoration,
    onClick,
    children
}) {
    const portalRef = useRef()
    const [hovered, setHovered] = useState(false)
    const [, setLocation] = useLocation()
    const [, params] = useRoute('/portal/:id')

    useCursor(hovered)

    useFrame((state, delta) => {
        // animation d'ouverture du portail au click
        if (portalRef.current) {
            easing.damp(portalRef.current, 'blend', params?.id === id ? 1 : 0, 0.2, delta)

            // animation de rotation légère au hover
            // if (hovered && portalRef.current.parent) {
            //     portalRef.current.parent.rotation.y += 0.005
            // }
        }
    })

    return (
        <group position={position} rotation={rotation}>
            {/* Décoration autour du portail */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 20]} />
                <meshBasicMaterial
                    map={textureDecoration}
                    transparent
                    alphaTest={0.1}
                />
            </mesh>

            {/* Nom du portail */}
            <Text
                font={suspend(bold).default}
                fontSize={1.2}
                position={[0, 5, 0]}
                color="white"
                anchorX="center"
                anchorY="top"
            >
                {name}
            </Text>

            {/* Portail cliquable */}
            <mesh
                name={id}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={(e) => {
                    e.stopPropagation()
                    setLocation('/portal/' + id)
                    //onClick()
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
