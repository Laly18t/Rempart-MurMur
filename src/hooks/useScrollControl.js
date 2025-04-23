import { useEffect, useRef } from 'react'
import { SETTINGS } from '../constants'

// gestion du scroll horizontal
const useScrollControl = (activePortalId) => {
    const scrollRef = useRef(0)
    useEffect(() => {
        const handleScroll = (event) => {
            // actif quand on est pas dans un portail
            if (!activePortalId) {
                scrollRef.current -= event.deltaY * SETTINGS.SCROLL_SPEED // sensibilité du scroll
                scrollRef.current = Math.max(0, Math.min(scrollRef.current, SETTINGS.MAX_TRANSLATION))
            }
        }
        window.addEventListener('wheel', handleScroll) // on ecoute la molette
        return () => window.removeEventListener('wheel', handleScroll) // clean
    }, [activePortalId])
    return scrollRef
}

export default useScrollControl