import * as THREE from 'three'
import { useThree, useFrame } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import { easing } from 'maath'
import { CameraControls } from '@react-three/drei'
import useSceneStore from '../stores/useSceneStore'
import { SETTINGS } from '../constants'
import useAppStore from '../stores/useAppStore'

export default function Rig({ modelsInfo = {} }) {
    const { controls, scene } = useThree()

    const currentScene = useSceneStore((state) => state.currentScene)
    const getCurrentSceneInfo = useSceneStore((state) => state.getCurrentSceneInfo)
    const getCurrentScene = useSceneStore.getState

    const maxWidth = useAppStore((state) => state.maxWidth)
    const step = useAppStore((state) => state.step)
    const totalItems = useAppStore((state) => state.totalItems)

    const scrollTarget = useRef(new THREE.Vector3(0, 0, SETTINGS.DEFAULT_ZOOM))
    const scrollFocus = useRef(new THREE.Vector3(0, 0, -SETTINGS.DEFAULT_ZOOM))

    // Gestion du focus sur une scène (portail cliqué)
    useEffect(() => {
        console.log('step', step)
        // if (!currentScene || currentScene === 'intro') return

        const modelInfo = getCurrentSceneInfo()
        console.log('toto', getCurrentScene().currentScene)
        // const active = scene.getObjectByName(currentScene)
        
        if (currentScene ==! 'intro') {
            if (modelInfo?.cameras?.length > 0) {
                const modelCamera = modelInfo.cameras[2] ?? modelInfo.cameras[0]
                modelCamera.updateMatrixWorld(true)

                const worldPosition = new THREE.Vector3()
                const worldQuaternion = new THREE.Quaternion()
                const worldScale = new THREE.Vector3()

                modelCamera.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale)
                const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(worldQuaternion)
                const lookAt = worldPosition.clone().add(direction.multiplyScalar(10))

                controls?.setLookAt(
                    worldPosition.x, worldPosition.y, worldPosition.z,
                    lookAt.x, lookAt.y, lookAt.z,
                    true
                )
            } else {
                const pos = new THREE.Vector3(0, 0.5, 0.25)
                const foc = new THREE.Vector3(0, 0, -2)
                active.parent.localToWorld(pos)
                active.parent.localToWorld(foc)
                controls?.setLookAt(...pos.toArray(), ...foc.toArray(), true)
            }
        }
    }, [currentScene, controls, scene, step])

    // Effet 2 : Scroll horizontal (quand pas dans une scène)
    useEffect(() => {
        if (step > 1 && (!currentScene || currentScene === 'intro')) {
            const scrollLength = maxWidth / totalItems
            const targetX = scrollLength * (step - 2)

            scrollTarget.current.set(targetX, 0, SETTINGS.DEFAULT_ZOOM)
            scrollFocus.current.set(targetX, 0, -SETTINGS.DEFAULT_ZOOM)
        }
    }, [step, currentScene, maxWidth, totalItems])

    // useFrame pour une animation fluide vers la position cible
    useFrame((_, dt) => {
        if (step > 1 && (!currentScene || currentScene === 'intro')) {
            const currentPos = controls.getPosition(new THREE.Vector3())
            const currentTarget = controls.getTarget(new THREE.Vector3())

            easing.damp3(currentPos, scrollTarget.current, 0.1, dt)
            easing.damp3(currentTarget, scrollFocus.current, 0.1, dt)

            controls.setLookAt(
                currentPos.x, currentPos.y, currentPos.z,
                currentTarget.x, currentTarget.y, currentTarget.z,
                false
            )
        }
    })

    return (
        <CameraControls
            makeDefault
            mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
        />
    )
}