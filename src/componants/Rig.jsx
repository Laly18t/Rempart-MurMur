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

    const maxWidth = useAppStore((state) => state.maxWidth)
    const step = useAppStore((state) => state.step)
    const totalItems = useAppStore((state) => state.totalItems)

    const scrollTarget = useRef(new THREE.Vector3(0, 0, SETTINGS.DEFAULT_ZOOM))
    const scrollFocus = useRef(new THREE.Vector3(0, 0, -SETTINGS.DEFAULT_ZOOM))

    // Effet 2 : Scroll horizontal (quand pas dans une scène)
    useEffect(() => {
        if (step > 2 && (!currentScene || currentScene === 'intro')) {
            const scrollLength = maxWidth / totalItems
            const targetX = scrollLength * (step - 3)

            scrollTarget.current.set(targetX, 0, SETTINGS.DEFAULT_ZOOM)
            scrollFocus.current.set(targetX, 0, -SETTINGS.DEFAULT_ZOOM)
        }
    }, [step, currentScene, maxWidth, totalItems])

    // useFrame pour une animation fluide vers la position cible
    useFrame((_, dt) => {
        if (!controls || !scene) return
        const currentPos = controls.getPosition(new THREE.Vector3())
        const currentTarget = controls.getTarget(new THREE.Vector3())

        easing.damp3(currentPos, scrollTarget.current, 0.1, dt)
        easing.damp3(currentTarget, scrollFocus.current, 0.1, dt)

        controls.setLookAt(
            currentPos.x, currentPos.y, currentPos.z,
            currentTarget.x, currentTarget.y, currentTarget.z,
            false
        )
    })

    return (
        <CameraControls
            makeDefault
            mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }}
        />
    )
}