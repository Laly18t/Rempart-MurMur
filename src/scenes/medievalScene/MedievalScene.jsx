import React, { useState, useEffect, useMemo, useRef } from 'react'
import { TextureLoader } from 'three'
import { Select } from "@react-three/postprocessing"
import { useLoader, useThree } from '@react-three/fiber'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'

// composants
import Lustre from './Lustre' 
import InfoBulle from '../../componants/InfoBulle'
import useVoiceOverStore from '../../stores/useVoiceOverStore' // store

export default function MedievalScene({ ...props }) {
    const { scene: sceneOn, cameras: camerasOn } = useGLTF('/models/scene_1317_v3_eteint.glb')
    const { scene: sceneOff } = useGLTF('/models/scene_1317_v3_allume.glb')
    const [useModel, setUseModel] = useState(true)
    const groupRef = useRef()
    const voiceOver = useVoiceOverStore()
    const index = useVoiceOverStore()

    const people = useLoader(TextureLoader, '/people_medieval.PNG')

    // gestion du outline
    // const [hovered, setHovered] = useState(null)

    const handleClickInfoBulle = () => {
        // voiceOver.setIndex(2)
        console.log('clic')
    }

    const cameraFromGLB = useMemo(() => {
        return camerasOn.find(cam => cam.name.endsWith('_1')) || camerasOn[0]
    }, [camerasOn])

    const set = useThree((state) => state.set)
    const texture = useLoader(TextureLoader, '/people_medieval.PNG')

    useEffect(() => {
        if (cameraFromGLB) {
            // Assigne la caméra comme caméra principale
            set({ camera: cameraFromGLB })
        }
    }, [cameraFromGLB, set])

    return <>
     {/*
        // <group position={[0, -2, -1]} rotation-y={-3.1} {...props} dispose={null}>
        //     <primitive castShadow receiveShadow object={scene} />
        //     <Select
        //         enabled={hovered === 'lustre'}
        //         onPointerOver={() => setHovered('lustre')}
        //         onPointerOut={() => setHovered(null)}
        //     >
        //         <Lustre />
        //         <Poison position={[0,1.5,-2]} />
        //         <ambientLight intensity={0.2} />
        //     </Select>
        // </group> */}

        
        <ambientLight intensity={useModel ? 0.2 : 0.9} />

        <group
            position={[0, -2, -1]}
            rotation-y={-3.1}
            ref={groupRef}
            {...props}
            dispose={null}
            onClick={() => {
                setUseModel(prev => !prev)
                voiceOver.setIndex(1)
            }}
        >
            <mesh position={[0.2, 1.2, 0.2]} rotation-y={ -3.14 }> {/* TODO: temporaire */}
                <boxGeometry args={[0.9, 2, 0.00001]} /> 
                <meshBasicMaterial map={people} transparent={true}  />
                {/* <meshBasicMaterial color='red' /> */}
            </mesh>

            <primitive object={useModel ? sceneOn : sceneOff} />
            <InfoBulle position={[3, 2, 1.6]} onClick={handleClickInfoBulle}
                title='Les murs en disent long'
                content='À cette époque, les murs en pierre étaient recouverts de lourdes tentures pour bloquer le froid et couper les bruits. Mais attention, ce n’était pas juste pour l’isolation : chaque tapisserie était un symbole de richesse. Entre scènes religieuses, héraldiques ou épiques, elles montraient non seulement le bon goût du seigneur, mais aussi son pouvoir.'
            />
            <InfoBulle position={[-0.5, 1, 1.6]} onClick={handleClickInfoBulle}
                title='Ta chaise dit tout de toi'
                content='À cette époque, les murs en pierre étaient recouverts de lourdes tentures pour bloquer le froid et couper les bruits. Mais attention, ce n’était pas juste pour l’isolation : chaque tapisserie était un symbole de richesse. Entre scènes religieuses, héraldiques ou épiques, elles montraient non seulement le bon goût du seigneur, mais aussi son pouvoir.'
            />
        </group>

    </>
}

// useGLTF.preload('/models/scene_1317_v1_textures_allume.glb')
useGLTF.preload('/models/scene_1317_v3_allume.glb')
useGLTF.preload('/models/scene_1317_v3_eteint.glb')