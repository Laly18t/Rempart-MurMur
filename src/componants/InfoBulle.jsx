import React, { useState, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { Text } from '@react-three/drei'

import { POSITIONS_ZOOM } from '../constants'
import useZoom from '../hooks/useZoom'
import useSceneStore from '../stores/useSceneStore'

export default function InfoBulle({ position = [0, 0, 0], title = "Info", content = "Ceci est une info.", onClick = () => {} }) {
    const [visible, setVisible] = useState(false)
    const pointRef = useRef()
    const popUpRef = useRef()

    const currentScene = useSceneStore((state) => state.currentScene)

    // // zoom
    // const CAMERA_TARGET_IN = new Vector3(900, 0, 1)
    // const CAMERA_TARGET_OUT = new Vector3(...POSITIONS_ZOOM[currentScene])
    // const toggleZoom = useZoom(CAMERA_TARGET_IN, CAMERA_TARGET_OUT) // hook de zoom

    const handleClick = () => {
        // toggleZoom()
        setVisible(prev => !prev)
        onClick()
    }

    // billboard effect
    useFrame(({ camera }) => {
        if (pointRef.current) {
            pointRef.current.lookAt(camera.position)
        }
    })

    return (
        <group position={position} ref={pointRef} onClick={handleClick}>

            {/* Point cliquable */}
            <mesh >
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
