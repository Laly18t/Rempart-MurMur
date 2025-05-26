import { useEffect, useRef } from 'react'
import { AudioLoader, Audio, AudioListener } from 'three'

// gestoin du sound design au click
export default function useClickSound(url) {
    const audioRef = useRef()

    useEffect(() => {
        const listener = new AudioListener()
        const sound = new Audio(listener)
        const loader = new AudioLoader()

        loader.load(url, (buffer) => {
            sound.setBuffer(buffer)
            sound.setLoop(false)
            sound.setVolume(0.5)
            audioRef.current = sound
        })

        // ajout au document au cas où
        window.addEventListener('click', () => {
            if (audioRef.current && !audioRef.current.context.state === 'running') {
                audioRef.current.context.resume()
            }
        })

        return () => {
            if (audioRef.current?.isPlaying) audioRef.current.stop()
        }
    }, [url])

    const play = () => {
        if (audioRef.current && !audioRef.current.isPlaying) {
            audioRef.current.play()
        }
    }

    return play
}
