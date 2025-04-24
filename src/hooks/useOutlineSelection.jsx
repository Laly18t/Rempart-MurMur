import { EffectComposer, Outline, Selection } from "@react-three/postprocessing"

export function useOutlineSelection(enabled = true) {
    if (!enabled) return null

    return (
        <Selection>
            <EffectComposer multisampling={4} autoClear={false} >
                <Outline
                    visibleEdgeColor="white"
                    hiddenEdgeColor="white"
                    blur
                    edgeStrength={3}
                />
            </EffectComposer>
        </Selection>
    )
}