import { useEffect, useState, useRef, useCallback } from 'react'
import Loader from './Loader'
import SoundButton from "./SoundButton"
import SubtitleButton from "./SubtitleButton"
import useAppStore from '../../stores/useAppStore'
import useSceneStore from '../../stores/useSceneStore'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
import videoSrc from '/ui/video.mp4'
import Subtitle from './Subtitle'

export default function UIlayer() {
    const [fadeOut, setFadeOut] = useState(false)
    const [showMedievalVideo, setShowMedievalVideo] = useState(false)
    const [videoFading, setVideoFading] = useState(false)
    const videoRef = useRef(null)
    const videoPlayedRef = useRef(false)

    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)
    const { currentScene } = useSceneStore()
    const { isSceneFinished, isPlaying } = useVoiceOverStore()

    // reset lecture de la vidéo
    useEffect(() => {
        if (currentScene !== 'monde-medieval') {
            videoPlayedRef.current = false
            setShowMedievalVideo(false) // reset video
            setVideoFading(false) // reset fade
        }
    }, [currentScene])

    // Affichage de la video medieval
    useEffect(() => {
        if (currentScene === 'monde-medieval' && isSceneFinished && !isPlaying && !videoPlayedRef.current && !videoFading) {
            videoPlayedRef.current = true
            setShowMedievalVideo(true)
            setTimeout(() => {
                videoRef.current?.play().catch(console.error)
            }, 300)
        }
    }, [currentScene, isSceneFinished, isPlaying, videoFading])

    // Gestion de la fin de la video
    const handleVideoEnd = useCallback(() => {
        setVideoFading(true)
        setTimeout(() => {
            setShowMedievalVideo(false)
            setVideoFading(false)
        }, 1000)
    }, [])

    // Initialisation de la vidéo
    const handleVideoRef = useCallback((element) => {
        if (element) {
            videoRef.current = element
            element.loop = false
            element.addEventListener('ended', handleVideoEnd)
        }
    }, [handleVideoEnd])

    // Animation fade-out du titre
    const handleStart = useCallback(() => {
        setFadeOut(true)
        setTimeout(() => nextStep(), 500)
    }, [nextStep])

    return (
        <div className="uiLayer">
            <Subtitle />
            {step === 0 && <Loader onFinish={() => nextStep()} />}

            {step === 1 && (
                <div className={`titre ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                    <img src="./ui/logo.svg" alt="Logo" className="logo" style={{ width: '20%', paddingBottom: '90px' }} />
                    <button className="startButton" onClick={handleStart}>
                        Démarrer
                    </button>
                </div>
            )}

            {step > 1 && (
                <div className="sound fade-in">
                    <SubtitleButton />
                    <SoundButton />
                </div>
            )}

            {showMedievalVideo && (
                <div className={`video-container ${videoFading ? 'fade-out' : 'fade-in'}`}>
                    <video ref={handleVideoRef} width="100%" height="100%" controls={false} autoPlay playsInline>
                        <source src={videoSrc} type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                </div>
            )}
        </div>
    )
}