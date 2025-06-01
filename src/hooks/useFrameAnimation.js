import { useState, useEffect, useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

// Hook pour animer des sprites frame par frame
function useFrameAnimation(texturePaths, frameDuration = 0.5, autoStart = true, loop = true) {
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(autoStart)
    const [startTime, setStartTime] = useState(Date.now())

    // Charger toutes les textures
    const textures = useLoader(TextureLoader, texturePaths)

    // S'assurer que textures est un tableau même avec une seule texture
    const textureArray = useMemo(() => {
        return Array.isArray(textures) ? textures : [textures]
    }, [textures])

    // Animation loop
    useEffect(() => {
        if (!isPlaying || textureArray.length <= 1) return

        const interval = setInterval(() => {
            setCurrentFrameIndex(prevIndex => {
                const nextIndex = prevIndex + 1
                
                if (nextIndex >= textureArray.length) {
                    if (loop) {
                        return 0 // Recommencer la boucle
                    } else {
                        setIsPlaying(false) // Arrêter l'animation
                        return prevIndex // Rester sur la dernière frame
                    }
                }
                
                return nextIndex
            })
        }, frameDuration * 1000)

        return () => clearInterval(interval)
    }, [isPlaying, textureArray.length, frameDuration, loop])

    // Fonctions de contrôle
    const startAnimation = () => {
        setIsPlaying(true)
        setStartTime(Date.now())
    }

    const stopAnimation = () => {
        setIsPlaying(false)
    }

    const resetAnimation = () => {
        setCurrentFrameIndex(0)
        setStartTime(Date.now())
    }

    const restartAnimation = () => {
        resetAnimation()
        startAnimation()
    }

    return {
        currentTexture: textureArray[currentFrameIndex],
        currentFrameIndex,
        startAnimation,
        stopAnimation,
        resetAnimation,
        restartAnimation,
        isPlaying,
        totalFrames: textureArray.length
    }
}

export default useFrameAnimation