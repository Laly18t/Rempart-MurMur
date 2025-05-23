import { useCursor } from '@react-three/drei'
import useVoiceOverStore from '../../stores/useVoiceOverStore'

export default function SoundButton() {
    const { mute, setMute } = useVoiceOverStore()

    const textures = {
        off: './ui/sound_off.png',
        on: './ui/sound_on.png'
    }
    const texture = !mute ? textures.on : textures.off

    return (
        <button className='soundButton'>
            <img
                src={texture}
                alt="sound"
                onClick={() => {
                    setMute(!mute)
                }}
            />
        </button>
    )
}
