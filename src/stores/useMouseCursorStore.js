import { create } from 'zustand'

export const MOUSE_CURSOR_MODES = {
    DEFAULT: 'default',
    DECOUVRIR: 'decouvrir',
    POURSUIVRE: 'poursuivre',
}

const useMouseCursorStore = create((set) => ({
    mode: MOUSE_CURSOR_MODES.DEFAULT, // default, pointer, grab, grabbing
    negative: false,
    setMode: (newMode) => set(() => ({ mode: newMode })),
    setNegative: (isNegative) => set(() => ({ negative: isNegative })),
}))

export default useMouseCursorStore