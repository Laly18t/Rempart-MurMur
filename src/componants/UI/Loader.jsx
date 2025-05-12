import { useProgress } from '@react-three/drei'
import { useState, useEffect } from 'react'
import { TEXTS } from '../../constants'

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
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '1.5em',
            background: 'rgba(0, 0, 0, 1)',
            padding: '1em 2em',
            borderRadius: '10px',
            pointerEvents: 'none'
        }}>
            <p style={{textAlign:'center'}}>{progress.toFixed(0)} % chargé </p>

            <p>{TEXTS.LOADER}</p>
        </div>
    )
}