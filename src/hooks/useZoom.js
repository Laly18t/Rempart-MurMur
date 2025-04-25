import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

const useZoom = (targetIn, targetOut, speed = 0.05) => {
    const { camera } = useThree()
    const targetPosition = useRef(null)
    const isZoomed = useRef(false)

    // Toggle entre les deux positions
    const toggleZoom = useCallback(() => {
        isZoomed.current = !isZoomed.current
        targetPosition.current = isZoomed.current ? targetIn : targetOut
    }, [targetIn, targetOut])

    // Smooth camera movement
    useFrame(() => {
        if (targetPosition.current) {
            camera.position.lerp(targetPosition.current, speed)
        }
    })

    return toggleZoom
}

export default useZoom