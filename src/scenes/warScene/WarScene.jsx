import React, { useEffect, useRef } from 'react'
import { useGLTF, PerspectiveCamera, useAnimations } from '@react-three/drei'
import useSceneStore from '../../stores/useSceneStore'
import { DATA } from '../../constants'

export default function WarScene({...props}) {
    const group = useRef()
    const { nodes, materials, animations } = useGLTF('/models/scene_1942_v6.glb')
    const { actions } = useAnimations(animations, group)
    const setSceneInfo = useSceneStore((state) => (state.setSceneInfo))

    const handleClick = () => {
        const action = actions['animation_0']
        if (action) {
            console.log('Animation play')
            action.reset().play()
        }
    }

    // const cameras = {
    //     camera_trappe: group.current.getObjectByName('camera_trappe'),
    //     camera_radio: group.current.getObjectByName('camera_radio'),
    //     camera_generale: group.current.getObjectByName('camera_generale'),
    // }

    useEffect(() => {
        if (group.current) {
            const cameras = [
                group.current.getObjectByName('camera_radio'),
                group.current.getObjectByName('camera_trappe'),
                group.current.getObjectByName('camera_generale'),
            ]
            setSceneInfo(DATA.guerre.name, { group: group.current, cameras })
        }
    }, [group])

    return (
        <group position={[-1,-2, -5]} rotation-y={ -3.14 } ref={group} {...props} dispose={null}>
            <group>
                <group name="Neutretest" />
                <group name="Neutre">
                    <mesh
                        name="draps_fauteuil"
                        castShadow
                        receiveShadow
                        geometry={nodes.draps_fauteuil.geometry}
                        material={materials.Mat}
                        position={[-2.576, 1.454, 0.424]}
                    />
                    <mesh
                        name="draps_table_test"
                        castShadow
                        receiveShadow
                        geometry={nodes.draps_table_test.geometry}
                        material={materials.Mat}
                        position={[2.106, 1.067, -1.643]}
                        rotation={[0, 1.146, 0]}
                    />
                    <mesh
                        name="table"
                        castShadow
                        receiveShadow
                        geometry={nodes.table.geometry}
                        material={materials.table}
                        position={[2.141, 0.45, -1.65]}
                    />
                    <mesh
                        name="radio"
                        castShadow
                        receiveShadow
                        geometry={nodes.radio.geometry}
                        material={nodes.radio.material}
                        position={[-1.05, 1.18, 2.263]}
                        rotation={[-Math.PI, 0.175, -Math.PI]}
                    />
                    <mesh
                        name="commode1"
                        castShadow
                        receiveShadow
                        geometry={nodes.commode1.geometry}
                        material={materials.commode}
                        position={[-1.446, 0.782, 2.158]}
                    />
                    <mesh
                        name="table_de_chevet"
                        castShadow
                        receiveShadow
                        geometry={nodes.table_de_chevet.geometry}
                        material={materials.table_chevet}
                        position={[-3.208, 0.2, -0.334]}
                        rotation={[0, -0.521, 0]}
                    />
                    <mesh
                        name="pendule1"
                        castShadow
                        receiveShadow
                        geometry={nodes.pendule1.geometry}
                        material={materials['Mat.1']}
                        position={[-3.6, 1.5, 2.514]}
                    />
                    <mesh
                        name="fauteuil1"
                        castShadow
                        receiveShadow
                        geometry={nodes.fauteuil1.geometry}
                        material={materials.fauteuil}
                        position={[-2.453, 0.443, -0.029]}
                    />
                    <mesh
                        name="bibliotheque_arriere1"
                        castShadow
                        receiveShadow
                        geometry={nodes.bibliotheque_arriere1.geometry}
                        material={materials.bibliotheque}
                        position={[4.562, 1.7, 1.25]}
                    />
                    <mesh
                        name="bibliotheque_avant1"
                        castShadow
                        receiveShadow
                        geometry={nodes.bibliotheque_avant1.geometry}
                        material={nodes.bibliotheque_avant1.material}
                        position={[4.562, 1.7, -0.8]}
                    />
                    <mesh
                        name="fenetres1"
                        castShadow
                        receiveShadow
                        geometry={nodes.fenetres1.geometry}
                        material={materials.fenetre}
                    />
                    <group
                        name="lampe1"
                        position={[-3.235, 1.149, -0.312]}
                        rotation={[Math.PI, -1.185, Math.PI]}>
                        <mesh
                            name="lampe1-lampe_chapeau"
                            castShadow
                            receiveShadow
                            geometry={nodes['lampe1-lampe_chapeau'].geometry}
                            material={materials.lampe_chapeau}
                        />
                        <mesh
                            name="lampe1-lampe"
                            castShadow
                            receiveShadow
                            geometry={nodes['lampe1-lampe'].geometry}
                            material={materials.lampe}
                        />
                    </group>
                    <mesh
                        name="tapis"
                        castShadow
                        receiveShadow
                        geometry={nodes.tapis.geometry}
                        material={materials.tapis}
                        morphTargetDictionary={nodes.tapis.morphTargetDictionary}
                        morphTargetInfluences={nodes.tapis.morphTargetInfluences}
                        position={[-2.195, 0.214, -0.202]}
                    />
                    <mesh
                        name="trappe_interieure"
                        castShadow
                        receiveShadow
                        geometry={nodes.trappe_interieure.geometry}
                        material={nodes.trappe_interieure.material}
                        position={[-1.266, -0.305, -1.114]}
                        onClick={handleClick}
                    />
                </group>
                <group name="Neutre1" />
                <group name="camera">
                    <PerspectiveCamera
                        name="camera_trappe"
                        makeDefault={false}
                        far={10000000000}
                        near={0.01}
                        fov={31.417}
                        position={[0.074, 2.436, -8.408]}
                        rotation={[3.113, 0.011, -3.141]}
                    />
                    <PerspectiveCamera
                        name="camera_radio"
                        makeDefault={false}
                        far={10000000000}
                        near={0.01}
                        fov={31.417}
                        position={[0.074, 2.436, -8.408]}
                        rotation={[-3.06, -0.003, -3.141]}
                    />
                    <PerspectiveCamera
                        name="camera_generale"
                        makeDefault={false}
                        far={10000000000}
                        near={0.01}
                        fov={31.417}
                        position={[0.074, 2.436, -8.408]}
                        rotation={[-3.06, -0.003, -3.141]}
                    />
                </group>
                <mesh
                    name="couvercle"
                    castShadow
                    receiveShadow
                    geometry={nodes.couvercle.geometry}
                    material={materials.sol}
                    position={[-1.77, 0.182, -1.114]}
                />
                <group name="Booléen">
                    <mesh
                        name="Polygone"
                        castShadow
                        receiveShadow
                        geometry={nodes.Polygone.geometry}
                        material={materials.tapis}
                    />
                </group>
                <mesh
                    name="Plan"
                    castShadow
                    receiveShadow
                    geometry={nodes.Plan.geometry}
                    material={materials.bibliotheque}
                    position={[1.635, 2.37, 5.315]}
                    rotation={[Math.PI / 2, 0, -Math.PI]}
                />
            </group>
        </group>
    )
}

useGLTF.preload('/models/scene_1942_v6.glb')