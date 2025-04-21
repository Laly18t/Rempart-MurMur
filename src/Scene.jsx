import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useRoute } from 'wouter'
import { OrbitControls } from '@react-three/drei'

import Portal from './Composants/Portal'
import MedievalScene from './Models/MedievalScene'
import WarScene from './Models/WarScene'
import VictorianScene from './Models/VictorianScene'


export default function Scene({ onEnterPortal, setSceneA, setSceneB }) {
    const groupRef = useRef()
    const scrollRef = useRef(0)
    const orbitControlsRef = useRef()
    const { camera, size, gl, scene } = useThree()
    const [activePortalId, setActivePortalId] = useState(null)
    const [, params] = useRoute('/portal/:id')
    const [enableOrbitControls, setEnableOrbitControls] = useState(false)

    const texture = useLoader(THREE.TextureLoader, '/texture_parchemin.png')
    const warFrame = useLoader(THREE.TextureLoader, '/cadre_1942.png')

    useEffect(() => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 1)
    }, [texture])

    useEffect(() => {
        if (params?.id) {
            setActivePortalId(params.id)
            setEnableOrbitControls(true)
        } else {
            setActivePortalId(null)
            setEnableOrbitControls(false)
        }
    }, [params])

    useEffect(() => {
        const handleScroll = (event) => {
            if (!activePortalId) {
                scrollRef.current -= event.deltaY * 0.05
                scrollRef.current = Math.max(0, Math.min(scrollRef.current, 120))
            }
        }
        window.addEventListener('wheel', handleScroll)
        return () => window.removeEventListener('wheel', handleScroll)
    }, [activePortalId])

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (activePortalId && event.key === 'Escape') {
                setActivePortalId(null)
                setEnableOrbitControls(false)
                onEnterPortal('/') // Go back using transition
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [activePortalId])

    useEffect(() => {
        // Préparer les scènes A et B pour la transition
        if (typeof setSceneA === 'function') setSceneA({ fbo: gl.getRenderTarget(), scene, camera })
        if (typeof setSceneB === 'function') setSceneB({ fbo: gl.getRenderTarget(), scene, camera })
    }, [gl, camera, scene, setSceneA, setSceneB])

    useFrame(() => {
        // if (!enableOrbitControls) {
        //     if (activePortalId) {
        //         const portalMesh = groupRef.current.getObjectByName(activePortalId)
        //         if (portalMesh) {
        //             const worldPosition = new THREE.Vector3()
        //             //portalMesh.getWorldPosition(worldPosition)
        //             //camera.position.set(-25, -25, 5)
        //             //camera.lookAt(worldPosition)
        //             camera.rotateY.set(-3)
        //             camera.position.set(0, 0, 0)
        //         }
        //     } else {
        //         //console.log('else -->', activePortalId)
        //         camera.position.set(scrollRef.current, 0, 10)
        //         camera.lookAt(scrollRef.current, 0, 0)
        //     }
        // } else {
            if (activePortalId) {
                camera.position.set(scrollRef.current, 0, 10)
                camera.lookAt(scrollRef.current, 0, 0)
            }
        // }
    })

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.8} />

            {/* Parchemin */}
            <mesh position={[0, 0, -3]}>
                <planeGeometry args={[370, 20]} />
                <meshBasicMaterial map={texture} />
            </mesh>

            {/* <OrbitControls 
                ref={orbitControlsRef}
                enabled={enableOrbitControls}
                enablePan={enableOrbitControls}
                enableZoom={enableOrbitControls}
                enableRotate={enableOrbitControls}
                makeDefault
            /> */}

            {/* Portail 1 - Medieval */}
            <Portal
                id="monde-medieval"
                name="1317"
                position={[35, 0, 0]}
                bg="#1a1a3e"
                onClick={() => onEnterPortal('monde-medieval')}
                textureDecoration={warFrame}
            >
                <ambientLight intensity={0.5} />
                <spotLight position={[0, 5, 5]} intensity={1} />
                <Suspense><MedievalScene position={[0,-2,0]} /></Suspense>
            </Portal>

            {/* Portail 2 - Victorien */}
            <Portal
                id="monde-victorien"
                name="1834"
                position={[65, 0, 0]}
                bg="#1a1a3e"
                onClick={() => onEnterPortal('monde-victorien')}
                textureDecoration={warFrame}
            >
                <ambientLight intensity={0.5} />
                <spotLight position={[0, 5, 5]} intensity={1} />
                <Suspense><VictorianScene position={[0,0,0]} /></Suspense>
            </Portal>

            {/* Portail 3 - 2nd guerre mondiale */}
            <Portal
                id="monde-guerre"
                name="1940"
                position={[95, 0, -1]}
                bg="#1a1a2e"
                makeDefault
                onClick={() => onEnterPortal('/portal/monde-guerre')}
                textureDecoration={warFrame}
            >
                <ambientLight intensity={0.8} />
                <spotLight position={[0, 5, 5]} intensity={1} />
                <Suspense><WarScene position={[0,0,0]} /></Suspense>
            </Portal>
        </group>
    )
}
