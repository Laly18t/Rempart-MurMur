import { useThree } from "@react-three/fiber"
import { useCallback, useEffect, useRef, useState } from "react"
import { Audio, AudioListener, AudioLoader } from "three"

import { AUDIO_SEQUENCES, SETTINGS } from "../constants"
import useSceneStore from "../stores/useSceneStore"
import useVoiceOverStore from "../stores/useVoiceOverStore"

export default function VoiceOver({ onAudioEnd }) {
    const { camera } = useThree()
    const currentScene = useSceneStore((state) => (state.currentScene))

    const [clickedOnAudio, setClickedOnAudio] = useState(false)

    const {
        index,
        currentIndex,
        setCurrentIndex,
        isPlaying,
        setIndex,
        setIsPlaying,
        setSceneFinished,
        mute,
    } = useVoiceOverStore()

    const soundRef = useRef(null)
    const listenerRef = useRef(null)

    const files = AUDIO_SEQUENCES[currentScene] || []

    const stopAudio = () => {
        if (!soundRef.current || !soundRef.current.isPlaying) return

        soundRef.current.stop()

        if (soundRef.current?.source instanceof AudioBufferSourceNode) {
            soundRef.current.source.disconnect()
        }
        if (listenerRef.current) {
            camera.remove(listenerRef.current)
        }

        soundRef.current = null
        listenerRef.current = null
        setIsPlaying(false)
    }

    const playAudio = useCallback((audioIdx) => {
        if (!files[audioIdx]) return
        if (isPlaying) return
        if (mute === true) return

        console.log('Lecture du son', audioIdx, files[audioIdx], isPlaying)

        const listener = new AudioListener()
        const sound = new Audio(listener)
        const loader = new AudioLoader()

        listenerRef.current = listener
        soundRef.current = sound
        camera.add(listener)

        setIsPlaying(true)
        setCurrentIndex(audioIdx)

        loader.load(files[audioIdx], (buffer) => {
            SETTINGS.DEBUG_VOICEOVER && console.log('Buffer chargé', buffer)
            sound.setBuffer(buffer)
            sound.setLoop(false)
            sound.setVolume(SETTINGS.SOUND_ON)

            SETTINGS.DEBUG_VOICEOVER && console.log('Lecture du son', audioIdx, files[audioIdx], sound)
            sound.play()

            SETTINGS.DEBUG_VOICEOVER && console.log('AudioBufferSourceNode', sound)
            if (sound.source instanceof AudioBufferSourceNode) {
                sound.source.onended = () => {
                    setIsPlaying(false)
                    onAudioEnd?.(audioIdx)

                    const nextIndex = audioIdx + 1
                    if (nextIndex < files.length) {
                        // setIndex(nextIndex)
                    } else {
                        setSceneFinished()
                    }
                }
            }
        })
    }, [camera, files, currentScene, setIndex, setIsPlaying, setSceneFinished, onAudioEnd, isPlaying, mute])

    // Activer automatiquement l'audio pour les scènes autres que l'intro
    useEffect(() => {
        // Si ce n'est pas l'intro, on considère qu'on a déjà l'autorisation
        if (currentScene && currentScene !== 'intro') {
            setClickedOnAudio(true)
        }
    }, [currentScene])

    // Lancer le son automatiquement
    useEffect(() => {
        if (!clickedOnAudio) return // on ne lance pas le son si on n'a pas cliqué sur le son (permission de lecture)
        if (!files.length || index >= files.length) return // on ne lance pas si il n'y a pas de son
        if (index === currentIndex && isPlaying) return // on ne relance pas le son si on est sur le même index et qu'il joue déjà

        SETTINGS.DEBUG_VOICEOVER && console.log('Lancement du son', index, files, 'currentScene:', currentScene)
        stopAudio()
        playAudio(index)

        return () => stopAudio()
    }, [files, playAudio, currentScene, clickedOnAudio, index, currentIndex, isPlaying])

    // useEffect mute
    useEffect(() => {
        if (soundRef.current) {
            soundRef.current.setVolume(mute ? SETTINGS.SOUND_OFF : SETTINGS.SOUND_ON)
        }
    }, [mute])

    // Lancer le son de l'intro au clic
    useEffect(() => {
        const handleClick = () => {
            // Correction de la condition qui était toujours vraie
            if (!(currentScene === 'intro' || currentScene === null)) return

            setClickedOnAudio(true)
            setIndex(0)
        }

        if (currentScene === null || currentScene === 'intro') {
            window.addEventListener('click', handleClick)
        }

        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [currentScene, setIndex])

    return null
}