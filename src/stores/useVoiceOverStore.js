import { create } from 'zustand'
import { SETTINGS } from '../constants'

const useVoiceOverStore = create((set, get) => ({
    mute: SETTINGS.AUDIO_MUTED,
    showSubtitle: true,
    index: 0,
    currentIndex: -1,
    previousIndex: -1,
    isPlaying: false,
    isSceneFinished: false,
    currentFileName: '',
    progress: 0, // progression en secondes
    setProgress: (progress) => set({ progress }),
    setShowSubtitle: (showSubtitle) => {
        set({ showSubtitle })
    }, // changer l'état de l'affichage des sous-titres
    setCurrentFileName: (currentFileName) => {
        set({ currentFileName })
    }, // changer le nom du fichier audio

    setMute: (mute) => set({ mute }), // changer l'état du son
    setIndex: (index) => set({ index }), // changer l'index de l'audio
    setCurrentIndex: (currentIndex) => set({ currentIndex }), // changer l'index de l'audio
    setIsPlaying: (bool) => set({ isPlaying: bool }),   // changer l'état de lecture
    setSceneFinished: () => {
        const { index } = get()
        set({ isSceneFinished: true, isPlaying: false, index: -1, currentIndex: -1, previousIndex: index })
    }, // marquer la scene comme terminée
    setPreviousIndex: ( index ) => {
        set({previousIndex: index})
    }
}))

export default useVoiceOverStore