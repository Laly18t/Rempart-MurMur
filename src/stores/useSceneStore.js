import { create } from 'zustand'

const useSceneStore = create((set) => ({
    currentScene: 'intro', // default scene
    setCurrentScene: (scene) => set(() => ({ currentScene: scene })),
    resetScene: () => set(() => ({ currentScene: 'intro' })),
}))

export default useSceneStore