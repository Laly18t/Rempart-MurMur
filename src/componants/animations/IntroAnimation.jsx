import Lottie from 'react-lottie'
import { Html } from "@react-three/drei"
import animationData from '../../lotties/joy.json'

export default function IntroAnimation({ step = 0 }){
    const defaultOptions = {
        loop: false,
        autoplay: true,
        play: false,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    return (
        <Html transform position={[0, 1, 0]} distanceFactor={2} zIndexRange={[100, 0]}>
            <div style={{ width: 1000, height: 1000, background: 'transparent', zIndex: 10 }}>
                <Lottie animationData={animationData} options={defaultOptions} style={{ background: 'transparent' }} />
            </div>
        </Html>
    )
}