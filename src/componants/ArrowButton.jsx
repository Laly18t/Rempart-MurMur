import { useTexture } from '@react-three/drei'

export default function ArrowButton({ position = [1, -5, 0], onClick = () => {}, ...props }) {
    const texture = useTexture('./arrow.png') // TODO : remplacer par le bon fichier

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
