import React, { useRef } from 'react'

import WarMesh from './WarMesh'

export default function WarScene(props) {

    return <group position={[-1,-2, -5]} rotation-y={ -3.14 }>
        <WarMesh />
    </group>
}