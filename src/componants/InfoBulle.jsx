import React, {useState, useRef, useMemo} from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader, Vector3 } from 'three'
import { Html, Text, Billboard } from '@react-three/drei'
import cn from 'mxcn'

import { POSITIONS_ZOOM } from '../constants'
import useZoom from '../hooks/useZoom'
import useSceneStore from '../stores/useSceneStore'

export default function InfoBulle({ position = [0, 0, 0], title = "Info", content = "Ceci est une info.", distanceFactor = 7, onClick = () => {}, className = '' }) {
    const [visible, setVisible] = useState(false)
    const pointRef = useRef()
    const popUpRef = useRef()

    const { camera } = useThree()

    const currentScene = useSceneStore((state) => state.currentScene)
    const textureButton = useLoader(TextureLoader, './ui/bulle_info.svg')

    const handleClick = () => {
        // toggleZoom()
        setVisible(prev => !prev)
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

            <Html className='popUp' style={{pointerEvents: 'none', }} center transform distanceFactor={distanceFactor} >
                <div className='popUpTitre'>
                <img onClick={handleClick} src="./ui/bulle_info.svg" alt="info" style={{ width: '10px', height: '10px', cursor: 'pointer', pointerEvents: 'auto', }} />
                <p style={{ color: 'white', }}>Découvrir</p>
                </div>

                {/* Popup texte */}
                {visible === true && (<div className='popUpContainer'>
                    <img src='./ui/cadre_ornement.svg' className='cadreOrnement' alt='cadre ornement' />
                    <div ref={popUpRef} className={cn('popUpInfo', className)}>
                        <div>
                        <h2>{title}</h2>
                        <p>{content}</p>
                        </div>
                    </div>
                </div>)}
            </Html>                            
        </Billboard>
    )}
    </>
}
