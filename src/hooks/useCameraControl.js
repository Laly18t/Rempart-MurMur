import { useFrame } from "@react-three/fiber"
import { POSITIONS_ZOOM } from "../constants"
import { Vector3 } from 'three'

// gestion de la camera
const useCameraControl = (activePortalId, scrollRef, camera) => {
    useFrame(() => {
        // deplacement de la camera en zoom sur la scene
        if (activePortalId && POSITIONS_ZOOM[activePortalId]) {
            camera.position.lerp(new Vector3(...POSITIONS_ZOOM[activePortalId]), 0.05)
        } else { // camera qui suit le scroll sur le parchemin
            camera.position.set(scrollRef.current, 0, 10)
            camera.lookAt(scrollRef.current, 0, 0)
        }
    })
}

export default useCameraControl