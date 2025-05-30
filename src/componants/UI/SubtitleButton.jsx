import { useTexture } from '@react-three/drei'

import useVoiceOverStore from '../../stores/useVoiceOverStore'

export default function SubtitleButton() {
    const { showSubtitle, setShowSubtitle } = useVoiceOverStore()

    const textures = {
        off: './ui/icons/subtitle_off_black.PNG',
        on: './ui/icons/subtitle_on_black.PNG'
    }
    const texture = !showSubtitle ? textures.on : textures.off

    return (
        <button className='subtitleButton'>
            <img
                src={texture}
                alt="subtitle"
                onClick={() => {
                    setShowSubtitle(!showSubtitle)
                }}
            />
        </button>
    )
}
