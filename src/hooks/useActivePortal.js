import { useEffect, useState } from "react"
import { useRoute } from "wouter"

// gestion du portail actif 
const useActivePortal = (onEnterPortal) => {
    // voix-off
    const [voiceStep, setVoiceStep] = useState('intro')

    const [, params] = useRoute('/portal/:id') // vient chercher l'id dans l'url
    const [activePortalId, setActivePortalId] = useState(null) // savoir dans quel contexte on est
    
    useEffect(() => {
        setActivePortalId(params?.id ?? null) // (null = intro)

        // lancer la bonne voix-off en fonction de l'id
        if (params?.id) {
            setVoiceStep(params.id)
        }
    }, [params])

     // gestion du clavier (pour sortir d'un portail)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && activePortalId){
                onEnterPortal('/') // TODO - bug
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown) // clean
    }, [activePortalId, onEnterPortal])

    return {activePortalId, voiceStep}
}

export default useActivePortal