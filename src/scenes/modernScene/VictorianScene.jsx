import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshNormalMaterial } from 'three'
import useSceneStore from '../../stores/useSceneStore'
import InfoBulle from '../../componants/InfoBulle'
import useVoiceOverStore from '../../stores/useVoiceOverStore'

export default function VictorianScene({...props}) {
    const { scene } = useGLTF('/models/scene_1786.gltf') // load model
    const groupRef = useRef()
    const voiceOver = useVoiceOverStore();
    // const { setSceneInfo } = useSceneStore((state) => ({
    //     setSceneInfo: state.setSceneInfo,
    // }))

    // useEffect(() => {
    //     if (group.current) {
    //         const cameras = {
    //             // camera_trappe: group.current.getObjectByName('camera_trappe'),
    //             // camera_radio: group.current.getObjectByName('camera_radio'),
    //             // camera_generale: group.current.getObjectByName('camera_generale'),
    //         }
    //         setSceneInfo(DATA.guerre.name, { group: null, cameras })
    //     }
    // }, [group, setSceneInfo])

    const handleClickInfoBulle = () => {
        voiceOver.setIndex(1);
    }

    // temporaire
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new MeshNormalMaterial()
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [scene])

    return <>
        <group position={[0,-2, -5]} rotation-y={ -3.14 } ref={groupRef} {...props} dispose={null}>
            <primitive castShadow receiveShadow object={scene} />
            <InfoBulle position={[.52, 1.5, -1.5]} onClick={handleClickInfoBulle} />
        </group>
        </>
}

useGLTF.preload('/models/scene_1786.gltf')