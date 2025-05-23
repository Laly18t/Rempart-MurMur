import { Text } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import ArrowButton from "../ArrowButton"
import useAppStore from "../../stores/useAppStore"

export default function CTA_end({debug = false, ...props}) {
    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)
    const texture = useLoader(TextureLoader, './intro_castle.png')
    const handleReturnButton = () => {
        setStep(step - 1)
    }
    
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
            <ArrowButton position={[-2, -1.15, 0]} scale={[-1, 1, 1]} onClick={handleReturnButton} />

        </group>
    </>
}