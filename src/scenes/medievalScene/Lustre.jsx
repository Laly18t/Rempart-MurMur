import * as THREE from 'three'
import React, { useRef, useState, useEffect, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'

// Composant du lustre
export default function Lustre(props) {
    const { scene } = useGLTF('/models/objects/lustre.gltf') // load
    const { camera } = useThree()
    const groupRef = useRef()

    const [clickedCandles, setClickedCandles] = useState({})
    const [isLookingAtCandle, setLookAtCandle] = useState(false)

    // compter le nb de bougies allumés
    const candlesCount = Object.values(clickedCandles).filter(Boolean).length
    const showLight = candlesCount >= 6

    // parcourir la scene une fois chargee
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh && child.name.toLowerCase().includes('bougie')) {
                child.material = new THREE.MeshStandardMaterial({
                    color: 'white', // couleur de base
                    emissive: 'black', // couleur de lumiere emise (noire = eteinte)
                    emissiveIntensity: 3, // intensite
                    toneMapped: false,
                })

                child.userData.clickable = true
                // allumer les bougies 1 fois
                child.onClick = () => {
                    const id = child.uuid
                    const clicked = clickedCandles[id]

                    child.material.emissive.set(clicked ? 'black' : 'orange')
                    child.material.emissiveIntensity = clicked ? 1 : 2
                    setClickedCandles(prev => ({ ...prev, [id]: !clicked }))
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
        <group  
            ref={groupRef} 
            dispose={null} 
            onClick={() => {
                if (isLookingAtCandle) { return }
                camera.position.lerp(new THREE.Vector3(40, 1, 2), 0.05)
                camera.lookAt(15,-5,-25)
                setLookAtCandle(true)
            }}
            onPointerDown={handlePointerDown} 
            position={[0, 2, 0]}
        >
            <primitive object={scene} />
            {showLight && (<>
                <ambientLight intensity={0.6} />
                <spotLight position={[0, 5, 5]} intensity={0.8} />
            </>)}
        </group>
    )
}

useGLTF.preload('/models/objects/lustre.gltf')
