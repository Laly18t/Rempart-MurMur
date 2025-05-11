

import { useThree } from "@react-three/fiber"
import { Scroll, ScrollControls } from "./controls/ScrollControls"
import { Children, cloneElement, useEffect } from "react"
import useAppStore from "../stores/useAppStore"

const ScrollableScene = ({ w = 28, h = 1.61803398875, gap = 10, children }) => {
    const setMaxWidth = useAppStore((state) => state.setMaxWidth)
    const { width } = useThree((state) => state.viewport)
    const xW = w + gap

    const totalItems = Children.count(children) - 1
    const pages = (width - xW + totalItems * xW) / width;

    useEffect(() => {
      setMaxWidth((totalItems * xW) - width)
    }, [totalItems, xW, width])

    return (
        <group>
            {Children.map(children, (child, i) =>
                cloneElement(child, { position : [i * xW, 0, 0] })
            )}
        </group>
    )
}
export default ScrollableScene;