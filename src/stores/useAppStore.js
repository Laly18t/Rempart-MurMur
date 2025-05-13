import { create } from 'zustand'
import useVoiceOverStore from './useVoiceOverStore';
import useSceneStore from './useSceneStore';

const useAppStore = create((set) => ({
    step: 0, // default scene
    maxWidth: 0,
    totalItems: 0,
    setStep: (stepIndex) => {
        const { isPlaying, setPreviousIndex, setIndex } = useVoiceOverStore.getState()
        const { resetOutScene } = useSceneStore.getState() 

        if (isPlaying) {
            console.warn('try to skip audio, just wait')
            return;
        }
        resetOutScene()
        setIndex(0)
        setPreviousIndex(-1); // au changement de step, reset du previousIndex
        set(() => ({ step: stepIndex }))
    },
    nextStep: () => {
        const { isPlaying, setPreviousIndex, setIndex } = useVoiceOverStore.getState()
        const { resetOutScene } = useSceneStore.getState() 
        if (isPlaying) {
            console.warn('try to skip audio, just wait')
            return;
        }
        resetOutScene()
        setIndex(0)
        setPreviousIndex(-1); // au changement de step, reset du previousIndex
        set((state) => ({ step: state.step + 1 }))
    },
    resetScene: () => set(() => ({ step: 0 })),
    setMaxWidth: (width) => set(() => ({ maxWidth: width })),
    setTotalItems: (totalItems) => set(() => ({ totalItems }))
}))

export default useAppStore