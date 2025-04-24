import React, { useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { Text } from '@react-three/drei'

import { POSITIONS_ZOOM } from '../constants'

export default function InfoBulle({ position = [0, 0, 0], title = "Info", content = "Ceci est une info." }) {
    const [visible, setVisible] = useState(false)
    const pointRef = useRef()
    const popUpRef = useRef()
    const { camera } = useThree()
    const targetPosition = useRef(null)

    const CAMERA_TARGET_IN = new Vector3(95, 0, 1)
    const CAMERA_TARGET_OUT = new Vector3(...POSITIONS_ZOOM['monde-guerre'])

    // billboard effect + zoom camera
    useFrame(() => {
        // le point regarde toujours la camera
        if (pointRef.current) {
            pointRef.current.lookAt(camera.position)
        }

        // camera zoom
        if (targetPosition.current) {
            camera.position.lerp(targetPosition.current, 0.05)
        }
    })

    // position camera
    const handleClick = () => {
        setVisible(prev => {
            const newVisible = !prev
            targetPosition.current = newVisible ? CAMERA_TARGET_IN : CAMERA_TARGET_OUT
            return newVisible
        })
    }

    return (
        <group position={position} ref={pointRef}>

            {/* Point cliquable */}
            <mesh onClick={handleClick}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshBasicMaterial color="hotpink" />
            </mesh>

            {/* Popup texte */}
            {visible === true && (
                <group ref={popUpRef} >
                    {/* Fond */}
                    <mesh position={[0, -0.5, 0.5]}>
                        <boxGeometry args={[0.01, 1, 1]} />
                        <meshBasicMaterial color="grey" />
                        {/* Titre */}
                        <Text fontSize={0.3} rotation={[0, -Math.PI / 2, 0]} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.1, 0.3, -0.3]} material-toneMapped={false}>
                            {title}
                        </Text>
                        {/* Text */}
                        <Text fontSize={0.1} rotation={[0, -Math.PI / 2, 0]} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.1, 0, -0.3]} material-toneMapped={false}>
                            {content}
                        </Text>
                    </mesh>
                </group>
            )}
        </group>
    )
}
