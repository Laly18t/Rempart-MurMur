import { useState, useEffect, useRef, forwardRef } from "react";
import { AnimationMixer, MeshBasicMaterial, TextureLoader } from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGLTF, Outlines } from "@react-three/drei";
import { LoopOnce } from "three";

// composants
import InfoBulle from "../../componants/InfoBulle";
import useVoiceOverStore from "../../stores/useVoiceOverStore"; // store
import useSceneStore from "../../stores/useSceneStore";
import usePlaySound from "../../hooks/usePlaySound";
import { cameraZoom } from "../../utils/cameraUtils";
import useFrameAnimation from "../../hooks/useFrameAnimation";

function MedievalScene({ ...props }, ref) {
  const { scene: sceneOn, animations } = useGLTF("/models/scene_1317_v7_a.glb")
  const { scene: sceneOff } = useGLTF("/models/scene_1317_v6_e.glb")
  const { camera, invalidate } = useThree()
  const [useSwitchBaking, setSwitchBaking] = useState(true)

  const groupRef = ref ?? useRef()
  const mixers = useRef([])
  const cameraRefs = useRef({})
  const salleRef = useRef()
  const salleDRef = useRef()
  const lustreRef = useRef()
  const fioleRef = useRef()

  const voiceOver = useVoiceOverStore()
  const { isSceneFinished, index, isPlaying } = useVoiceOverStore()
  const { currentScene, isZoom, setIsZoom } = useSceneStore()


  const [visible, setVisible] = useState(false)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [showLustreOutline, setShowLustreOutline] = useState(false)
  const [showFioleOutline, setShowFioleOutline] = useState(false)

  const playCandles = usePlaySound("/audio/sounds/bougie.wav")
  const playPoison = usePlaySound("/audio/sounds/fiole.mp3")
  const playFire = usePlaySound("/audio/sounds/explosion_1317_v2.mp3")

  const backButton = useLoader(TextureLoader, "/ui/icons/fleche_gauche.svg")
  const peopleFrames = [
    '/animations/medieval/1317_1.png',
    '/animations/medieval/1317_2.png',
    '/animations/medieval/1317_3.png',
    '/animations/medieval/1317_2.png',
  ]
  const {
    currentTexture: animatedPeopleTexture,
  } = useFrameAnimation(peopleFrames, 0.5, true, true)
  let firstClick = 0

  // Fonction pour forcer la mise à jour des InfoBulles
  const forceInfoBulleUpdate = () => {
    setForceUpdate(prev => prev + 1)
    invalidate() // Forcer le re-render de Three.js
  }

  // gestion des cameras
  useEffect(() => {
    const currentScene = useSwitchBaking ? sceneOff : sceneOn

    currentScene.traverse((child) => {
      if (child.isMesh) {
        const oldMaterial = child.material

        // On récupère la texture map de l'ancien matériau
        const bakedTexture = oldMaterial.map

        child.material = new MeshBasicMaterial({
          map: bakedTexture,
          transparent: oldMaterial.transparent,
          opacity: oldMaterial.opacity,
        })

        child.castShadow = false
        child.receiveShadow = false

        if (child.name === "EXPORT_LUSTRE") {
          lustreRef.current = child
          setShowLustreOutline(true)
        }
        if (child.name === "EXPORT_FIOLE" && useSwitchBaking) {
          fioleRef.current = child
          setShowFioleOutline(true)
        }
      }

      if (child.name.endsWith("_1")) {
        //Camera generale
        cameraRefs.current.camera1 = child
      } else if (child.name.endsWith("_2")) {
        //Camera lustre
        cameraRefs.current.camera2 = child
      } else if (child.name.endsWith("_3")) {
        //Camera fiole
        cameraRefs.current.camera3 = child
      }
    })

    if (groupRef.current && cameraRefs.current.camera1) {
      groupRef.current.mainCamera = cameraRefs.current.camera1 // camera par defaut
    }
  }, [useSwitchBaking])

  // mixer pour animation
  useFrame((state, delta) => {
    mixers.current.forEach(({ mixer }) => mixer.update(delta))
  })

  const handleClick = (e) => {
    const clickedObject = e.object
    console.log("Objet cliqué:", clickedObject.name)
    setVisible(false)

    // action 1 - allumer la lumiere
    if (clickedObject.name === "EXPORT_LUSTRE" && !isPlaying) {
      console.log("Lustre cliqué")
      setShowLustreOutline(false)
      setVisible(true)
      setIsZoom(true)

      if (isZoom && !isPlaying) {
        handleZoom()
      } else {
        cameraZoom(
          camera,
          cameraRefs.current.camera2,
          () => {
            if (firstClick !== 0) {
              console.log("Lustre déjà allumé")
            } else {
              firstClick += 1
              playCandles.play() // bruitage bougie
              setSwitchBaking((prev) => !prev)
              voiceOver.setIndex(1)
              setTimeout(handleZoom(), 2000)
            }
            // Force update final après l'animation
            setTimeout(forceInfoBulleUpdate, 100)
          },
          props.portalGroupRef.current,
          forceInfoBulleUpdate
        )
      }
    }

    // action 2 - trouver le poison
    if (clickedObject.name === "EXPORT_FIOLE" && !isPlaying) {
      console.log("Fiole cliquée")
      if (isZoom && !isPlaying) {
        console.log('déjà zoomé sur le livre')
      } else {
        setShowFioleOutline(false)
        setVisible(false)
        setIsZoom(true)
        voiceOver.setIndex(2)

        cameraZoom(
          camera,
          cameraRefs.current.camera3,
          () => {

            const clip = animations.find((a) => a.name === "animation_0")
            const target = sceneOn.getObjectByName("EXPORT_FIOLE")

            if (clip && target) {
              const mixer = new AnimationMixer(target)
              const action = mixer.clipAction(clip)
              action.setLoop(LoopOnce, 1)
              action.clampWhenFinished = true
              action.reset().play()
              playPoison.play() // bruitage fiole

              const onFinished = () => {
                console.log('Animation terminée')
                handleZoom()
              }

              // Ajouter le mixer pour mise à jour via useFrame
              mixers.current.push({ mixer, action })

              // Force update final après l'animation
              setTimeout(forceInfoBulleUpdate, 100)

              mixer.addEventListener('finished', onFinished)

              return () => {
                mixer.removeEventListener('finished', onFinished)
              }
            }
          },
          props.portalGroupRef.current,
          forceInfoBulleUpdate
        )
      }
    }
  }

  // Switch de murs
  useEffect(() => {
    if (salleRef.current && salleDRef.current) {
      if (!isSceneFinished) {
        salleRef.current.visible = true
        salleDRef.current.visible = false
      }
      if (index === 2) {
        setTimeout(() => {
          playFire.play() // bruitage explosiont
          console.log("switch", salleRef.current.visible)
          salleRef.current.visible = false
          salleDRef.current.visible = true
          setVisible(false)
        }, 3000)
      }
    }
  }, [currentScene, isSceneFinished, index, useSwitchBaking])
  useEffect(() => {
    if (sceneOn) {
      salleRef.current = sceneOn.getObjectByName("EXPORT_SALLE")
      salleDRef.current = sceneOn.getObjectByName("EXPORT_SALLE_D")
    }
  }, [sceneOn])

  const handleZoom = () => {
    cameraZoom(
      camera,
      cameraRefs.current.camera1,
      () => {
        // Force update final après retour
        setTimeout(forceInfoBulleUpdate, 100)
      },
      props.portalGroupRef.current,
      forceInfoBulleUpdate
    )
    setVisible(true)
    setIsZoom(false)
  }

  return (<>

    <group
      position={[0, -2, -1]}
      rotation-y={-3.1}
      ref={groupRef}
      {...props}
      dispose={null}
      onClick={handleClick}
    >
      {useSwitchBaking && (
        <>
          {/* Outline pour le lustre */}
          {lustreRef.current && (
            <>
              <primitive castShadow receiveShadow object={lustreRef.current}>
                <Outlines
                  visible={showLustreOutline}
                  color="white"
                  thickness={4}
                  opacity={1}
                  transparent={false}
                  angle={Math.PI}
                />
              </primitive>
            </>
          )}
        </>
      )}
      {!useSwitchBaking && (
        <>
          {/* Salle avec lumiere */}
          <primitive object={sceneOn} />

          <>
            {/* Outline pour le poison */}
            {fioleRef.current && (
              <>
                <primitive castShadow receiveShadow visible={showFioleOutline} object={fioleRef.current}>
                  <Outlines
                    color="white"
                    thickness={4}
                    opacity={1}
                    transparent={false}
                    angle={Math.PI}
                  />
                </primitive>
              </>
            )}
          </>

          <mesh position={[0.2, 1.2, 0.2]} rotation-y={-3.14}>
            <boxGeometry args={[1.5, 2.2, 0.00001]} />
            <meshBasicMaterial map={animatedPeopleTexture} transparent={true} />
          </mesh>

          {currentScene === "monde-medieval" && visible && (
            <>
              <InfoBulle
                position={[6.3, 3, 1.6]}
                className="medievalBulle"
                title="Les murs en disent long"
                content="À cette époque, les murs en pierre étaient recouverts de lourdes tentures pour bloquer le froid et couper les bruits. Mais attention, ce n’était pas juste pour l’isolation : chaque tapisserie était un symbole de richesse. Entre scènes religieuses, héraldiques ou épiques, elles montraient non seulement le bon goût du seigneur, mais aussi son pouvoir."
              />
              <InfoBulle
                position={[0.7, 1, 1.6]}
                className="medievalBulle"
                title="Ta chaise dit tout de toi"
                content="À cette époque, les murs en pierre étaient recouverts de lourdes tentures pour bloquer le froid et couper les bruits. Mais attention, ce n’était pas juste pour l’isolation : chaque tapisserie était un symbole de richesse. Entre scènes religieuses, héraldiques ou épiques, elles montraient non seulement le bon goût du seigneur, mais aussi son pouvoir."
              />
            </>
          )}
        </>
      )}

      {/* Salle sans lumiere */}
      {useSwitchBaking && <primitive object={sceneOff} />}

    </group>
  </>);
}

export default forwardRef(MedievalScene);

useGLTF.preload("/models/scene_1317_v7_a.glb");
useGLTF.preload("/models/scene_1317_v6_e.glb");
