import * as THREE from 'three'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useRoute } from 'wouter'

// commposants
import Portal from './Composants/Portal'
import MedievalScene from './Models/MedievalScene'   // 1317
import VictorianScene from './Models/VictorianScene' // 1749
import WarScene from './Models/WarScene'             // 1940
import { VoiceOver } from './Composants/VoiceOver'


// A REFAIRE pour simplifier
const positions = {
    'monde-medieval': [35, 0, 4],
    'monde-victorien': [65, 0, 4],
    'monde-guerre': [95, 0, 4],
}
const positionsParchemin = {
    'monde-medieval': [35, 0, 0],
    'monde-victorien': [65, 0, 0],
    'monde-guerre': [95, 0, 0],
}

// scene centrale
export default function Scene({ onEnterPortal, setSceneA, setSceneB }) {
    const groupRef = useRef()
    const { camera, gl, scene } = useThree()
    const [, params] = useRoute('/portal/:id')
    const [activePortalId, setActivePortalId] = useState(null)
    const [canEnterPortal, setCanEnterPortal] = useState(false) // bloquer l'entree dans un portail

    // voix-off
    const [voiceStep, setVoiceStep] = useState('intro')

    // load des textures + cadres
    const texture = useTextureLoader('/texture_parchemin.png')
    const warFrame = useLoader(THREE.TextureLoader, '/cadre_1942.png')

    // gestion du portail actif
    useEffect(() => {
        setActivePortalId(params?.id ?? null)

        // lancer la bonne voix-off
        if (params?.id) {
            setVoiceStep(params.id)
        }
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

    return <>
        {/* activation voix-off */}
        <VoiceOver
            voiceStep={voiceStep}
            onComplete={(step) => {
                if (step === 'intro') {
                    setCanEnterPortal(true)
                }
            }}
            onSegmentChange={(index) => {
                console.log(`Segment ${index} joué pour ${voiceStep}`)
            }}
        />

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
                onClick={() => {
                    if (canEnterPortal) onEnterPortal('monde-medieval')
                }}
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
                onClick={() =>{
                    if (canEnterPortal) onEnterPortal('monde-victorien')
                }}
                textureDecoration={warFrame}
            >
                <Suspense>
                    <VictorianScene />
                    <ambientLight intensity={0.6} />
                    <spotLight position={[0, 5, 5]} intensity={0.8} />
                </Suspense>
            </Portal>

            {/* Portail 3 - 2nd guerre mondiale */}
            <Portal
                id="monde-guerre"
                name="1940"
                position={positionsParchemin['monde-guerre']}
                onClick={() =>{
                    if (canEnterPortal) onEnterPortal('monde-guerre')
                }}
                textureDecoration={warFrame}
            >
                <Suspense>
                    <WarScene />
                    <ambientLight intensity={0.6} />
                    <spotLight position={[0, 5, 5]} intensity={0.8} />
                </Suspense>
            </Portal>
        </group>
    </>
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
            camera.position.lerp(new THREE.Vector3(...positions[activePortalId]), 0.05)
        } else {
            camera.position.set(scrollRef.current, 0, 10)
            camera.lookAt(scrollRef.current, 0, 0)
        }
    })
}