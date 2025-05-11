import * as THREE from 'three'
import { useThree, useFrame } from "@react-three/fiber"
import { useRef, useEffect } from "react"
import { easing, geometry } from 'maath'
import { CameraControls } from '@react-three/drei'
import useSceneStore from '../stores/useSceneStore'

function Rig({ position = new THREE.Vector3(5, 0, 4), focus = new THREE.Vector3(5, 0, 0), modelsInfo = {} }) {
    const { controls, scene, camera } = useThree()
    const targetPosition = useRef(new THREE.Vector3(0, 0, 2))
    const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
    const activeCameraRef = useRef(null)

    const currentX = useRef(0)

    const currentScene = useSceneStore((state) => state.currentScene)


    // Accédez à la référence du scroll depuis App


    useFrame((state, dt) => {
        // Si nous ne sommes pas dans un portail spécifique, appliquez le travelling

        if (controls) {
            const currentTarget = controls.getTarget(new THREE.Vector3())
            const currentPosition = controls.getPosition(new THREE.Vector3())
            // console.log('currentPosition', currentPosition, targetX)

            // Déplacez horizontalement avec un amortissement plus lent (0.5 -> 0.2)
            // // Plus cette valeur est petite, plus le mouvement sera doux
            // easing.damp3(currentPosition, 'x', targetX, 0.2, dt)
            // easing.damp3(currentTarget, 'x', targetX, 0.2, dt)

            // controls.setLookAt(
            //   currentPosition.x, currentPosition.y, currentPosition.z,
            //   currentTarget.x, currentTarget.y, currentTarget.z,
            //   false
            // )

            easing.damp3(currentPosition, 'x', 0.5, 0.1, dt)
            easing.damp3(currentTarget, 'x', 0.5, 0.1, dt)


            // controls.setLookAt(
            //   currentPosition.x, currentPosition.y, currentPosition.z,
            //   currentTarget.x, currentTarget.y, currentTarget.z,
            //   false
            // )

            currentX.current = currentPosition.x
        }
    });

    // Fonction pour trouver le modèle GLB à l'intérieur d'un Frame
    const findModelInFrame = (frameObject) => {
        let model = null
        frameObject.traverse((child) => {
            // Chercher les objets Gltf
            if (child.type === 'Group' && child.userData && child.userData.gltfPath) {
                model = child
            }
        })
        return model
    }

    useEffect(() => {
        // if (modelsInfo === null || Object.keys(modelsInfo).length === 0) {
        //     return
        // }

        if (currentScene) {
            // const modelInfo = modelsInfo[currentScene]
            // const active = scene.getObjectByName(currentScene)

            // if (active) {

            //     // Position par défaut pour le point de vue initial
            //     const defaultPos = new THREE.Vector3(0, 0, 2)
            //     const defaultFocus = new THREE.Vector3(0, 0, -2)

            //     // Transformer les coordonnées locales en coordonnées mondiales
            //     active.parent.localToWorld(defaultPos.set(0, 0.5, 0.25))
            //     active.parent.localToWorld(defaultFocus.set(0, 0, -2))

            //     var allCameras = scene.getObjectsByProperty('isCamera', true)

            //     //  console.log('modelInfos', modelInfo, modelInfo?.cameras, modelInfo?.cameras.length > 0)
            //     if (modelInfo && modelInfo.cameras && modelInfo.cameras.length > 0) {
            //         console.log(`Utilisation de la caméra du modèle ${currentScene}`)

            //         // Prendre la première caméra du modèle
            //         const modelCamera = modelInfo.cameras[0]

            //         // Obtenir la position mondiale de la caméra du modèle
            //         const worldPosition = new THREE.Vector3()
            //         const worldQuaternion = new THREE.Quaternion()
            //         const worldScale = new THREE.Vector3()

            //         // Extraire la matrice mondiale
            //         modelCamera.updateMatrixWorld(true)
            //         modelCamera.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale)

            //         // Créer un vecteur de direction basé sur la rotation de la caméra
            //         const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(worldQuaternion)

            //         // Calculer le point de focus en avançant dans la direction
            //         const targetPosition = worldPosition.clone().add(direction.multiplyScalar(10))

            //         // Appliquer la transition de caméra
            //         controls?.setLookAt(
            //             worldPosition.x, worldPosition.y, worldPosition.z,
            //             targetPosition.x, targetPosition.y, targetPosition.z,
            //             true // Activer l'animation
            //         )

            //         // Sauvegarder la référence à la caméra active
            //         activeCameraRef.current = modelCamera
            //     } else {

                  const active = scene.getObjectByName(currentScene)
                  console.log(`zoom in`, active)
                    if (active) {
                        active.parent.localToWorld(position.set(0, 0.5, 0.25))
                        active.parent.localToWorld(focus.set(0, 0, -2))
                        
                    }
                    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
                // }

            // }
        } else {
          console.log('go back')
            // Si aucun paramètre d'ID n'est trouvé, réinitialiser la caméra
            controls?.setLookAt(
                position.x,
                position.y,
                position.z,
                focus.x,
                focus.y,
                focus.z,
                true // Activer l'animation
            )
        }
    })


    return <CameraControls
        makeDefault
    // minPolarAngle={0} 
    // maxPolarAngle={Math.PI / 2}
    // minDistance={2} // Ajoutez cette ligne
    // maxDistance={2} // Ajoutez cette ligne avec la même valeur 
    />
}

export default Rig