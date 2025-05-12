import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { easing } from "maath";
import useSceneStore from "../stores/useSceneStore";
import * as THREE from "three";
import { SETTINGS } from "../constants";
/**
 * Modes d'easing disponibles dans la bibliothèque maath
 */
const EASING_MODES = {
    DAMP: "damp",         // Easing standard (ressort amorti)
    BACK: "back",         // Avec léger dépassement avant stabilisation
    ELASTIC: "elastic",   // Avec rebond élastique
    INERTIA: "inertia"    // Avec inertie physique
};

/**
 * Hook avancé pour animer la caméra en fonction d'une référence de scroll
 * Utilise la bibliothèque maath pour des fonctions d'easing optimisées
 */
const useEasedCamera = (
    scrollRef,
    camera,
    {
        damping = 0.15,              // Temps d'amortissement en secondes
        zOffset = SETTINGS.DEFAULT_ZOOM,                // Distance de la caméra sur l'axe Z
        lookAtTarget = true,         // Si true, la caméra regardera la cible
        maxSpeed = Infinity,         // Vitesse maximale de déplacement
        easingMode = EASING_MODES.DAMP, // Mode d'easing
        customPath = false,          // Activer un chemin personnalisé
        pathCurve = 0,               // Courbure du chemin (0 = ligne droite)
        yOffset = 0,                 // Décalage vertical
    } = {}
) => {
    // Position de référence pour le lookAt
    const lookAtRef = useRef(new Vector3(0, 0, 0))

    // Vecteur temporaire pour les calculs
    const tempVector = useRef(new Vector3())

    // Vecteur pour stocker la dernière position
    const lastPosition = useRef(new Vector3())
    const currentScene = useSceneStore((state) => state.currentScene)
    const { controls, scene } = useThree()
    // Initialiser avec la position actuelle de la caméra
    useFrame(() => {
        lastPosition.current.copy(camera.position)
    }, [])

    const position = new THREE.Vector3(0, 0, 2)
    const focus = new THREE.Vector3(0, 0, 0)

    useEffect(() => {
        if (currentScene) {
            const active = scene.getObjectByName(currentScene)
            
            if (active) {
                active.parent.localToWorld(position.set(0, 0.5, 0.25))
                active.parent.localToWorld(focus.set(0, 0, -2))

                camera?.lookAt(...position.toArray(), ...focus.toArray(), true)
            }   
        }
    }, [currentScene])

    useFrame((_, delta) => {
        // Mettre à jour la position cible basée sur scrollRef
        const targetX = scrollRef.current

        // Calculer la position Y en fonction du chemin personnalisé si activé
        let targetY = yOffset
        if (customPath) {
            // Créer une courbe sinusoïdale basée sur la position X
            targetY = Math.sin(targetX * 0.2) * pathCurve + yOffset
        }

        // Appliquer l'easing en fonction du mode sélectionné
        switch (easingMode) {
            case EASING_MODES.DAMP:
                // Easing standard avec amortissement
                easing.damp(camera.position, "x", targetX, damping, delta, maxSpeed)
                easing.damp(camera.position, "y", targetY, damping, delta, maxSpeed)
                easing.damp(camera.position, "z", zOffset, damping, delta, maxSpeed)
                break

            case EASING_MODES.BACK:
                // Easing avec léger dépassement
                easing.dampE(camera.position,
                    tempVector.current.set(targetX, targetY, zOffset),
                    damping * 3, delta)
                break

            case EASING_MODES.ELASTIC:
                // Easing avec rebond élastique
                easing.dampC(camera.position,
                    tempVector.current.set(targetX, targetY, zOffset),
                    0.15, 1 / damping)
                break

            case EASING_MODES.INERTIA:
                // Easing avec inertie (plus physique)
                easing.dampS(camera.position,
                    tempVector.current.set(targetX, targetY, zOffset),
                    lastPosition.current,
                    damping * 5, delta)
                break
        }

        // Mettre à jour la dernière position
        lastPosition.current.copy(camera.position)

        // Appliquer le lookAt avec easing si demandé
        // if (lookAtTarget) {
        //   // Calculer la cible du regard avec le même décalage Y que la position
        //   const lookAtY = customPath ? targetY : 0;

        //   // Mettre à jour la position cible du lookAt avec un léger décalage vers l'avant
        //   easing.damp3(
        //     lookAtRef.current, 
        //     tempVector.current.set(targetX + 1, lookAtY, 0), 
        //     damping, 
        //     delta
        //   );

        //   // Faire regarder la caméra vers ce point
        //   camera.lookAt(lookAtRef.current);
        // }
    });

    // Exposer les modes d'easing pour l'utilisation externe
    return { EASING_MODES }
};

export { useEasedCamera, EASING_MODES }