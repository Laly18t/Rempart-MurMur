import { useTexture } from '@react-three/drei'

export default function ArrowButton({ position = [1, -5, 0], cote = false, onClick = () => {}, ...props }) {
    
    const textures = useTexture({
        R: './ui/icons/fleche_droite.svg',
        L: './ui/icons/fleche_gauche.svg',
    })
    const texture = cote ? textures.L : textures.R

    return (
        <mesh
            position={position}
            onClick={onClick}
            {...props}
        >
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial
                map={texture}
                transparent
                alphaTest={0.5}
                toneMapped={false}
            />
        </mesh>
    )
}
