import * as THREE from 'three';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, useGLTF, Sparkles, Gltf } from '@react-three/drei';


const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Texture = new THREE.TextureLoader().load('./textures/grass.jpg');
floor1Texture.wrapS = THREE.RepeatWrapping
floor1Texture.wrapT = THREE.RepeatWrapping
floor1Texture.repeat.set(5, 5)
// const floor1Texture = useTexture('./textures/grass.jpg')
const floor1Material = new THREE.MeshStandardMaterial({map: floor1Texture})
const floor2Material = new THREE.MeshStandardMaterial({map: floor1Texture})
const obstacleMaterial = new THREE.MeshStandardMaterial({color: 'orangered'})
const wallMaterial = new THREE.MeshStandardMaterial({color: 'slategrey'})




function BlockStart({position=[0,0,0]}) {

  
  return (
    <group position={position} >
      <Float floatIntensity={0.5} rotationIntensity={0.5}><Text 
        font='./bebas-neue-v9-latin-regular.woff' 
        scale={0.5}
        maxWidth={0.25}
        lineHeight={0.75}
        textAlign='right'
        rotation-y={-0.25}
        position={[0.75, 0.65, 0]}
        >
          Good Knight Rescue
          <meshBasicMaterial toneMapped={false}/>
        </Text></Float>
      
      <mesh position={[0, -0.1, 0]} geometry={boxGeometry} material={floor1Material} receiveShadow scale={[4, 0.2, 4]} />
      
    </group>
    
  )
}

function BlockEnd({position=[0,0,0]}) {
  const castle = useGLTF('./models/castle.glb')
  castle.scene.children.forEach((child) => {
    child.castShadow = true;
  })
  return (
    <group position={position} >
      <mesh position={[0, 0, 0]} geometry={boxGeometry} material={floor1Material} receiveShadow scale={[4, 0.2, 4]} />
      <RigidBody type='fixed' colliders='hull' position={[0, 0.25, 0]} restitution={0.2} friction={0} >
        <primitive object={castle.scene} scale={4} />
      </RigidBody>
      <Text font='./bebas-neue-v9-latin-regular.woff' scale={1} position={[0, 2.25, 2]}>FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
    </group>
    
  )
}

function BlockSpinner({position=[0,0,0]}) {

  const [speed] = useState(Math.random() + 0.2 * (Math.random() - 0.5 ? -1 : 1))
  const obstacle = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle.current.setNextKinematicRotation(rotation)
  })

  return (
    <group position={position} >
      <mesh position={[0, -0.1, 0]} geometry={boxGeometry} material={floor2Material} receiveShadow scale={[4, 0.2, 4]} />
      <RigidBody type='kinematicPosition' restitution={0.2} friction={0} ref={obstacle}>
        <mesh geometry={boxGeometry} material={obstacleMaterial} receiveShadow castShadow scale={[3.5, 0.3, 0.3]} />
      </RigidBody>
      
    </group>
    
  )
}
function BlockLimbo({position=[0,0,0]}) {
  const gate = useGLTF('./models/gate.glb');
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
  const obstacle = useRef()
  const zOffset = 0;
  const xOffset = -0.6;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + timeOffset) * 0.8 - 1.3
    obstacle.current.setNextKinematicTranslation({x: position[0] + xOffset, y: position[1] + y, z: position[2] + zOffset})
  })

  return (
    <group position={position} >
      <mesh position={[0, -0.1, 0]} geometry={boxGeometry} material={floor2Material} receiveShadow scale={[4, 0.2, 4]} />
      <RigidBody type='kinematicPosition' restitution={0.2} friction={0} ref={obstacle} >
        {/* <mesh geometry={boxGeometry} material={obstacleMaterial} receiveShadow castShadow scale={[3.5, 0.3, 0.3]} /> */}
        <Gltf src='./models/gate.glb' scale={0.15} castShadow/>
      </RigidBody>
      
    </group>
    
  )
}

function BlockAxe({position=[0,0,0]}) {

  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)
  const obstacle = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time + timeOffset) * 1.25
    obstacle.current.setNextKinematicTranslation({x: position[0] + x, y: position[1] + 0.75, z: position[2]})
  })

  return (
    <group position={position} >
      <mesh position={[0, -0.1, 0]} geometry={boxGeometry} material={floor2Material} receiveShadow scale={[4, 0.2, 4]} />
      <RigidBody type='kinematicPosition' restitution={0.2} friction={0} ref={obstacle}>
        <mesh geometry={boxGeometry} material={obstacleMaterial} receiveShadow castShadow scale={[1.5, 1.5, 0.3]} />
      </RigidBody>
      
    </group>
    
  )
}


function Bounds({length = 1}) {
  const bricks = useGLTF('./models/brick.glb')
  const brickMaterial = bricks.materials['Mat.5']
  brickMaterial.map.wrapS = THREE.RepeatWrapping;
  brickMaterial.map.wrapT = THREE.RepeatWrapping;
  brickMaterial.map.repeat.set(20, 2);

  return <>
    <RigidBody type='fixed' restitution={0.2} friction={0}>

      <mesh position={[2.15, 1.3, -(length * 2) + 2]} geometry={boxGeometry} material={brickMaterial}  receiveShadow castShadow scale={[0.3, 3, length * 4]} />
      <mesh position={[-2.15, 1.3, -(length * 2) + 2]} geometry={boxGeometry} material={brickMaterial}  receiveShadow scale={[0.3, 3, length * 4]} />
      <mesh position={[0, 1.3, -(length * 4) + 2]} geometry={boxGeometry} material={brickMaterial}  receiveShadow scale={[4, 3, 0.3]} />
      <CuboidCollider args={[2, 0.1, 2 * length]} position={[0, -0.1, -(length * 2) + 2]} restitution={0.2} friction={1}/>
    </RigidBody>
    
  </>
}

export default function Level({count = 5, types=[BlockSpinner, BlockAxe, BlockLimbo], seed=0}) {


  const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      let rand = randomIntFromInterval(0, types.length-1)
      blocks.push(types[rand])
    }
    return blocks;
  }, [count, types, seed])

  return <>

    <BlockStart position={[0, 0, 0]}/>
    
    {blocks.map((Block, idx) => <Block key={idx} position={[0, 0, -(idx + 1) * 4]}/>)}

    <BlockEnd position={[0, 0, -(count + 1) * 4]} />

    <Bounds length={count + 2}/>
    
  </>
}