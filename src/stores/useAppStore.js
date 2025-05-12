import { create } from 'zustand'

const useAppStore = create((set) => ({
    step: 0, // default scene
    maxWidth: 0,
    totalItems: 0,
    setStep: (stepIndex) => set(() => ({ step: stepIndex })),
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    resetScene: () => set(() => ({ step: 0 })),
    setMaxWidth: (width) => set(() => ({ maxWidth: width })),
    setTotalItems: (totalItems) => set(() => ({ totalItems }))
}))

export default useAppStore