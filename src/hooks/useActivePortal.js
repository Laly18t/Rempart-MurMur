import { useEffect, useState } from "react"
import useSceneStore from "./useSceneStore"


// gestion du portail actif et de la voix-off
// TODO : refactor pour isoler la voix-off
const useActivePortal = () => {
    // voix-off
    const [voiceStep, setVoiceStep] = useState('intro')
    const { currentScene, resetScene } = useSceneStore()
    // const [, params] = useRoute('/portal/:id') // vient chercher l'id dans l'url
    // const [activePortalId, setActivePortalId] = useState(null) // savoir dans quel contexte on est

    // useEffect(() => {
    //     setActivePortalId(params?.id ?? null) // (null = intro)

    //     // lancer la bonne voix-off en fonction de l'id
    //     if (params?.id) {
    //         setVoiceStep(params.id)
    //     }
    // }, [params])

     // gestion du clavier (pour sortir d'un portail)
    useEffect(() => {
        console.log('current scene --> ', currentScene)
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && currentScene !== null) {
                resetScene()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown) // clean
    }, [currentScene])

    return {voiceStep}
}

export default useActivePortal