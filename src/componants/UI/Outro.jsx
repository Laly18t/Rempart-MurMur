import { Text } from "@react-three/drei"

import ConclusionAnimation from "../animations/ConclusionAnimation"
import useAppStore from "../../stores/useAppStore"
import { useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import ArrowButton from "../ArrowButton"

export default function Conclusion({debug = false, ...props}) {
    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)
    const nextStep = useAppStore((state) => state.nextStep)

    const texture = useLoader(TextureLoader, './intro_castle.png')

    const handleClickButton = () => {
        nextStep()
    }
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

            <Text position={[0, -1, 0]} color={'red'} fontSize={0.2} anchorY="center" anchorX="center" lineHeight={0.8} >
                Le chateau traverse les âges
            </Text>

            {/* {step > 1 && <ConclusionAnimation />} */}
            <ArrowButton position={[2, -1.15, 0]} onClick={handleClickButton} />
            <ArrowButton position={[-2, -1.15, 0]} scale={[-1, 1, 1]} onClick={handleReturnButton} />
        </group>
    </>
}