import { Html, Text } from "@react-three/drei"
import Lottie from "react-lottie"
import animationData from '../../lotties/joy.json'

export default function Conclusion({...props}) {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }
        
    return <>
        <group {...props} >
            {/* <mesh position={[0, 0, 0]}>
                <planeGeometry args={[28, 18]} />
                <meshBasicMaterial color={"dodgerblue"} />
            </mesh> */}
            <Text position={[-2, -2, 0]} color={'red'} fontSize={0.7} anchorY="top" anchorX="left" lineHeight={0.8} >
                Conclusion
            </Text>
            <Html transform position={[0, 0, 0]} distanceFactor={2} zIndexRange={[100, 0]}>
                <div style={{ width: 100, height: 100, background: 'transparent', }}>
                    <Lottie animationData={animationData} loop autoplay  options={defaultOptions} style={{ background: 'transparent' }} />
                </div>
            </Html>
        </group>
    </>
}