import { create } from 'zustand'

const useSceneStore = create((set, get) => ({
    currentScene: null, // default scene
    cameraTarget: null, // position cible pour la caméra (Vector3)
    scenesGroups: {},
    cameraScenes: [],

    setSceneInfo: (sceneName, { group, cameras }) =>
        set((state) => ({
            scenesGroups: {
                ...state.scenesGroups,
                [sceneName]: group,
            },
            cameraScenes: {
                ...state.cameraScenes,
                [sceneName]: cameras,
            },
        })),
    
    getCurrentSceneInfo: () => {
        const { currentScene, scenesGroups, cameraScenes } = get()
        return {
            group: scenesGroups[currentScene],
            cameras: cameraScenes[currentScene],
        }
    },

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