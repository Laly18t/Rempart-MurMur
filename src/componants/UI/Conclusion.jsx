import { Html, Text } from "@react-three/drei"
import Lottie from "react-lottie"
import animationData from '../../lotties/joy.json'

export default function Conclusion() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }
        
    return <>
        <Text position={[125, -3, 0]} color={'red'} fontSize={0.7} anchorY="top" anchorX="left" lineHeight={0.8} >
            Conclusion
        </Text>
        <Html transform position={[127, 0, 0]} distanceFactor={2}>
            <div style={{ width: 1000, height: 1000, background: 'transparent', }}>
                <Lottie animationData={animationData} loop autoplay  options={defaultOptions} style={{ background: 'transparent' }} />
            </div>
        </Html>
    </>
}