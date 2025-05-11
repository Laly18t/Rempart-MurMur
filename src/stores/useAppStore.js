import { create } from 'zustand'

const useAppStore = create((set) => ({
    step: 0, // default scene
    setStep: (stepIndex) => set(() => ({ step: stepIndex })),
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    resetScene: () => set(() => ({ step: 0 })),
}))

export default useAppStore