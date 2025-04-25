import { create } from 'zustand'

const useSceneStore = create((set) => ({
    currentScene: null,
    setCurrentScene: (scene) => set(() => ({ currentScene: scene })),
    resetScene: () => set(() => ({ currentScene: null })),
}))

export default useSceneStore