import { Text } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"

export default function CTA_end({debug = false, ...props}) {
    const texture = useLoader(TextureLoader, './intro_castle.png')
    
    return <>
        <group {...props} >

            {debug && <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 18]} />
                <meshBasicMaterial color={"limegreen"} />
            </mesh>}

            <mesh position={[0,0.4,0]}> {/* TODO: temporaire */}
                <planeGeometry args={[5.5, 2.4]} /> 
                <meshBasicMaterial map={texture} transparent={true} />
            </mesh>

            <Text position={[0, -1, 0]} color={'red'} fontSize={0.3} anchorY="center" anchorX="center" lineHeight={0.8} >
                CTA de fin
            </Text>

        </group>
    </>
}