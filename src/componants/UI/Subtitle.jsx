import srtParser2 from "srt-parser-2";
import useVoiceOverStore from "../../stores/useVoiceOverStore";
import { useEffect, useState } from "react";

const srtParser = new srtParser2();

function Subtitle({ }) {
    const { progress, currentFileName, showSubtitle } = useVoiceOverStore();
    const [subtitles, setSubtitles] = useState([]);
    const [currentSubtitle, setCurrentSubtitle] = useState(null);
    
    useEffect(() => {
        if (!currentFileName) return;

        const fileName = currentFileName
        .split('/')
        .pop()             // récupère "test-intro.mp3"
        .replace('.mp3', '') // retire l'extension

        const srtPath = `/subtitles/${fileName}.srt`;

        fetch(srtPath)
            .then((res) => res.text())
            .then((data) => {
                const parsed = srtParser.fromSrt(data, true);
                setSubtitles(parsed);
            });
    }, [currentFileName]);
    
    useEffect(() => {
        if (!showSubtitle) {
            return;
        }

        if (!subtitles.length) {
            return;
        }

        const subtitle = subtitles.find(
            (s) => progress >= s.startSeconds && progress <= s.endSeconds
        );
        setCurrentSubtitle(subtitle || null);
    }, [progress, subtitles, showSubtitle]);

    if (!showSubtitle) {
        return null;
    }

    if (!currentSubtitle) {
        return null;
    }

    return (
        <div
            className="subtitle-container"
            style={{
                position: "fixed",
                bottom: "5%",
                width: "100%",
                textAlign: "center",
                pointerEvents: "none",
                zIndex: 1000,
            }}
        >
            {currentSubtitle && (
                <p
                    style={{
                        display: "inline-block",
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        color: "white",
                        padding: "0.5em 1em",
                        borderRadius: "0.5em",
                        fontSize: "1.2em", // tu peux faire varier cette taille
                        fontFamily: "'Open Sans', sans-serif", // à ajuster selon le design
                        maxWidth: "80%",
                        margin: "0 auto",
                        lineHeight: 1.4,
                    }}
                >
                    {currentSubtitle.text}
                </p>
            )}
        </div>
    )
    

}

export default Subtitle;