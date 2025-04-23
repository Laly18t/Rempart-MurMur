import { useEffect } from "react"

// gestion des transitions de portails avec pre-rendu
const useSceneTransition = (gl, camera, scene, setSceneA, setSceneB) => {
    useEffect(() => {
        if (typeof setSceneA === 'function') setSceneA({ fbo: gl.getRenderTarget(), scene, camera }) 
        if (typeof setSceneB === 'function') setSceneB({ fbo: gl.getRenderTarget(), scene, camera }) // stockage du pre-rendu de l'image de la future scene
    }, [gl, camera, scene, setSceneA, setSceneB])
}

export default useSceneTransition