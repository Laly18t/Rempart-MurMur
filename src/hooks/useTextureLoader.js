import { useLoader } from "@react-three/fiber"
import { useState, useEffect, useMemo } from "react"
import { TextureLoader, RepeatWrapping } from 'three'

// Hook pour charger et configurer des textures
const useTextureLoader = (path, repeatX = 10, repeatY = 1) => {
  // Utilisation de useMemo pour éviter les re-rendus inutiles
  const texture = useLoader(TextureLoader, path)
  
  useEffect(() => {
    if (texture) {
      // Configuration du wrapping
      texture.wrapS = texture.wrapT = RepeatWrapping
      // Configuration de la répétition avec les paramètres fournis
      texture.repeat.set(repeatX, repeatY)
      // Nécessaire pour certains rendus
      texture.needsUpdate = true
    }
  }, [texture, repeatX, repeatY])
  
  return texture
}

export default useTextureLoader