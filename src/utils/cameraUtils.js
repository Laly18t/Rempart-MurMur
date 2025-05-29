import React from "react"
import { Vector3, Quaternion, Euler } from 'three'
import gsap from 'gsap'
import { useThree } from "@react-three/fiber"


export function cameraZoom(camera, cameraRef, onComplete = () => {}, portalGroupRef) { 
    
    const tl = gsap.timeline()

    const portalGroup = portalGroupRef
    console.log('Changement de camera')

    // Pour la position - utiliser getWorldPosition
    const worldPosition = new Vector3()
    cameraRef.getWorldPosition(worldPosition)

    // Pour la rotation - utiliser getWorldQuaternion puis convertir en Euler
    const worldQuaternion = new Quaternion()
    const worldRotation = new Euler()
    cameraRef.getWorldQuaternion(worldQuaternion)
    worldRotation.setFromQuaternion(worldQuaternion)
    // If the innerRef has a mainCamera, set it as the active camera
    tl.to(camera.position, {
        x: portalGroup.position.x + worldPosition.x,
        y: portalGroup.position.y + worldPosition.y,
        z: portalGroup.position.z + worldPosition.z,
        duration: 1,
        ease: "power2.inOut",
    }, 0.5)

    tl.to(camera.rotation, {
        x: worldRotation.x,
        y: worldRotation.y,
        z: worldRotation.z,
        duration: 1,
        ease: "power2.inOut",
        onComplete
    }, 0.5)
}