import SoundButton from "./SoundButton";
import SubtitleButton from "./SubtitleButton";

export default function UIlayer() {

    return <div className="uiLayer">
        <div className="sound">
            <SubtitleButton />
            <SoundButton />
        </div>
    </div>
}