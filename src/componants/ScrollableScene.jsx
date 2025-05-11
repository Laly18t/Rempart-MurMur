

import { useThree } from "@react-three/fiber"
import { Scroll, ScrollControls } from "./controls/ScrollControls"
import { Children, cloneElement, useEffect } from "react"
import useAppStore from "../stores/useAppStore"

const ScrollableScene = ({ w = 28, h = 1.61803398875, gap = 10, children }) => {
    const setMaxWidth = useAppStore((state) => state.setMaxWidth)
    const xW = w + gap
    const totalItems = Children.count(children) - 1

    useEffect(() => {
      setMaxWidth((totalItems * xW))
    }, [totalItems, xW])

    return (
        <group>
            {Children.map(children, (child, i) =>
                cloneElement(child, { position : [i * xW, 0, 0] })
            )}
        </group>
    )
}
export default ScrollableScene;