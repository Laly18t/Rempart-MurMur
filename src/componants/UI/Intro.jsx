import { Text, Html } from "@react-three/drei"
import Lottie from 'react-lottie'
import { useEffect, useState } from "react"
import { LottieLoader } from 'three/examples/jsm/loaders/LottieLoader.js'
import * as THREE from 'three'
import animationData from '../../lotties/joy.json'


export default function Intro() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    
        
    return <>
        {/* bouton pour le son - TODO: refonte graphique */}
        <group>
          <Text position={[-2, -2, 0]} color={'red'} fontSize={0.7} anchorY="top" anchorX="left" lineHeight={0.8} >
              Introduction
          </Text>
          
          <Html transform position={[0, 1, 0]} distanceFactor={2} zIndexRange={[100, 0]}>
              <div style={{ width: 1000, height: 1000, background: 'transparent', zIndex: 10, }}>
                  <Lottie animationData={animationData} loop autoplay  options={defaultOptions} style={{ background: 'transparent' }} />
              </div>
          </Html>
        </group>
    </>
}