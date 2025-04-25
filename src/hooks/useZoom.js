import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { INTERACTION } from '../constants'

const useZoom = (targetIn, targetOut) => {
    const { camera } = useThree()
    const targetPosition = useRef(null)
    const isZoomed = useRef(false)
    const speed = INTERACTION.ZOOM_SPEED

    // Toggle entre les deux positions
    const toggleZoom = useCallback(() => {
        isZoomed.current = !isZoomed.current
        targetPosition.current = isZoomed.current ? targetIn : targetOut
    }, [targetIn, targetOut])

    // Smooth camera mouvement
    useFrame(() => {
        if (targetPosition.current) {
            camera.position.lerp(targetPosition.current, speed)
        }
    })

    return toggleZoom
}

export default useZoom