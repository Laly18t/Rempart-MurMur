import { useEffect, useState, useRef, useCallback } from 'react'
import Loader from './Loader'
import SoundButton from "./SoundButton"
import SubtitleButton from "./SubtitleButton"
import useAppStore from '../../stores/useAppStore'
import useSceneStore from '../../stores/useSceneStore'
import useVoiceOverStore from '../../stores/useVoiceOverStore'
// import videoSrcWar from '/ui/video.mp4'
import Subtitle from './Subtitle'

export default function UIlayer() {
    const [fadeOut, setFadeOut] = useState(false)
    const [showEndVideo, setShowEndVideo] = useState(false)
    const [videoFading, setVideoFading] = useState(false)
    const videoRef = useRef(null)
    const videoPlayedRef = useRef(false)

    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)
    const { currentScene } = useSceneStore()
    const { isSceneFinished, isPlaying } = useVoiceOverStore()
    let videoEpoque = 'war'
    let videoSrc = `/ui/video_${videoEpoque}.mp4`

    // reset lecture de la vidéo
    useEffect(() => {
        if (currentScene !== 'monde-medieval' || currentScene !== 'monde-guerre') {
            videoPlayedRef.current = false
            setShowEndVideo(false) // reset video
            setVideoFading(false) // reset fade
        }
        if(currentScene === 'monde-medieval'){
                videoEpoque = 'medieval'
                console.log('show medieval video', videoSrc)
            } else if (currentScene === 'monde-moderne'){
                videoEpoque = 'modern'
                console.log('show morden video', videoSrc)
            } else if (currentScene === 'monde-guerre'){
                videoEpoque = 'war'
                console.log('show war video', videoSrc)
            }
    }, [currentScene, videoEpoque])

    // Affichage de la video medieval
    useEffect(() => {
        if (currentScene === 'monde-medieval' || currentScene === 'monde-moderne' || currentScene === 'monde-guerre') {
            if (isSceneFinished && !isPlaying && !videoPlayedRef.current && !videoFading && videoSrc) {
                videoPlayedRef.current = true
                console.log('play video', videoSrc)
                setShowEndVideo(true)
                setTimeout(() => {
                    videoRef.current?.play().catch(console.error)
                }, 300)
            }
        }
    }, [currentScene, isSceneFinished, isPlaying, videoFading, videoSrc])

    // Gestion de la fin de la video
    const handleVideoEnd = useCallback(() => {
        setVideoFading(true)
        setTimeout(() => {
            setShowEndVideo(false)
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

            {showEndVideo && (
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