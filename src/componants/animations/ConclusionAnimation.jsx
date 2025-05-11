import Lottie from 'react-lottie'
import { Html } from "@react-three/drei"
import animationData from '../../lotties/joy.json'

export default function ConclusionAnimation({ step = 0 }){
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
        <Html center position={[0, 1, 0]} zIndexRange={[100, 0]}>
            <div style={{ width: 150, height: 150, background: 'transparent', zIndex: 10 }}>
                <Lottie animationData={animationData} options={defaultOptions} style={{ background: 'transparent' }} />
            </div>
        </Html>
    )
}