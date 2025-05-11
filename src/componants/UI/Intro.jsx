import { Text } from "@react-three/drei"

import ArrowButton from "../ArrowButton"
import useAppStore from "../../stores/useAppStore"
import IntroAnimation from "../animations/IntroAnimation"

export default function Intro() {
    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)

    const handleClickButton = () => {
        nextStep()
    }

    return <>
        {/* bouton pour le son - TODO: refonte graphique */}
        <group visible={step > 1}>
            <Text position={[-2, -2, 0]} color={'red'} fontSize={0.7} anchorY="top" anchorX="left" lineHeight={0.8} >
                Introduction
            </Text>

            {step > 1 && <IntroAnimation />}

            <ArrowButton position={[7, 0, 0]} onClick={handleClickButton} />
        </group>

    </>
}