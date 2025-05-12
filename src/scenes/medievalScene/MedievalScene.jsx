import React, { useState, useEffect } from 'react'
import { useGLTF, PerspectiveCamera } from '@react-three/drei'
import { Select } from "@react-three/postprocessing"
// import { debounce } from "lodash"

import Lustre from './Lustre' // composant

export default function MedievalScene(props) {
    const { scene } = useGLTF('/models/scene_1317_v1_textures_allume.glb') // load model
    const { nodes, materials, cameras } = useGLTF('/models/scene_1317_v1_textures_allume.glb')
    // const groupRef = useRef()

    // gestion du outline
    const [hovered, setHovered] = useState(null)

    return (
        <group position={[0, -2, 0]} rotation-y={-3.1} {...props} dispose={null}>
            <primitive castShadow receiveShadow object={scene} />
            {/* <Select
                enabled={hovered === 'lustre'}
                onPointerOver={() => setHovered('lustre')}
                onPointerOut={() => setHovered(null)}
            >
                <Lustre />
                <Poison position={[0,1.5,-2]} />
                <ambientLight intensity={0.2} />
            </Select> */}
        </group>

    )


    return <>
        
        <group position={[0, -2, 0]} rotation-y={-3.1}>

        <Select
            enabled={hovered === 'lustre'}
            onPointerOver={() => setHovered('lustre')}
            onPointerOut={() => setHovered(null)}
        >
            <Lustre />
        </Select>
        
        <ambientLight intensity={0.2} />
            <group name="SETUP">
                <group name="arriere_plan" position={[-0.243, 1.627, 7.156]}>
                    <mesh
                        name="paysage"
                        castShadow
                        receiveShadow
                        geometry={nodes.paysage.geometry}
                        material={materials.environnement}
                        position={[0.243, -0.097, 0.177]}
                    />
                </group>
                <mesh
                    name="ecran_fumee"
                    castShadow
                    receiveShadow
                    geometry={nodes.ecran_fumee.geometry}
                    material={nodes.ecran_fumee.material}
                    position={[-0.186, 1.822, 2.221]}
                />
                <PerspectiveCamera
                    name="camera_basique"
                    makeDefault={false}
                    far={10000000000}
                    near={0.01}
                    fov={31.417}
                    position={[-1.057, 1.725, -6.313]}
                    rotation={[-3.102, -0.291, -3.13]}
                />
                <group name="camera_test_avec_zoom_lustre">
                    <PerspectiveCamera
                        name="camera_test_lustre"
                        makeDefault={false}
                        far={10000000000}
                        near={0.01}
                        fov={31.417}
                        position={[-1.08, 1.785, -6.504]}
                        rotation={[-3.093, -0.002, 3.139]}
                    />
                </group>
                <group name="camera_test_avec_zoom_fiole" position={[1.908, 1.732, 0.484]}>
                    <PerspectiveCamera
                        name="camera_test_fiole"
                        makeDefault={false}
                        far={10000000000}
                        near={0.01}
                        fov={31.417}
                        position={[-4.457, -0.032, -6.277]}
                        rotation={[-3.014, -0.457, -3.085]}
                    />
                </group>
            </group>
            <group name="SALLE_DETRUITE_V1" position={[-1.078, 1.204, 0.99]}>
                {/* <mesh
                    name="projectils"
                    castShadow
                    receiveShadow
                    geometry={nodes.projectils.geometry}
                    material={materials['Sandstonewall 002 Warm 300cm Disp 6.0cm']}
                    position={[2.414, -0.25, -0.99]}
                /> */}
                {/* <mesh
                    name="salle_1317_detruit"
                    castShadow
                    receiveShadow
                    geometry={nodes.salle_1317_detruit.geometry}
                    material={materials['Sandstonewall 002 Warm 300cm Disp 6.0cm']}
                    position={[1.078, 0.996, -1.239]}
                /> */}
            </group>
            <mesh
                name="EXPORT_SALLE_V1"
                castShadow
                receiveShadow
                geometry={nodes.EXPORT_SALLE_V1.geometry}
                material={materials.allume_salle}
            />
            <mesh
                name="EXPORT_OBJET_V1"
                castShadow
                receiveShadow
                geometry={nodes.EXPORT_OBJET_V1.geometry}
                material={materials.alume_objets}
                position={[3.092, 2.47, 1.938]}
            />
        </group>
    </>
}

useGLTF.preload('/models/scene_1317_v1_textures_allume.glb')