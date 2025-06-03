import { create } from 'zustand'
import useVoiceOverStore from './useVoiceOverStore'
import { AUDIO_SEQUENCES } from '../constants'

const useSceneStore = create((set, get) => ({
    currentScene: null, // default scene
    cameraTarget: null, // position cible pour la caméra (Vector3)
    scenesGroups: {},
    cameraScenes: [],
    outScene: null,
    audioIndex: 0,
    isZoom: false,

    setIsZoom: (value) => set(() => ({ isZoom: value })),

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

    setCurrentScene: (scene, position = null) => {

        const { isPlaying, setPreviousIndex, setIndex } = useVoiceOverStore.getState()
        
        if (isPlaying) {
            console.warn('try to skip audio, just wait')
            return;
        }

        set(() => ({
            currentScene: scene,
            cameraTarget: position,
            outScene: null,
            audioIndex: 0,
        }))
        setIndex(0)
        setPreviousIndex(-1);
    },

    resetScene: () => {
        const { currentScene } = get()
        const { setSceneFinished } = useVoiceOverStore.getState()

        setSceneFinished(false)
        
        const newState = {
            currentScene: null,
            cameraTarget: null,
            audioIndex: 0,
        };

        if (currentScene !== null ) { // dans le cas ou on sort d'un portal on garde l'id de la currentScene
            newState.outScene = currentScene;
        }
        set(() => (newState))
    },
    resetOutScene: () => {
        set(() => ({outScene: null}))
    },

    exitPortalScene: () => {
        console.warn('exitPortalScene')
        const { isPlaying, setIndex } = useVoiceOverStore.getState()
        const { currentScene, resetScene } = get()
       
        if (isPlaying) {
            return;
        }
        resetScene()

        const outSceneAudioIndex = AUDIO_SEQUENCES.SCENE[currentScene].length - 1;
        setIndex(outSceneAudioIndex);
    },

}))

export default useSceneStore