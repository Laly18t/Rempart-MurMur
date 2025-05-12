import { useTexture } from '@react-three/drei'

import useVoiceOverStore from '../../stores/useVoiceOverStore'

export default function SubtitleButton() {
    // TODO: add subtitle gestion on store
    
    // const { subtitle, setsubtitle } = useVoiceOverStore()

    const texture = ('./subtitle.png')
    // const texture = !subtitle ? textures.on : textures.off

    return (
        <button className='subtitleButton'>
            <img
                src={texture}
                alt="subtitle"
                onClick={() => {
                    // setsubtitle(!subtitle)
                }}
            />
        </button>
    )
}
