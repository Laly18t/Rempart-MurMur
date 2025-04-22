import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRoute } from 'wouter'

// commposants
import Portal from './Composants/Portal'
import MedievalScene from './Models/MedievalScene'
import WarScene from './Models/WarScene'
import VictorianScene from './Models/VictorianScene'


export default function Scene({ onEnterPortal, setSceneA, setSceneB }) {
    const groupRef = useRef()
    const scrollRef = useRef(0)
    const { camera, gl, scene } = useThree()
    const [, params] = useRoute('/portal/:id')
    const [activePortalId, setActivePortalId] = useState(null)
    const [enableOrbitControls, setEnableOrbitControls] = useState(false)

    // load
    const texture = useLoader(THREE.TextureLoader, '/texture_parchemin.png')
    const warFrame = useLoader(THREE.TextureLoader, '/cadre_1942.png')

    // gestion du parchemin en fond
    useEffect(() => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 1)
    }, [texture])

    // gestion du portail actif
    useEffect(() => {
        if (params?.id) {
            setActivePortalId(params.id)
            setEnableOrbitControls(true)
        } else {
            setActivePortalId(null)
            setEnableOrbitControls(false)
        }
    }, [params])

    // gestion du scroll horizontal
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

    // gestion du clavier (pour sortir d'un portail)
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

    // gestion des transitions
    useEffect(() => {
        // Préparer les scènes A et B pour la transition
        if (typeof setSceneA === 'function') setSceneA({ fbo: gl.getRenderTarget(), scene, camera })
        if (typeof setSceneB === 'function') setSceneB({ fbo: gl.getRenderTarget(), scene, camera })
    }, [gl, camera, scene, setSceneA, setSceneB])

    // gestion de la camera pour la transition
    useFrame(() => {
        if (!enableOrbitControls) {
            if (activePortalId) {
                const portalMesh = groupRef.current.getObjectByName(activePortalId)
                if (portalMesh) {
                    camera.position.set(0, 0, 0)
                }
            } 
            else {
                //console.log('else -->', activePortalId)
                camera.position.set(scrollRef.current, 0, 10)
                camera.lookAt(scrollRef.current, 0, 0)
            }
        } 
    })

    return (
        <group ref={groupRef}>
            {/* Parchemin */}
            <mesh position={[0, 0, -3]}>
                <planeGeometry args={[370, 20]} />
                <meshBasicMaterial map={texture} />
            </mesh>

            {/* Portail 1 - Medieval */}
            <Portal
                id="monde-medieval"
                name="1317"
                position={[35, 0, 0]}
                onClick={() => onEnterPortal('monde-medieval')}
                textureDecoration={warFrame}
            >
                <Suspense><MedievalScene /></Suspense>
            </Portal>

            {/* Portail 2 - Victorien */}
            <Portal
                id="monde-victorien"
                name="1834"
                position={[65, 0, 0]}
                onClick={() => onEnterPortal('monde-victorien')}
                textureDecoration={warFrame}
            >
                <Suspense><VictorianScene /></Suspense>
            </Portal>

            {/* Portail 3 - 2nd guerre mondiale */}
            <Portal
                id="monde-guerre"
                name="1940"
                position={[95, 0, -1]}
                onClick={() => onEnterPortal('/portal/monde-guerre')}
                textureDecoration={warFrame}
            >
                <Suspense>
                    <WarScene />
                </Suspense>
            </Portal>
        </group>
    )
}
