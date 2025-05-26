// hooks/usePlaySound.js
import { useEffect, useRef } from 'react'
import { AudioLoader, Audio, AudioListener } from 'three'

export default function usePlaySound(url, loop = false) {
    const audioRef = useRef()

    useEffect(() => {
        const listener = new AudioListener()
        const sound = new Audio(listener)
        const loader = new AudioLoader()

        loader.load(url, (buffer) => {
            sound.setBuffer(buffer)
            sound.setLoop(loop)
            sound.setVolume(0.3)
            audioRef.current = sound
        })

        window.addEventListener('click', () => {
            if (audioRef.current && audioRef.current.context.state !== 'running') {
                audioRef.current.context.resume()
            }
        })

        return () => {
            if (audioRef.current?.isPlaying) audioRef.current.stop()
        }
    }, [url, loop])

    const play = () => {
        if (audioRef.current && !audioRef.current.isPlaying) {
            audioRef.current.play()
        }
    }

    const stop = () => {
        if (audioRef.current?.isPlaying) {
            audioRef.current.stop()
        }
    }

    return { play, stop }
}
