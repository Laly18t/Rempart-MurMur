import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRoute } from 'wouter'

// commposants
import Portal from './Composants/Portal'
import MedievalScene from './Models/MedievalScene'
import WarScene from './Models/WarScene'
import VictorianScene from './Models/VictorianScene'


const positions = {
    'monde-medieval': [35, 0, 3],
    'monde-victorien': [65, 0, 3],
    'monde-guerre': [95, 0, 3],
}

const positionsParchemin = {
    'monde-medieval': [35, 0, 0],
    'monde-victorien': [65, 0, 0],
    'monde-guerre': [95, 0, 0],
}

export default function Scene({ onEnterPortal, setSceneA, setSceneB }) {
    const groupRef = useRef()
    const { camera, gl, scene } = useThree()
    const [, params] = useRoute('/portal/:id')
    const [activePortalId, setActivePortalId] = useState(null)

    // load des textures + cadres
    const texture = useTextureLoader('/texture_parchemin.png')
    const warFrame = useLoader(THREE.TextureLoader, '/cadre_1942.png')

    // gestion du portail actif
    useEffect(() => {
        setActivePortalId(params?.id ?? null)
    }, [params])

    // gestion du scroll
    const scrollRef = useScrollControl(activePortalId)

    // gestion du clavier (pour sortir d'un portail)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && activePortalId) onEnterPortal('/')
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [activePortalId, onEnterPortal])


    // gestion des transitions
    useSceneTransition(gl, camera, scene, setSceneA, setSceneB)


    // gestion de la camera
    useCameraControl(activePortalId, scrollRef, camera)

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
                position={positionsParchemin['monde-medieval']}
                onClick={() => onEnterPortal('monde-medieval')}
                textureDecoration={warFrame}
            >
                <Suspense>
                    <MedievalScene />
                </Suspense>
            </Portal>

            {/* Portail 2 - Victorien */}
            <Portal
                id="monde-victorien"
                name="1834"
                position={positionsParchemin['monde-victorien']}
                onClick={() => 
                    onEnterPortal('monde-victorien')
                }
                textureDecoration={warFrame}
            >
                <Suspense>
                    <VictorianScene />
                </Suspense>
            </Portal>

            {/* Portail 3 - 2nd guerre mondiale */}
            <Portal
                id="monde-guerre"
                name="1940"
                position={positionsParchemin['monde-guerre']}
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

// chargement de la texture du parchemin
const useTextureLoader = (path) => {
    const texture = useLoader(THREE.TextureLoader, path)
    useEffect(() => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(10, 1)
    }, [texture])
    return texture
}

// gestion du scroll horizontal
const useScrollControl = (activePortalId) => {
    const scrollRef = useRef(0)
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
    return scrollRef
}

// gestion des transitions de portails
const useSceneTransition = (gl, camera, scene, setSceneA, setSceneB) => {
    useEffect(() => {
        if (typeof setSceneA === 'function') setSceneA({ fbo: gl.getRenderTarget(), scene, camera })
        if (typeof setSceneB === 'function') setSceneB({ fbo: gl.getRenderTarget(), scene, camera })
    }, [gl, camera, scene, setSceneA, setSceneB])
}

// gestion de la camera
const useCameraControl = (activePortalId, scrollRef, camera) => {
    useFrame(() => {
        if (activePortalId && positions[activePortalId]) {
            camera.position.set(...positions[activePortalId])
        } else {
            camera.position.set(scrollRef.current, 0, 10)
            camera.lookAt(scrollRef.current, 0, 0)
        }
    })
}