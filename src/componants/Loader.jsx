import { Html, useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'

export default function Loader() {
    const { progress } = useProgress()
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (progress === 100) {
            const timeout = setTimeout(() => setVisible(false), 200) // petit délai pour voir le 100%
            return () => clearTimeout(timeout)
        }
    }, [progress])

    if (!visible) return null

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1.5em',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '1em 2em',
            borderRadius: '10px',
            pointerEvents: 'none'
        }}>
            {progress.toFixed(0)} % chargé
        </div>
    )
}