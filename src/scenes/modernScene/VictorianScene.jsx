import React, { useRef, useEffect, useMemo, forwardRef } from 'react'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import { MeshNormalMaterial, TextureLoader } from 'three'
import { useLoader, useThree } from '@react-three/fiber'

import useSceneStore from '../../stores/useSceneStore'
import InfoBulle from '../../componants/InfoBulle'
import useVoiceOverStore from '../../stores/useVoiceOverStore'

function VictorianScene({ ...props }, ref) {
    const { scene } = useGLTF('/models/scene_1786.gltf') // load model
    const groupRef = ref ?? useRef()
    const voiceOver = useVoiceOverStore()
    const { currentScene } = useSceneStore()
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


    // temporaire
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new MeshNormalMaterial()
                child.castShadow = true
                child.receiveShadow = true
            }

            if (child.name === 'Caméra_face') { //Caméra_face
                console.log('Camera trouvée:', child)
                groupRef.current.mainCamera = child
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
        <group position={[0, -2, -1]} rotation-y={-3.14} ref={groupRef} {...props} dispose={null}>
            <mesh position={[-2.7, 1.15, -1.7]} rotation-y={-3}> {/* TODO: temporaire */}
                <boxGeometry args={[1.4, 1.8, 0.00001]} />
                <meshBasicMaterial map={texture} transparent={true} />
                {/* <meshBasicMaterial color='red' /> */}
            </mesh>
            <primitive castShadow receiveShadow object={scene} />
            <ambientLight intensity={0.6} />
            <spotLight position={[0, 5, 5]} intensity={0.8} />
            {currentScene === 'monde-moderne' &&
                <>
                    <InfoBulle position={[3.8, 3, 1.6]}
                        className='modernBulle'
                        title="A l'abris de tous"
                        content="Les résistants cachaient souvent des documents compromettants dans des meubles du quotidien. Une commode pouvait ainsi dissimuler des tracts, des faux papiers ou des messages codés, à l'abri des regards lors des perquisitions."
                    />
                    <InfoBulle position={[-1.5, 0.5, 1.6]}
                        className='modernBulle'
                        title="De la lumière ?"
                        content="Les résistants cachaient souvent des documents compromettants dans des meubles du quotidien. Une commode pouvait ainsi dissimuler des tracts, des faux papiers ou des messages codés, à l'abri des regards lors des perquisitions."
                    />
                </>
            }
        </group>
    </>
}

export default forwardRef(VictorianScene)

useGLTF.preload('/models/scene_1786.gltf')