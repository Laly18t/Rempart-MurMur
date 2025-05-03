import { useTexture } from '@react-three/drei'
import { useState } from 'react'

import useVoiceOverStore from '../stores/useVoiceOverStore'

export default function SoundButton() {
    const { mute, setMute } = useVoiceOverStore()

    const textures = useTexture({
        off: './sound_off.png',
        on: './sound_on.png'
    })
    const texture = !mute ? textures.on : textures.off

    return (
        <mesh
            position={[-10, 5, 0]}
            onClick={() => setMute(!mute)}
        >
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial
                map={texture}
                transparent
                alphaTest={0.5}
                toneMapped={false}
            />
        </mesh>
    )
}
