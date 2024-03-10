import { useAnimations, useGLTF, useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import useGame from './stores/useGame';
import Ecctrl from "ecctrl";


export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef();
  const parent = useRef();
  const {camera} = useThree();

  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const blocksCount = useGame((state) => state.blocksCount)

  const knight = useGLTF('./models/knight.glb')
  const animations = useAnimations(knight.animations, knight.scene)
  const [animationName, setAnimation] = useState("Armature|idle1")




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
    }
    else {
      setAnimation("Armature|idle")
    }


    /**
     * Phases
     */

    let outOfBounds = parentPosition.y < -4;
    let finished = parentPosition.z < -(blocksCount * 4 + 2)

    if (outOfBounds || finished) {
      end()
    }
      
  })

  return (
    <>
      <Ecctrl
        camInitDir={{ x: 0, y: Math.PI, z: 0 }}
        characterInitDir={Math.PI}
        floatHeight={0}
        ref={parent}
        maxVelLimit={5}
      >
        {<primitive
          ref={body}
          object={knight.scene}
          scale={1.5}
          position={[0, -0.25, 0]} />}
      </Ecctrl>
    </>
   
  )
}