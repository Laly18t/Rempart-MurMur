import { useFrame, useThree } from "@react-three/fiber"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Audio, AudioListener, AudioLoader } from "three"

import { AUDIO_SEQUENCES, SETTINGS } from "../constants"
import useSceneStore from "../stores/useSceneStore"
import useVoiceOverStore from "../stores/useVoiceOverStore"
import useAppStore from "../stores/useAppStore"

export default function VoiceOver({ onAudioEnd }) {
    const { camera } = useThree()
    const {currentScene, outScene} = useSceneStore()
    const step = useAppStore((state) => (state.step))

    const startTimeRef = useRef(null)
    const isTrackingRef = useRef(false)

    const {
        index,
        currentIndex,
        setCurrentIndex,
        isPlaying,
        setIndex,
        setIsPlaying,
        setSceneFinished,
        mute,
        previousIndex,
        setCurrentFileName,
        setProgress
    } = useVoiceOverStore()

    const soundRef = useRef(null)
    const listenerRef = useRef(null)

    const files = useMemo(() => {

        if (currentScene !== null) {
            return AUDIO_SEQUENCES.SCENE[currentScene] ?? []
        }

        if (currentScene === null && outScene !== null) {
            return AUDIO_SEQUENCES.SCENE[outScene] ?? []
        }

        
        if (typeof AUDIO_SEQUENCES.STEP[step] !== 'undefined' && AUDIO_SEQUENCES.STEP[step] !== null) {
            return [AUDIO_SEQUENCES.STEP[step]]
        }
        

        return [];

    }, [ step, currentScene, outScene, index, currentIndex])


    const stopAudio = () => {
        if (!soundRef.current || !soundRef.current.isPlaying) return

        soundRef.current.stop()

        if (soundRef.current?.source instanceof AudioBufferSourceNode) {
            soundRef.current.source.disconnect()
        }
        if (listenerRef.current) {
            camera.remove(listenerRef.current)
        }

        isTrackingRef.current = false
        startTimeRef.current = null
        soundRef.current = null
        listenerRef.current = null
        setIsPlaying(false)
    }

    const playAudio = useCallback((audioIdx) => {
        // console.log('playAudio', {step, currentScene, outScene, audioIdx, f: files[audioIdx], isPlaying})
        if (!files[audioIdx]) return
        if (isPlaying) return
        if (mute === true) return

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
            sound.setVolume(SETTINGS.SOUND_ON)

            SETTINGS.DEBUG_VOICEOVER && console.log('Lecture du son', audioIdx, files[audioIdx], sound)
            setCurrentFileName(files[audioIdx]);
            sound.play()
            startTimeRef.current = sound.context.currentTime
            isTrackingRef.current = true

            SETTINGS.DEBUG_VOICEOVER && console.log('AudioBufferSourceNode', sound)
            if (sound.source instanceof AudioBufferSourceNode) {
                sound.source.onended = () => {
                    isTrackingRef.current = false
                    setProgress(0)
                    setIsPlaying(false)
                    onAudioEnd?.(audioIdx)
                    setSceneFinished()

                    // const nextIndex = audioIdx + 1
                    // if (nextIndex < files.length) {
                    //     // setIndex(nextIndex)
                    // } else {
                    //     setSceneFinished()
                    // }
                }
            }
        })
    }, [camera, files, currentScene, setIndex, setIsPlaying, setSceneFinished, onAudioEnd, isPlaying, mute])

    // gestion de la progression du son (pour l'affichage des sous-titres)
    useFrame(() => {
        if (
            soundRef.current &&
            soundRef.current.isPlaying &&
            soundRef.current.buffer &&
            isTrackingRef.current
        ) {
            const now = soundRef.current.context.currentTime
            const elapsed = now - startTimeRef.current
            setProgress(elapsed)
        }
    })
   

    // Lancer le son automatiquement
    useEffect(() => {
       

        if (!files.length || index >= files.length) return // on ne lance pas si il n'y a pas de son
        if (index === currentIndex && isPlaying) return // on ne relance pas le son si on est sur le même index et qu'il joue déjà

        if (index === previousIndex) return; // on ne joue pas en boucle
        //  console.log('play ', step, currentScene, {index,currentIndex,previousIndex});
        SETTINGS.DEBUG_VOICEOVER && console.log('Lancement du son', index, files, 'currentScene:', currentScene, 'outScene:', outScene)
        stopAudio()
        playAudio(index)

        return () => stopAudio()
    }, [files, playAudio, currentScene, index, currentIndex, isPlaying, outScene])

    // useEffect mute
    useEffect(() => {
        if (soundRef.current) {
            soundRef.current.setVolume(mute ? SETTINGS.SOUND_OFF : SETTINGS.SOUND_ON)
        }
    }, [mute])

    return null
}