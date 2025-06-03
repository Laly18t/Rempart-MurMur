import { useEffect, useState } from "react"
import useSceneStore from "../stores/useSceneStore"
import useVoiceOverStore from "../stores/useVoiceOverStore"
import { AUDIO_SEQUENCES } from "../constants"


// gestion du portail actif
const useActivePortal = () => {
    const { currentScene, exitPortalScene } = useSceneStore()
    const { isPlaying } = useVoiceOverStore()

     // gestion du clavier (pour sortir d'un portail)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && currentScene !== null) {
                exitPortalScene();
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown) // clean
    }, [currentScene, isPlaying])
}

export default useActivePortal