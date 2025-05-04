import { useTexture } from '@react-three/drei'

import useVoiceOverStore from '../../stores/useVoiceOverStore'

export default function SubtitleButton() {
    // TODO: add subtitle gestion on store
    
    // const { mute, setMute } = useVoiceOverStore()

    const texture = ('./subtitle.png')
    // const texture = !mute ? textures.on : textures.off

    return (
        <div className='subtitleButton'>
            <img
                src={texture}
                alt="subtitle"
                onClick={() => {
                    // setMute(!mute)
                }}
            />
        </div>
    )
}
