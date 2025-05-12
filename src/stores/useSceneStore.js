import { create } from 'zustand'

const useSceneStore = create((set) => ({
    currentScene: null, // default scene
    cameraTarget: null, // position cible pour la caméra (Vector3)

    setCurrentScene: (scene, position = null) =>
        set(() => ({
            currentScene: scene,
            cameraTarget: position,
        })),

    resetScene: () =>
        set(() => ({
            currentScene: null,
            cameraTarget: null,
        })),
}))

export default useSceneStore