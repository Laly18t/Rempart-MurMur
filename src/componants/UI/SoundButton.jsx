import { useCursor } from '@react-three/drei'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
import useSceneStore from '../../stores/useSceneStore'

export default function SoundButton() {
    const { mute, setMute } = useVoiceOverStore()
    const { currentScene } = useSceneStore()

    const textures = {
        off: './ui/icons/sound_off_black.PNG',
        on: './ui/icons/sound_on_black.PNG',
        off_light: './ui/icons/sound_off_light.PNG',
        on_light: './ui/icons/sound_on_light.PNG',
    }
    const getTexture = () => {
        if (currentScene === 'monde-medieval' || currentScene === 'monde-moderne' || currentScene === 'monde-guerre') {
            return !mute ? textures.on_light : textures.off_light
        } else {
            return !mute ? textures.on : textures.off
        }
    }

    return (
        <button className='soundButton'>
            <img
                src={getTexture()}
                alt="sound"
                onClick={() => {
                    setMute(!mute)
                }}
            />
        </button>
    )
}
