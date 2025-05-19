import { useTexture } from '@react-three/drei'

import useVoiceOverStore from '../../stores/useVoiceOverStore'

export default function SubtitleButton() {
    const { showSubtitle, setShowSubtitle } = useVoiceOverStore()

    const texture = ('./ui/subtitle.png')
    // const texture = !subtitle ? textures.on : textures.off

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
