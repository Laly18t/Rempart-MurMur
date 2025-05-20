import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshNormalMaterial, TextureLoader } from 'three'
import useSceneStore from '../../stores/useSceneStore'
import InfoBulle from '../../componants/InfoBulle'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
import { useLoader, useThree } from '@react-three/fiber'

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

    const texture = useLoader(TextureLoader, '/people_modern.PNG')

    //  const cameraFromGLB = useMemo(() => {
    //         return camerasOn.find(cam => cam.name.endsWith('_generale')) || camerasOn[0]
    //     }, [camerasOn])
    
    //     const set = useThree((state) => state.set)
    
    //     useEffect(() => {
    //         if (cameraFromGLB) {
    //             // Assigne la caméra comme caméra principale
    //             set({ camera: cameraFromGLB })
    //         }
    //     }, [cameraFromGLB, set])

    return <>
        <group position={[0,-2, -1]} rotation-y={ -3.14 } ref={groupRef} {...props} dispose={null}>
            <mesh position={[-2.7, 1.15, -1.7]} rotation-y={ -3 }> {/* TODO: temporaire */}
                <boxGeometry args={[1.4, 1.8, 0.00001]} /> 
                <meshBasicMaterial map={texture} transparent={true} />
                {/* <meshBasicMaterial color='red' /> */}
            </mesh>
            <primitive castShadow receiveShadow object={scene} />
            {/* <InfoBulle position={[.52, 1.5, -1.5]} onClick={handleClickInfoBulle} /> */}
        </group>
        </>
}

useGLTF.preload('/models/scene_1786.gltf')