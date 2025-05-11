import { useEffect, useRef, useState } from 'react'

import { SETTINGS } from '../constants'
import useSceneStore from '../stores/useSceneStore'
import useAppStore from "../stores/useAppStore"

// gestion du scroll horizontal
const useScrollControl = () => {
    const scrollRef = useRef(0)
    const { currentScene } = useSceneStore()
    const maxWidth = useAppStore((state) => state.maxWidth)
    const step = useAppStore((state) => state.step)
    
    useEffect(() => {
            const handleScroll = (event) => {
                // actif quand on est pas dans un portail
                if (currentScene === 'intro' || currentScene === 'outro') {
                    scrollRef.current += event.deltaY * SETTINGS.SCROLL_SPEED // sensibilité du scroll
                    scrollRef.current = Math.max(0, Math.min(scrollRef.current, maxWidth))
                }
            }


            if (step > 1){ // quand on a passé le loader et le bouton démarrer
                window.addEventListener('wheel', handleScroll) // on ecoute la molette
            }
            return () => window.removeEventListener('wheel', handleScroll) // cleanup
        }, [currentScene, maxWidth, step])

    
    return scrollRef
}

export default useScrollControl