import { Text } from "@react-three/drei"

import ConclusionAnimation from "../animations/ConclusionAnimation"
import useAppStore from "../../stores/useAppStore"

export default function Conclusion({debug = false, ...props}) {
    const step = useAppStore((state) => state.step)
        
    return <>
        <group {...props} >
            {debug && <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 18]} />
                <meshBasicMaterial color={"limegreen"} />
            </mesh>}
            <Text position={[-2, -2, 0]} color={'red'} fontSize={0.7} anchorY="top" anchorX="left" lineHeight={0.8} >
                Conclusion
            </Text>

            {step > 1 && <ConclusionAnimation />}
        </group>
    </>
}