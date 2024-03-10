import { Gltf, OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier'
import Lights from './Lights.jsx'
import Level from './Level.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.js'

// import Controller from 'ecctrl'
import { useControls } from 'leva'
import { useRef } from 'react'



export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);
  const phase = useGame((state) => state.phase)

  useFrame((state) => {
    if (phase == 'ended') {
      state.camera.position.set(0, 2, 0)
      state.camera.lookAt(0, 2, -4)
    }
  })


  return <>
    <OrbitControls makeDefault />
    <color args={['#bdedfc']} attach='background' />
    <Physics debug>
      <Lights />
      <Level count={blocksCount} seed={blocksSeed} />
      {phase != 'ended' &&<Player />}
    </Physics>
  </>
}
