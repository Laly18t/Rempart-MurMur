import { create } from 'zustand'

const useVoiceOverStore = create((set) => ({
    mute: false,
    index: -1,
    currentIndex: -1,
    isPlaying: false,
    isSceneFinished: false,

    setMute: (mute) => set({ mute }), // changer l'état du son
    setIndex: (index) => set({ index }), // changer l'index de l'audio
    setCurrentIndex: (currentIndex) => set({ currentIndex }), // changer l'index de l'audio
    setIsPlaying: (bool) => set({ isPlaying: bool }),   // changer l'état de lecture
    setSceneFinished: () => set({ isSceneFinished: true, isPlaying: false, index: -1, currentIndex: -1 }), // marquer la scene comme terminée
}))

export default useVoiceOverStore