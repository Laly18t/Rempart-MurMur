import { Text } from "@react-three/drei"

import ArrowButton from "../ArrowButton"
import useAppStore from "../../stores/useAppStore"
import IntroAnimation from "../animations/IntroAnimation"

export default function Intro({ debug = false, ...props }) {
    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)

    const handleClickButton = () => {
        setStep(3)
    }

    return <>
        {/* bouton pour le son - TODO: refonte graphique */}
        <group visible={step > 1} {...props}>
            {debug && <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 18]} />
                <meshBasicMaterial color={"limegreen"} />
            </mesh>}
            <Text position={[0, 0, 0]} color={'red'} fontSize={0.3} anchorY="center" anchorX="center" lineHeight={0.8} >
                Introduction
            </Text>

            {step > 1 && <IntroAnimation />}

            <ArrowButton position={[2, 0, 0]} onClick={handleClickButton} />
        </group>

    </>
}