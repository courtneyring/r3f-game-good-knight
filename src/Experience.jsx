import { OrbitControls, Sparkles, Sky } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier'
import Lights from './Lights.jsx'
import Level from './Level.jsx'
import Player from './Player.jsx'
import useGame from './stores/useGame.js'
import { useState } from 'react';

export default function Experience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);
  const showLevel = useGame((state) => state.showLevel)


  return <>
    <Sky inclination={0} azimuth={0.25} turbidity={0} rayleigh={2} exposure={0.3} />
    <Sparkles count={5000} scale={100} size={6} speed={0.4} />

    <Physics >
      <Lights />
      {showLevel && <>
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </>}
    </Physics>
  </>
}
