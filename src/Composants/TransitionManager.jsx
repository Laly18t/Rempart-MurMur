// TransitionManager.js
import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'wouter'
import { useFrame } from '@react-three/fiber'
import Transition from './Transition'

export default function TransitionManager({ children, textureUrl }) {
    const [sceneA, setSceneA] = useState(null)
    const [sceneB, setSceneB] = useState(null)
    const [showTransition, setShowTransition] = useState(false)
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

    const [, setLocation] = useLocation()
    const nextRouteRef = useRef(null)

    // Intercepter navigation
    const navigateWithTransition = (nextRoute) => {
        transitionParams.animateTransition = true
        nextRouteRef.current = nextRoute
        setShowTransition(true)
    }

    // Lancer la navigation une fois la transition finie
    useFrame(() => {
        if (transitionParams.transition >= 1 && transitionParams.animateTransition) {
            transitionParams.animateTransition = false
            setShowTransition(false)
            setLocation(nextRouteRef.current)
        }
    })

    return (
        <>
            {/* Ton composant de scène actuel */}
            {children({ navigate: navigateWithTransition, setSceneA, setSceneB })}

            {/* Affiche la transition */}
            <Transition
                sceneA={sceneA}
                sceneB={sceneB}
                texture={textureUrl}
                transitionParams={transitionParams}
            />
        </>
    )
}
