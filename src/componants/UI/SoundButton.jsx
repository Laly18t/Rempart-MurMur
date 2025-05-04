import { useTexture } from '@react-three/drei'

import useVoiceOverStore from '../../stores/useVoiceOverStore'

export default function SoundButton() {
    const { mute, setMute } = useVoiceOverStore()

    const textures = {
        off: './sound_off.png',
        on: './sound_on.png'
    }
    const texture = !mute ? textures.on : textures.off

    return (
        <div className='soundButton'>
            <img
                src={texture}
                alt="sound"
                onClick={() => {
                    setMute(!mute)
                }}
            />
        </div>
    )
}
