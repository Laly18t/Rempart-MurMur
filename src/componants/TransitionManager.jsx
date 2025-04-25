// TransitionManager.js
import { useState, useRef } from 'react'
import { useLocation } from 'wouter'
import { useFrame } from '@react-three/fiber'

// composant
import Transition from './Transition'

// gestion de la transition
export default function TransitionManager({ children, textureUrl }) {
    const [sceneA, setSceneA] = useState(null)
    const [sceneB, setSceneB] = useState(null)
    const [showTransition, setShowTransition] = useState(false)
    const [, setLocation] = useLocation()
    const nextRouteRef = useRef(null)
    const [transitionParams] = useState({
        animateTransition: false,
        transitionSpeed: 2.0,
        transition: 0.0,
        threshold: 0.1,
        useTexture: true,
        texture: 0,
        loopTexture: false,
        needChange: true,
    })

    // intercepter navigation
    const navigateWithTransition = (nextRoute) => {
        transitionParams.animateTransition = true
        nextRouteRef.current = nextRoute
        setShowTransition(true)
    }

    // lancer la navigation
    useFrame(() => {
        if (transitionParams.current.animateTransition) {
            transitionParams.current.transition += delta * transitionParams.current.transitionSpeed
            if (transitionParams.current.transition >= 1) {
                transitionParams.current.transition = 1
                transitionParams.current.animateTransition = false
                setCurrentSceneId(nextSceneRef.current)
            }
        }
    })

    return (
        <>
            {/* scene actuel */}
            {children({ navigate: navigateWithTransition, setSceneA, setSceneB })}

            {/* transition */}
            <Transition
                sceneA={sceneA}
                sceneB={sceneB}
                texture={textureUrl}
                transitionParams={transitionParams}
            />
        </>
    )
}