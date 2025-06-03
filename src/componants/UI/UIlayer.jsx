import { useEffect, useState, useRef, useCallback } from 'react'
import { isMobile } from "react-device-detect"

import Loader from './Loader'
import Subtitle from './Subtitle'
import SoundButton from "./SoundButton"
import SubtitleButton from "./SubtitleButton"

import useAppStore from '../../stores/useAppStore'
import useSceneStore from '../../stores/useSceneStore'
import useMobileStore from '../../stores/useMobileStore'
import useVoiceOverStore from '../../stores/useVoiceOverStore'

export default function UIlayer() {
    const [fadeOut, setFadeOut] = useState(false)
    const [showEndVideo, setShowEndVideo] = useState(false)
    const [videoFading, setVideoFading] = useState(false)
    const videoRef = useRef(null)
    const videoPlayedRef = useRef(false)
    const gifTimeoutRef = useRef(null) // Ref pour le timeout du GIF

    const step = useAppStore((state) => state.step)
    const nextStep = useAppStore((state) => state.nextStep)
    const { audioIndex, currentScene, isZoom, setIsZoom } = useSceneStore()
    const { isSceneFinished, isPlaying, index } = useVoiceOverStore()
    const { teaserVisible, setTeaserVisible } = useMobileStore()
    let videoSrc = `/animations/explosion_1.gif`
    let videoSrc2 = `/animations/explosion_2.gif`

    // reset lecture de la vidéo
    useEffect(() => {
        if (currentScene !== 'monde-medieval' || currentScene !== 'monde-guerre' || currentScene !== 'monde-moderne') {
            videoPlayedRef.current = false
            setShowEndVideo(false) // reset video
            setVideoFading(false) // reset fade
            // Nettoyer le timeout si il existe
            if (gifTimeoutRef.current) {
                clearTimeout(gifTimeoutRef.current)
                gifTimeoutRef.current = null
            }
        }
    }, [currentScene])

    // Fonction pour gérer la fin du GIF (simule l'événement 'ended' d'une vidéo)
    const handleGifEnd = useCallback(() => {
        setVideoFading(true)
        setTimeout(() => {
            setShowEndVideo(false)
            setVideoFading(false)
        }, 1000)
    }, [])

    // Fonction pour démarrer le GIF avec timer
    const playGif = useCallback((src) => {
        console.log('play gif', src)
        setShowEndVideo(true)
        
        // Programmer la fin du GIF après 1 seconde
        gifTimeoutRef.current = setTimeout(() => {
            handleGifEnd()
        }, 1000) // 1 seconde = durée du GIF
    }, [handleGifEnd])

    // Affichage de la video medieval
    useEffect(() => {
        if (currentScene === 'monde-medieval') {
            console.log('currentScene', currentScene, index)
            if (index === 2 && !isPlaying && !videoPlayedRef.current) {
                setTimeout(() => {
                    videoPlayedRef.current = true
                    playGif(videoSrc)
                }, 6000) // TODO: adapter le délai
            }
        } else if (currentScene === 'monde-moderne') {
            console.log('currentScene', currentScene, index)
            if (index === 2 && !isPlaying && !videoPlayedRef.current) {
                setTimeout(() => {
                    videoPlayedRef.current = true
                    playGif(videoSrc2)
                }, 4000) // TODO: adapter le délai
            }
        } else if (currentScene === 'monde-guerre') {
            console.log('currentScene', currentScene, index)
            if (index === 3 && !videoPlayedRef.current && videoSrc) {
                videoPlayedRef.current = true
                playGif(videoSrc)
            }
        }
    }, [currentScene, isSceneFinished, isPlaying, videoSrc, index, playGif])

    useEffect(() => {
        if(step === 1){
            setTimeout(() => {
                setFadeOut(true)
                nextStep()
            }, 2000)
        } else if (step === 2) {
            setFadeOut(false)
        }
    }, [step])

    // Nettoyage du timeout au démontage du composant
    useEffect(() => {
        return() => {
            if(gifTimeoutRef.current){
                clearTimeout(gifTimeoutRef.current)
            }
        }
    }, [])

    // Animation fade-out du titre
    const handleStart = useCallback(() => {
        setFadeOut(true)
        setTimeout(() => nextStep(), 500)
    }, [nextStep])

    const handleTeaserStart = useCallback(() => {
        setFadeOut(true)
        setTimeout(() => setTeaserVisible(!teaserVisible), 500)
    }, [nextStep])

    return (
        <div className="uiLayer">
            <Subtitle />
            {step === 0 && !isMobile && <Loader onFinish={() => nextStep()} />}

            {step === 1 && (
                <div className={`soundIntro ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                    <img src="./ui/icons/picto_casque.png" alt="Logo" className="casque" style={{ width: '30%' }} />

                    <p>Il s'agit d'une expérience sonore, nous vous recommandons d'activer le son pour profiter pleinement de l'expérience.</p>
                </div>
            )}

            {(step === 2 || isMobile) && (
                <div className={`titre ${fadeOut ? 'fade-out' : 'fade-in'}`}>
                    <img src="./ui/ornement_gauche.svg" alt="Logo" className="ornement_L" style={{ position: 'absolute', top: '2%', left: '2%', width: '30%' }} />
                    <img src="./ui/ornement_droit.svg" alt="Logo" className="ornement_D" style={{ position: 'absolute', top: '2%', right: '2%', width: '30%' }} />
                    <img src="./ui/logo/logo_rempart.svg" alt="Logo" className="logo_Rempart" style={{ position: 'absolute', top: '5%', right: '46%', width: '8%' }} />
                    <img src="./ui/logo/logo_gobelins.png" alt="Logo" className="logo_Gobelins" style={{ position: 'absolute', bottom: '2%', left: '2%', width: '6%' }} />
                    <img src="./ui/logo/logo_CCI.png" alt="Logo" className="logo_CCI" style={{ position: 'absolute', bottom: '1%', left: '10%', width: '6%' }} />

                    <img src="./ui/logo/logo.svg" alt="Logo" className="logo" style={{ width: '15%', paddingBottom: '10px' }} />
                    <p>A la découverte de l'histoire du château Montberne</p>
                    {isMobile ? (<>
                        <div className='mobileDiv'>
                            <p>Oh non !</p>
                            <p>Cette expérience est uniquement disponible sur un ordinateur</p>
                            <button className="startButton" onClick={handleTeaserStart}>
                                Découvrir la bande annonce
                            </button>
                        </div>
                    </>) : (<>
                        <button className="startButton" onClick={handleStart}>
                            Démarrer
                        </button>
                    </>)}
                </div>
            )}

            {step > 2 && !isMobile && (
                <div className="sound fade-in">
                    <SubtitleButton />
                    <SoundButton />
                </div>
            )}

            {showEndVideo && (
                <div>
                    <img 
                        className={`video-container ${videoFading ? 'fade-out' : 'fade-in'}`}
                        src={currentScene === 'monde-moderne' ? videoSrc2 : videoSrc} 
                        width="100%" 
                        height="100%" 
                        alt="Animation"
                        style={{ 
                            objectFit: 'cover',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            zIndex: 1000
                        }}
                    />
                </div>
            )}
        </div>
    )
}