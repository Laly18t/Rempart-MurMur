import * as THREE from 'three'
import {cloneElement, useEffect, useRef, useState} from 'react'
import {useFrame, useLoader, useThree} from '@react-three/fiber'
import {MeshPortalMaterial, useCursor, Text, Html} from '@react-three/drei'
import { easing } from 'maath'
import useSceneStore from '../stores/useSceneStore'
import { SETTINGS } from '../constants'
import useAppStore from '../stores/useAppStore'
import { TextureLoader } from 'three'
import usePlaySound from '../hooks/usePlaySound'
import useVoiceOverStore from '../stores/useVoiceOverStore'
import gsap from 'gsap'

// font chargee dynamiquement
const bold = import('@pmndrs/assets/fonts/inter_bold.woff')

export default function Portal({
    id,
    position,
    rotation = [0, 0, 0],
    width = SETTINGS.PORTAL_SIZE.WIDTH,
    height = SETTINGS.PORTAL_SIZE.HEIGHT,
    bg = "#eab676",
    textureDecoration,
    badgeDecoration,
    children,
    onClick,
    debug = false,
    playMusicName,
    onEnter = () => {},
    onExit = () => {},
    portalGroupRef // ✨ Nouvelle prop
}) {
    const { currentScene, outScene } = useSceneStore() // store
    const { step } = useAppStore() // store
    const portalRef = useRef()
    const badgeRef = useRef()
    const [hovered, setHovered] = useState(false)
    const [prevCurrentScene, setPrevCurrentScene] = useState(null)
    const [prevOutScene, setPrevOutScene] = useState(null)

    const [originalCameraPosition, setOriginalCameraPosition] = useState(null)

    const texture = useLoader(TextureLoader, `.${badgeDecoration}`)
    const playPortalEnterSound = usePlaySound('/audio/sounds/portal_enter.wav')
    const playPortalExitSound = usePlaySound('/audio/sounds/portal_exit.wav')

    const playMusic = usePlaySound(`/audio/sounds/${playMusicName}.wav`)

    const { controls } = useThree()

    const innerRef = useRef()

    // changement de curseur en hover
    useCursor(hovered)

    // TODO : composant generique 
    useFrame((state, delta) => {
        // animation d'ouverture du portail au click
        if (portalRef.current) {
            // console.log('portalRef.current', currentScene)
            // easing.damp(portalRef.current, 'blend', currentScene === id ? 1 : 0, SETTINGS.PORTAL_ENTER_DURATION, delta)
            // playPortalSound()
        }

        // effet pop du badge
        if (badgeRef.current && outScene) {
            // TODO: gérer la persistance du badge si il a été aff
            const targetOpacity = outScene === id ? 1 : 0 
            easing.damp(badgeRef.current, 'opacity', targetOpacity, 0.7, delta)
        }
    })

    const { mute } = useVoiceOverStore() // store

    // gestion du sound design au click
    useEffect(() => {   
        if (currentScene === id) {
            playPortalEnterSound.play()
            playMusic.play()
        }
        if (outScene) {
            playMusic.stop()
            playPortalExitSound.play()
        }
    }, [outScene, currentScene, playMusicName])

    // Detection of portal entry
    useEffect(() => {
        // If we just entered this portal
        if (currentScene === id && prevCurrentScene !== id) {

            if (controls) {
                controls.enabled = false;
            }

            setOriginalCameraPosition(controls?.camera.clone())

            const tl = gsap.timeline()
            tl.to(portalRef.current, { blend: 1, duration: SETTINGS.PORTAL_ENTER_DURATION, })

            if (innerRef.current.mainCamera && console) {
                tl.to(controls?.camera, {
                    fov: innerRef.current.mainCamera.fov,
                    duration: 0.5,
                    onUpdate: () => controls?.camera.updateProjectionMatrix(),
                    ease: "power2.inOut"
                }, 0)

                const portalGroup = portalGroupRef?.current;

                if (portalGroup) {
                    portalGroup.updateMatrixWorld(true);
                }
                innerRef.current.mainCamera.updateMatrixWorld(true);

                // CONVERSION DES COORDONNÉES LOCALES EN COORDONNÉES MONDIALES

                // Pour la position - utiliser getWorldPosition
                const worldPosition = new THREE.Vector3()
                innerRef.current.mainCamera.getWorldPosition(worldPosition)

                // Pour la rotation - utiliser getWorldQuaternion puis convertir en Euler
                const worldQuaternion = new THREE.Quaternion()
                const worldRotation = new THREE.Euler()
                innerRef.current.mainCamera.getWorldQuaternion(worldQuaternion)
                worldRotation.setFromQuaternion(worldQuaternion)
               // If the innerRef has a mainCamera, set it as the active camera
                tl.to(controls.camera.position, {
                    x: portalGroup?.position.x + worldPosition.x ,
                    y: portalGroup?.position.y + worldPosition.y,
                    z: portalGroup?.position.z + worldPosition.z,
                    duration: 1,
                    ease: "power2.inOut",
                }, 0.5)

                tl.to(controls.camera.rotation, {
                    x: worldRotation.x,
                    y: worldRotation.y,
                    z: worldRotation.z,
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Réactiver les contrôles à la fin
                        if (controls) {
                            //controls.enabled = true;
                            //controls.update();
                        }
                    }
                }, 0.5)
            }
            // tl.to(innerRef.current.position, { x: 3, duration: SETTINGS.PORTAL_ENTER_DURATION})
            // console.log('Entered portal:', id, portalRef.current.blend)
            onEnter();
        }

        // Update previous state
        setPrevCurrentScene(currentScene);
    }, [currentScene, id, onEnter, prevCurrentScene])

    // Detection of portal exit
    useEffect(() => {
        // If we just exited this portal
        if (outScene === id && prevOutScene !== id) {
            const tl = gsap.timeline()
            const portalGroup = portalGroupRef?.current;
            const worldRotation = originalCameraPosition.rotation
            const worldPosition = originalCameraPosition.position
            tl.to(controls.camera.position, {
                x: portalGroup?.position.x,
                y: worldPosition.y,
                z: worldPosition.z,
                duration: 2,
                ease: "power2.inOut",
            }, 0)

            tl.to(controls.camera.rotation, {
                x: worldRotation.x,
                y: worldRotation.y,
                z: worldRotation.z,
                duration: 2,
                ease: "power2.inOut",
                onComplete: () => {
                    // Réactiver les contrôles à la fin
                    if (controls) {
                        controls.enabled = true;
                        controls.update();
                    }
                }
            }, 0)
            // tl.to(innerRef.current.position, { x: 0, duration: SETTINGS.PORTAL_ENTER_DURATION})
            tl.to(controls?.camera, { fov: originalCameraPosition.fov, duration: 1, ease: "power2.inOut", delay: 0.5, onUpdate: () => controls?.camera.updateProjectionMatrix(), }, )
            tl.to(portalRef.current, { blend: 0, duration: SETTINGS.PORTAL_ENTER_DURATION }, )
            onExit();
        }

        // Update previous state
        setPrevOutScene(outScene);
    }, [outScene, id, onExit, prevOutScene])

    const portalSize = {
        width: 2.245,
        height: 1.56,
    }

    return (
        <group position={position} rotation={rotation}>
            {/* decoration autour du portail */}
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[6, 3.375]} />
                <meshBasicMaterial
                    map={textureDecoration}
                    transparent
                />
            </mesh>

            {debug && (
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[width, height]} />
                    <meshBasicMaterial color={"tomato"} />
                </mesh>
            )}

            {/* portail cliquable */}
            <mesh
                name={id}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={onClick
                }
            >
                <planeGeometry args={[portalSize.width, portalSize.height]} />
                <MeshPortalMaterial ref={portalRef} events={currentScene === id} side={THREE.DoubleSide}>
                    <color attach="background" args={[bg]} />
                    {cloneElement(children, { ref: innerRef })}
                </MeshPortalMaterial>
            </mesh>



            {/* badge decoratif */}
                <mesh position={[1, -0.8, 0.2]}> {/* TODO: temporaire */}
                    <planeGeometry args={[1.3, 1.3]} /> 
                    <meshBasicMaterial ref={badgeRef} map={texture} opacity={0} transparent={true} />
                </mesh>
        </group>
    )
}
