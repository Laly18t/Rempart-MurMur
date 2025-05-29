import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'
import Lottie from 'react-lottie'

import { TEXTS } from '../../constants'
import animationData from '../../lotties/loader_v2.json'

export default function Loader({ onFinish }) {
    const { progress } = useProgress()
    const [visible, setVisible] = useState(true)
    const defaultOptions = {
        loop: true,
        autoplay: true,
        play: false,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    useEffect(() => {
        if (progress === 100 && visible) {
            const timeout = setTimeout(() => {
                setVisible(false)
                if (onFinish) onFinish() // indiquer la fin
            }, 200)
            return () => clearTimeout(timeout)
        }
    }, [progress, onFinish, visible])

    if (!visible) return null

    return (
        <div style={{
            position: 'absolute',
            zIndex: 10,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1.5em',
            // background: 'rgba(0, 0, 0, 1)',
            padding: '0.5em 1em',
            borderRadius: '10px',
            pointerEvents: 'none'
        }}>
            <Lottie animationData={animationData} options={defaultOptions} style={{ background: 'transparent', width: '190%', height:'190%', transform: 'translate(-25%, 0%)', }} />
            <p style={{textAlign:'center'}}>{progress.toFixed(0)} % chargé </p>
        </div>
    )
}