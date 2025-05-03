import { useEffect, useRef } from 'react'

import { SETTINGS } from '../constants'
import useSceneStore from './useSceneStore'

// gestion du scroll horizontal
const useScrollControl = () => {
    const scrollRef = useRef(0)
    const { currentScene } = useSceneStore()

    useEffect(() => {
        const handleScroll = (event) => {
            // actif quand on est pas dans un portail
            if (currentScene === 'intro' || currentScene === 'outro') {
                scrollRef.current -= event.deltaY * SETTINGS.SCROLL_SPEED // sensibilité du scroll
                scrollRef.current = Math.max(0, Math.min(scrollRef.current, SETTINGS.MAX_TRANSLATION))
            }
        }
        window.addEventListener('wheel', handleScroll) // on ecoute la molette
        return () => window.removeEventListener('wheel', handleScroll) // clean
    }, [currentScene])
    return scrollRef
}

export default useScrollControl