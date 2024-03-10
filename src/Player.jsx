import { useAnimations, useGLTF, useKeyboardControls, Gltf } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState, useReducer } from 'react';
import useGame from './stores/useGame';
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';



export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef();
  const parent = useRef();

  const start = useGame((state) => state.start)
  const restart = useGame((state) => state.restart)
  const end = useGame((state) => state.end)
  const blocksCount = useGame((state) => state.blocksCount)

  const knight = useGLTF('./models/knight.glb')
  const animations = useAnimations(knight.animations, knight.scene)
  const [animationName, setAnimation] = useState("Armature|idle1")
  const [, forceUpdate] = useReducer(x => x + 1, 0);


  const reset = () => {

  }

  useEffect(() => {
    const action = animations.actions[animationName]
    action?.reset().fadeIn(0.5).play()

    return () => {
      action?.fadeOut(0.5)
    }
  }, [animationName])

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => { if (value == 'ready') reset() }
    )
    const unsubscribeAny = subscribeKeys(
      () => start()
    )

    return () => {
      unsubscribeAny();
      unsubscribeReset();
    }
  }, [])

  useFrame(() => {

    const { forward, backward, leftward, rightward, jump } = getKeys();
    let parentPosition = parent.current.translation()

    /**
     * Animations
     */

    if (forward || backward || leftward || rightward) {
      setAnimation("Armature|running")
    }
    else if (jump) {
      setAnimation("Armature|slash")
      // parent.current.setTranslation({x: 0, y: 0, z:0})
    }
    else {
      setAnimation("Armature|idle")
    }


    /**
     * Phases
     */

    let outOfBounds = parentPosition.y < -4;
    let finished = parentPosition.z < -(blocksCount * 4 + 2)
    if (outOfBounds || finished) end()
      
  })

  return (
    <Ecctrl
      camInitDir={{ x: 0, y: Math.PI, z: 0 }}
      characterInitDir={Math.PI}
      floatHeight={0}
      ref={parent}
    >
      {<primitive
        ref={body}
        object={knight.scene}
        scale={1.5}
        position={[0, -0.25, 0]} />}
    </Ecctrl>
  )
}