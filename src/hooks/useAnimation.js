import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"
import { AnimationMixer, LoopRepeat } from 'three'

// TODO : refactor pour cibler les animations 
const useAnimation = (scene,animations) => {
    const mixerRef = useRef()

    // gestion de l'animation de la trappe
    useEffect(() => {
        // mixer
        mixerRef.current = new AnimationMixer(scene)

        // boucle d'anim
        animations.forEach((clip) => {
            const action = mixerRef.current.clipAction(clip)
            action.play()
            action.setLoop(LoopRepeat)
        })

        return () => {
            // clean
            mixerRef.current.stopAllAction()
        }
    }, [scene, animations])

    // MAJ mixer a chaque frame (pour l'anim)
    useFrame((state, delta) => {
        mixerRef.current?.update(delta) // anim trappe
    })
}

export default useAnimation