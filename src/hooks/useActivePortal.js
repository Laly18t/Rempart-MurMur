import { useEffect, useState } from "react"
import useSceneStore from "./useSceneStore"


// gestion du portail actif
const useActivePortal = () => {
    const { currentScene, resetScene } = useSceneStore()

     // gestion du clavier (pour sortir d'un portail)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && currentScene !== null) {
                resetScene()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown) // clean
    }, [currentScene])
}

export default useActivePortal