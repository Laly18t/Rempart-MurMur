import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'

import animationData from '../../lotties/loader_v2.json'

export default function Loader({ onFinish }) {
    const { progress } = useProgress()
    const [visible, setVisible] = useState(true)

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
            height: '100%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1.5em',
            background: 'rgb(247, 237, 214)',
            padding: '0.5em 1em',
            borderRadius: '10px',
            pointerEvents: 'none'
        }}>
            <Lottie 
                animationData={animationData} 
                loop={true}
                autoplay={true}
                style={{ 
                    background: 'transparent', 
                    width: '90%', 
                    height:'90%', 
                    transform: 'translate(-50%, -50%)', 
                    position: 'absolute',
                    zIndex: 10,
                    top: '50%',
                    left: '50%',
                }} 
            />
            {/* <p style={{textAlign:'center'}}>{progress.toFixed(0)} % chargé </p> */}
        </div>
    )
}