import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Composant du lustre
export default function Lustre(props) {
    const groupRef = useRef()
    const { scene } = useGLTF('/models/lustre.gltf')
    const [clickedBougies, setClickedBougies] = useState({})

    // parcourir la scène une fois chargée
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name.toLowerCase().includes('bougie')) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 'white', // couleur de base
                    emissive: 'black', // couleur de lumiere emise (noire = éteinte)
                    emissiveIntensity: 3, // intensité de l’emission
                    toneMapped: false, // empeche le rendu HDR d’affecter la couleur émise
                })

                child.userData.clickable = true
                // allumer les bougies 1 fois
                child.onClick = () => {
                    const id = child.uuid
                    const clicked = clickedBougies[id]

                    child.material.emissive.set(clicked ? 'black' : 'orange')
                    child.material.emissiveIntensity = clicked ? 1 : 2
                    setClickedBougies(prev => ({ ...prev, [id]: !clicked }))
                }
            }
        })
    }, [scene])

    // recup du clique dans la scene
    const handlePointerDown = (event) => {
        if (event.object?.userData?.clickable) {
            event.object.onClick?.()
        }
    }

    return (
        <group ref={groupRef} {...props} dispose={null} onPointerDown={handlePointerDown}>
            <primitive object={scene} />
        </group>
    )
}

useGLTF.preload('/lustre.gltf')
