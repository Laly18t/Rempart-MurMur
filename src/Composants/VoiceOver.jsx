import { useThree } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Audio, AudioListener, AudioLoader } from "three"

// chemin des audio
const AUDIO_SEQUENCES = {
    'intro': ['/audio/rempart-intro.mp3'],
    'monde-medieval': ['/audio/rempart-1317.mp3'],
    'monde-victorien': ['/audio/rempart-1789.mp3'],
    'monde-guerre': ['/audio/rempart-1942.mp3'],
    'outro': ['/audio/rempart-fin.mp3'],
}

export function VoiceOver({ voiceStep, onComplete, onSegmentChange }) {
    const { camera } = useThree()
    const soundRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isReadyToPlay, setIsReadyToPlay] = useState(false)
    const files = AUDIO_SEQUENCES[voiceStep] || []

    // Reset audio state on voiceStep change
    useEffect(() => {
        // setCurrentIndex(0)
        setIsReadyToPlay(voiceStep === 'intro') // l’intro attend un clic
    }, [voiceStep])

    useEffect(() => {
        if (!files.length || currentIndex >= files.length) return

        const listener = new AudioListener()
        camera.add(listener)

        // Stop previous sound
        if (soundRef.current?.isPlaying) {
            soundRef.current.stop()
        }

        const sound = new Audio(listener)
        soundRef.current = sound

        const loader = new AudioLoader()
        loader.load(files[currentIndex], (buffer) => {
            sound.setBuffer(buffer)
            sound.setLoop(false)
            sound.setVolume(0.8)

            if (voiceStep !== 'intro') {
                sound.play()
            }

            setTimeout(() => {
                if (sound.source && sound.source instanceof AudioBufferSourceNode) {
                    sound.source.addEventListener('ended', () => {
                        if (onSegmentChange) onSegmentChange(currentIndex)
                        const nextIndex = currentIndex + 1
                        if (nextIndex < files.length) {
                            setCurrentIndex(nextIndex)
                        } else {
                            onComplete?.(voiceStep)
                        }
                    })
                }
            }, 50)


            // pour l’intro on attend le clic
            if (voiceStep === 'intro') {
                setIsReadyToPlay(true)
            }
        })

        return () => {
            if (soundRef.current?.isPlaying) soundRef.current.stop()
            camera.remove(listener)
        }
    }, [currentIndex, voiceStep])

    // Clique pour démarrer l’intro
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
        return () => window.removeEventListener('click', handleClick)
    }, [voiceStep, isReadyToPlay])

    return null
}
