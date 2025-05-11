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
    const setStep = useAppStore((state) => state.setStep)
    
    useEffect(() => {
        const handleScroll = (event) => {
            // actif quand on est pas dans un portail
            if (currentScene === 'intro' || currentScene === 'outro') {
                scrollRef.current += event.deltaY * SETTINGS.SCROLL_SPEED // sensibilité du scroll
                scrollRef.current = Math.max(0, Math.min(scrollRef.current, maxWidth))
            }

            // observe le scroll pour set le bon index de la scène
            const scrollPosition = scrollRef.current
            const scrollLength = maxWidth / 4 // longueur de scroll pour chaque scene
            const index = Math.floor(scrollPosition / scrollLength) // on divise par la longueur de scroll pour avoir l'index de la scène
            // setStep(index + 2) // on set le step
        }


        if (step > 1){ // quand on a passé le loader et le bouton démarrer
            const totalLength = 4 ; 
            const scrollLength = maxWidth / totalLength ; // longueur de scroll pour chaque scene
            scrollRef.current = scrollLength * (step - 2) // on limite le scroll à la longueur de la scène
            
            window.addEventListener('wheel', handleScroll) // on ecoute la molette
        }
        return () => window.removeEventListener('wheel', handleScroll) // cleanup
    }, [currentScene, maxWidth, step])

    
    return scrollRef
}

export default useScrollControl