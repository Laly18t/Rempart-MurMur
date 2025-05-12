import { Children, cloneElement, useEffect } from "react"
import useAppStore from "../stores/useAppStore"
import { SETTINGS } from "../constants"

const ScrollableScene = ({w = SETTINGS.PORTAL_SIZE.WIDTH, h = SETTINGS.PORTAL_SIZE.HEIGHT, gap = 2, children }) => {
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
export default ScrollableScene