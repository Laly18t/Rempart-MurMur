import { useThree } from "@react-three/fiber"
import { useCallback, useEffect, useRef, useState } from "react"
import { Audio, AudioListener, AudioLoader } from "three"

import { AUDIO_SEQUENCES, SETTINGS } from "../constants"
import useSceneStore from "../stores/useSceneStore"
import useVoiceOverStore from "../stores/useVoiceOverStore"



export default function VoiceOver({ onAudioEnd }) {
    const { camera } = useThree()
    const { currentScene } = useSceneStore()

    const [ clickedOnAudio, setClickedOnAudio ] = useState(false)

    const {
        index,
        currentIndex,
        setCurrentIndex,
        isPlaying,
        setIndex,
        setIsPlaying,
        setSceneFinished,
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

        // console.log('Lecture du son', audioIdx, files[audioIdx], isPlaying)

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
            sound.setVolume(0.8)

            SETTINGS.DEBUG_VOICEOVER && console.log('Lecture du son', audioIdx, files[audioIdx], sound)
            sound.play()
            

            SETTINGS.DEBUG_VOICEOVER && console.log('AudioBufferSourceNode', sound)
            if (sound.source instanceof AudioBufferSourceNode) {
                SETTINGS.DEBUG_VOICEOVER && console.log('AudioBufferSourceNode détecté')
                sound.source.onended = () => {
                    console.log('Audio terminé', audioIdx)
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
    }, [camera, files, currentScene, setIndex, setIsPlaying, setSceneFinished, onAudioEnd, isPlaying])

    // Lancer le son automatiquement (sauf intro)
    useEffect(() => {
        if (!clickedOnAudio) return // on ne lance pas le son si on n'a pas cliqué sur le son (permission de lecture)
        if (!files.length || index >= files.length) return // on ne lance pas si il n'y a pas de son
        if (index === currentIndex) return // on ne relance pas le son si on est sur le même index


        SETTINGS.DEBUG_VOICEOVER && console.log('Lancement du son', index, files)
        stopAudio()
        playAudio(index)

        return () => stopAudio()
    }, [files, playAudio, currentScene, clickedOnAudio])

    // Lancer le son de l’intro au clic
    useEffect(() => {
        const handleClick = () => {
            if (currentScene !== 'intro') return

            setClickedOnAudio(true)
            setIndex(0)
        }

        if (currentScene === 'intro') {
            window.addEventListener('click', handleClick)
        }

        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [currentScene, isPlaying, setIsPlaying])

    return null
}