import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { Plane, shaderMaterial } from '@react-three/drei'

// composant pour faire une transition fluide
export default function Transition ({ sceneA, sceneB, texture, transitionParams }){
    const materialRef = useRef()
    const { size } = useThree()

    // charge la texture
    const transitionTexture = useMemo(() => new THREE.TextureLoader().load(texture), [texture])

    // animation de mix
    useFrame(({ clock }) => {
        if (transitionParams.animateTransition) {
            const t = (1 + Math.sin((transitionParams.transitionSpeed * clock.getElapsedTime()) / Math.PI)) / 2
            transitionParams.transition = THREE.MathUtils.smoothstep(t, 0.3, 0.7)
        }

        if (materialRef.current) {
            materialRef.current.mixRatio = transitionParams.transition
        }
    })

    // TODO : clean
    if (!sceneA?.fbo?.texture || !sceneB?.fbo?.texture) return null

    return (
        <Plane args={[size.width, size.height]}>
            <transitionMaterial
                ref={materialRef}
                tDiffuse1={sceneA.fbo.texture}
                tDiffuse2={sceneB.fbo.texture}
                tMixTexture={transitionTexture}
                threshold={transitionParams.threshold}
                useTexture={transitionParams.useTexture ? 1 : 0}
            />
        </Plane>
    )
}


// shader pour la transition
const TransitionMaterial = shaderMaterial(
    {
        tDiffuse1: null,
        tDiffuse2: null,
        mixRatio: 0.0,
        threshold: 0.1,
        useTexture: 1,
        tMixTexture: null,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float mixRatio;
    uniform sampler2D tDiffuse1;
    uniform sampler2D tDiffuse2;
    uniform sampler2D tMixTexture;
    uniform int useTexture;
    uniform float threshold;
    varying vec2 vUv;

    void main() {
      vec4 texel1 = texture2D(tDiffuse1, vUv);
      vec4 texel2 = texture2D(tDiffuse2, vUv);

      if (useTexture == 1) {
        vec4 transitionTexel = texture2D(tMixTexture, vUv);
        float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
        float mixf = clamp((transitionTexel.r - r) * (1.0 / threshold), 0.0, 1.0);
        gl_FragColor = mix(texel1, texel2, mixf);
      } else {
        gl_FragColor = mix(texel1, texel2, mixRatio);
      }
    }
  `
)
extend({ TransitionMaterial })