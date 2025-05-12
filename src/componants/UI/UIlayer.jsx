import { useState } from 'react';
import Loader from './Loader'
import SoundButton from "./SoundButton"
import SubtitleButton from "./SubtitleButton"
import useAppStore from '../../stores/useAppStore'
import { useControls } from 'leva';

export default function UIlayer() {
    const [fadeOut, setFadeOut] = useState(false)

    const step = useAppStore((state) => state.step)
    const setStep = useAppStore((state) => state.setStep)
    const nextStep = useAppStore((state) => state.nextStep)

    // animation fade in
    const handleLoaderFinish = () => {
        setStep(1)
    }
    // animation fade out 
    const handleStart = () => {
        setFadeOut(true) // animation
    
        // apres l'anim (500ms), on cache titre et affiche sound
        setTimeout(() => {
            setStep(2)
        }, 500)
    } 

    return <div className="uiLayer">
        {/* UI 0 - Loader */}
        {step === 0 && (
            <Loader onFinish={handleLoaderFinish} />
        )}

        {/* UI 1 - Titre + button */}
        {step === 1 && (
            <div className={`titre ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                <h1>Mur - <br></br>Mur</h1>
                <button className="startButton" onClick={handleStart}>
                    Démarrer
                </button>
            </div>
        )}

        {/* UI 2 - option de sons permanentes */}
        {step > 1 && (
            <div className="sound fade-in">
                <SubtitleButton />
                <SoundButton />
            </div>
        )}
    </div>
}