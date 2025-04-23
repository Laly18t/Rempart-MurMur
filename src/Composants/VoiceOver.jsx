import { useThree } from "@react-three/fiber"
import { useCallback, useEffect, useRef, useState } from "react"
import { Audio, AudioListener, AudioLoader } from "three"

// chemin des audio
const AUDIO_SEQUENCES = {
    'intro': ['/audio/rempart-intro.mp3'],
    'monde-medieval': ['/audio/rempart-1317.mp3'],
    'monde-victorien': ['/audio/rempart-1789.mp3'],
    'monde-guerre': ['/audio/rempart-1942.mp3'],
    'outro': ['/audio/rempart-fin.mp3'],
}

// gestion des voix-off
export function VoiceOver({ voiceStep, onComplete, onSegmentChange }) {
    const { camera } = useThree()
    const soundRef = useRef(null)
    const listenerRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isReadyToPlay, setIsReadyToPlay] = useState(false)
    const files = AUDIO_SEQUENCES[voiceStep] || []

    // gestion du chargement et de la lecture d'un audio
    const playAudio = useCallback((index) => {
        if (!files[index]) return

        const listener = new AudioListener()
        listenerRef.current = listener
        camera.add(listener)

        const sound = new Audio(listener)
        soundRef.current = sound

        const loader = new AudioLoader()
        loader.load(files[index], (buffer) => {
            sound.setBuffer(buffer)
            sound.setLoop(false)
            sound.setVolume(0.8)

            const handleEnd = () => {
                onSegmentChange?.(index)
                const nextIndex = index + 1
                if (nextIndex < files.length) {
                    setCurrentIndex(nextIndex)
                } else {
                    onComplete?.(voiceStep)
                }
            }

            // securité
            setTimeout(() => {
                if (sound.source instanceof AudioBufferSourceNode) {
                    sound.source.addEventListener('ended', handleEnd)
                }
            }, 50)

            // lecture auto sauf pour l'intro
            if (voiceStep !== 'intro') {
                sound.play()
            } else {
                setIsReadyToPlay(true)
            }
        })
    }, [camera, files, onComplete, onSegmentChange, voiceStep])

    // gestion du chargement du son a chaque step
    useEffect(() => {
        if (!files.length || currentIndex >= files.length) return

        stopAudio()
        playAudio(currentIndex)

        return () => {
            stopAudio()
        }
    }, [currentIndex, files, playAudio])

    // gestion du reset quand voiceStep change
    useEffect(() => {
        setCurrentIndex(0)
        setIsReadyToPlay(voiceStep === 'intro')
    }, [voiceStep])

    //gestion du clic pour jouer l'intro
    useEffect(() => {
        const handleClick = () => {
            if (voiceStep === 'intro' && isReadyToPlay && soundRef.current) {
                soundRef.current.play()
                setIsReadyToPlay(false)
            }
        }

        if (voiceStep === 'intro') {
            window.addEventListener('click', handleClick)
        }

        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [voiceStep, isReadyToPlay])

    // clean
    const stopAudio = () => {
        if (soundRef.current?.isPlaying) soundRef.current.stop()
        if (listenerRef.current) camera.remove(listenerRef.current)
    }

    return null
}
