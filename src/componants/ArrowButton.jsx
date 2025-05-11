import { useTexture } from '@react-three/drei'
import { Vector3 } from 'three'

import useVoiceOverStore from '../stores/useVoiceOverStore'
import useZoom from '../hooks/useZoom'
import { POSITIONS_PARCHEMIN } from '../constants'

export default function ArrowButton({ position = [1, -5, 0], onClick = () => {}, ...props }) {

    const texture = useTexture('./sound_off.png')
    
    const toggleZoom = useZoom(POSITIONS_PARCHEMIN[0], new Vector3(0, 0, 0)) // hook de zoom

    return (
        <mesh
            position={position}
            onClick={onClick}
            {...props}
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
