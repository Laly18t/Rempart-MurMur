import { SETTINGS } from "../constants"
import useMobileStore from "../stores/useMobileStore"

export default function MobileComponant() {
    const { teaserVisible } = useMobileStore()
    SETTINGS.DEBUG_VOICEOVER && console.log('MobileComponant', teaserVisible)

    return (
        <div className="mobileComponant">
            {/* TODO : mettre la video teaser */}
            {teaserVisible ? (
                <video
                    className="mobileVideo"
                    src="/ui/IMG_7324.MOV"
                    autoPlay
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                </video>
            ) : (
                <img
                    className="mobileImage"
                    src="/texture_parchemin_horizontal.png"
                    alt="background"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            )}
        </div>
    )
}