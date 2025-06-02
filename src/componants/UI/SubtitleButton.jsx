import { useTexture } from '@react-three/drei'

import useVoiceOverStore from '../../stores/useVoiceOverStore'
import useSceneStore from '../../stores/useSceneStore'

export default function SubtitleButton() {
    const { showSubtitle, setShowSubtitle } = useVoiceOverStore()
    const { currentScene } = useSceneStore()

    const textures = {
        off: './ui/icons/subtitle_off_black.PNG',
        on: './ui/icons/subtitle_on_black.PNG',
        off_light: './ui/icons/subtitle_off_light.PNG',
        on_light: './ui/icons/subtitle_on_light.PNG',
    }
    const getTexture = () => {
        if (currentScene === 'monde-medieval' || currentScene === 'monde-moderne' || currentScene === 'monde-guerre') {
            return !showSubtitle ? textures.on_light : textures.off_light
        } else {
            return !showSubtitle ? textures.on : textures.off
        }
    }

    return (
        <button className='subtitleButton'>
            <img
                src={getTexture()}
                alt="subtitle"
                onClick={() => {
                    setShowSubtitle(!showSubtitle)
                }}
            />
        </button>
    )
}
