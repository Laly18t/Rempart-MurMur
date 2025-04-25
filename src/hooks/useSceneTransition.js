import { useEffect } from "react"
import { WebGLRenderTarget } from "three"

// gestion des transitions de portails avec pre-rendu
const useSceneTransition = (gl, camera, scene, setSceneA, setSceneB) => {
    useEffect(() => {
        const renderTargetA = new WebGLRenderTarget(1024, 1024)
        const renderTargetB = new WebGLRenderTarget(1024, 1024)

        // render current scene in A
        gl.setRenderTarget(renderTargetA)
        gl.render(scene, camera)

        // pour B, on peut laisser vide au début (future scene)
        gl.setRenderTarget(null)

        if (typeof setSceneA === 'function') setSceneA({ fbo: renderTargetA, scene, camera })
        if (typeof setSceneB === 'function') setSceneB({ fbo: renderTargetB, scene, camera })
    }, [gl, camera, scene, setSceneA, setSceneB])
}

export default useSceneTransition