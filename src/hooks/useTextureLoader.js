import { useLoader } from "@react-three/fiber"
import { useEffect } from "react"
import { TextureLoader, RepeatWrapping } from 'three'

// chargement de la texture du parchemin
const useTextureLoader = (path) => {
    const texture = useLoader(TextureLoader, path)
    
    useEffect(() => {
        texture.wrapS = texture.wrapT = RepeatWrapping // pour une texturee infinie
        texture.repeat.set(10, 1)
    }, [texture])
    return texture
}

export default useTextureLoader