import { useFrame } from "@react-three/fiber"
import { POSITIONS_ZOOM } from "../constants"
import { Vector3, Euler } from 'three'
import { useEffect, useRef } from "react"
import useSceneStore from "../stores/useSceneStore"

// gestion de la camera
const useCameraControl = (scrollRef, camera) => {
    const { currentScene } = useSceneStore()

    const mouse = useRef({ x: 0, y: 0 })
    const targetRotation = useRef(new Euler())

    // traking de la souris
    useEffect(() => {
        const handleMouseMove = (event) => {
            // normaliser entre -1 et 1
            const x = (event.clientX / window.innerWidth) * 2 - 1
            const y = -(event.clientY / window.innerHeight) * 2 + 1
            mouse.current = { x, y }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    useFrame(() => {
        // deplacement de la camera en zoom sur la scene
        if (currentScene && POSITIONS_ZOOM[currentScene]) {
            camera.position.lerp(new Vector3(...POSITIONS_ZOOM[currentScene]), 0.05)
            camera.lookAt(-3, 0, 0)

            // rotation de la camera
            const maxTilt = 0.1 // limite la rotation (en radians)
            const targetX = mouse.current.y * maxTilt
            const targetY = mouse.current.x * maxTilt

            // interpolation douce
            targetRotation.current.x += (targetX - targetRotation.current.x) * 0.05
            targetRotation.current.y += (targetY - targetRotation.current.y) * 0.05

            camera.rotation.x = targetRotation.current.x
            camera.rotation.y = targetRotation.current.y
        } else { // position de la camera qui suit le scroll sur le parchemin
            camera.position.set(scrollRef.current, 0, 10)
            camera.lookAt(scrollRef.current, 0, 0)

            // reset des rotations
            camera.rotation.x = 0
            camera.rotation.y = 0
        }
    })
}

export default useCameraControl