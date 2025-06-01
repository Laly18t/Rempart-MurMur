import { create } from 'zustand'

const useMobileStore = create((set) => ({
    teaserVisible: false,
    setTeaserVisible: (visible) => set(() => ({ teaserVisible: visible })),
}))

export default useMobileStore