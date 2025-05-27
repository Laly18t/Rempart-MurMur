import React, {useState, useRef, useMemo} from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader, Vector3 } from 'three'
import { Html, Text, Billboard } from '@react-three/drei'

import { POSITIONS_ZOOM } from '../constants'
import useZoom from '../hooks/useZoom'
import useSceneStore from '../stores/useSceneStore'

export default function InfoBulle({ position = [0, 0, 0], title = "Info", content = "Ceci est une info.", distanceFactor = 7, onClick = () => {} }) {
    const [visible, setVisible] = useState(false)
    const pointRef = useRef()
    const popUpRef = useRef()

    const { camera } = useThree()

    const currentScene = useSceneStore((state) => state.currentScene)
    const textureButton = useLoader(TextureLoader, './ui/bulle_info.svg')

    // // zoom
    // const CAMERA_TARGET_IN = new Vector3(900, 0, 1)
    // const CAMERA_TARGET_OUT = new Vector3(...POSITIONS_ZOOM[currentScene])
    // const toggleZoom = useZoom(CAMERA_TARGET_IN, CAMERA_TARGET_OUT) // hook de zoom

    const handleClick = () => {
        // toggleZoom()
        setVisible(prev => !prev)
        console.log('click')
        onClick()
    }


    const positionWithCameraOffset = useMemo(() => {
        const cameraPosOffset = new Vector3(...position);
        cameraPosOffset.x = cameraPosOffset.x - camera.position.x
        return cameraPosOffset;
    }, [position, camera.position])


    return <>
        {currentScene !== null && (
        <Billboard position={positionWithCameraOffset} follow={true} lockX={false} lockY={false} lockZ={false}>

            {/* Point cliquable */}
            {/* <mesh rotation-y={2.5}>
                <sphereGeometry args={[0.2, 5, 5]} />
                <meshBasicMaterial
                    map={textureButton}
                    />
            </mesh> */}
            <Html className='popUp' style={{pointerEvents: 'none', }} center transform distanceFactor={distanceFactor} >
                <div className='popUpTitre'>
                <img onClick={handleClick} src="./ui/bulle_info.svg" alt="info" style={{ width: '10px', height: '10px', cursor: 'pointer', pointerEvents: 'auto', }} />
                <p style={{ color: 'white', }}>Découvrir</p>
                </div>

                {/* Popup texte */}
                {visible === true && (
                    <group ref={popUpRef} className='popUpInfo'>
                        <div>
                        <h2>{title}</h2>
                        <p>{content}</p>
                        </div>
                    </group>
                )}
            </Html>
        </Billboard>
    )}
    </>
}
