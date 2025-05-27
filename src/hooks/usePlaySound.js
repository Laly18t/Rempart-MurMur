// hooks/usePlaySound.js
import { useEffect, useRef } from 'react'
import { AudioLoader, Audio, AudioListener } from 'three'
import useVoiceOverStore from '../stores/useVoiceOverStore'

export default function usePlaySound(url, loop = false) {
    const audioRef = useRef()
    const { mute } = useVoiceOverStore() // store

    useEffect(() => {
        const listener = new AudioListener()
        const sound = new Audio(listener)
        const loader = new AudioLoader()

        loader.load(url, (buffer) => {
            sound.setBuffer(buffer)
            sound.setLoop(loop)
            if(mute) {
                console.log('mute sound')
                sound.setVolume(0) // mute
            }
            else {
                sound.setVolume(0.3) // volume normal
            }
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
    }, [url, loop, mute])

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
