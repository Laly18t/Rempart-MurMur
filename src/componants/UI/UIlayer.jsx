import { useState } from 'react';
import Loader from './Loader'
import SoundButton from "./SoundButton"
import SubtitleButton from "./SubtitleButton"

export default function UIlayer() {
    const [fadeOut, setFadeOut] = useState(false)
    const [showTitle, setShowTitle] = useState(false)
    const [showSound, setShowSound] = useState(false)

    // animation fade in
    const handleLoaderFinish = () => {
        setShowTitle(true)
    }
    // animation fade out 
    const handleStart = () => {
        setFadeOut(true) // animation
    
        // apres l'anim (500ms), on cache titre et affiche sound
        setTimeout(() => {
            setShowSound(true)
        }, 500)
    } 

    return <div className="uiLayer">
        {/* UI 1 - Loader */}
        <Loader onFinish={handleLoaderFinish} />

        {/* UI 2 - Titre + button */}
        {showTitle && (
        <div className={`titre ${fadeOut ? 'fade-out' : 'fade-in'}`}>
            <h1>Mur - <br></br>Mur</h1>
            <button className="startButton" onClick={handleStart}>
                <p>Démarrer</p>
            </button>
        </div>
        )}

        {/* UI 3 - option de sons permanentes */}
        {showSound && (
            <div className="sound fade-in">
                <SubtitleButton />
                <SoundButton />
            </div>
        )}
    </div>
}