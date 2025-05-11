import useTextureLoader from "../hooks/useTextureLoader"
import { ASSETS } from '../constants'
import useAppStore from "../stores/useAppStore"

export default function ParcheminBackground() {

    const textureParchemin = useTextureLoader(ASSETS.TEXTURE_PARCHEMIN)
    const maxWidth = useAppStore((state) => state.maxWidth)
    const offset = 100;
    const width = maxWidth + offset * 2;

    return (
        <group>
            {/* Parchemin */}
            <mesh position={[(width / 2) - offset, 0, -2]}>
                <planeGeometry args={[width, 20]} />
                <meshBasicMaterial map={textureParchemin} />
            </mesh>
        </group>
    )
}