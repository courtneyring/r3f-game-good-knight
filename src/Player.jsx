import { useAnimations, useGLTF, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, useRapier } from '@react-three/rapier';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import useGame from './stores/useGame';

export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const body = useRef();
  const {rapier, world} = useRapier();
  const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3())
  const start = useGame((state) => state.start)
  const end = useGame((state) => state.end)
  const restart = useGame((state) => state.restart)
  const phase = useGame((state) => state.phase)
  const blocksCount = useGame((state) =>  state.blocksCount)
  const knight = useGLTF('./models/rogue_legacy_knight.glb')
  const animations = useAnimations(knight.animations, knight.scene)
  const [animationName, setAnimation] = useState("Armature|idle1")

  const SPEED = 2
  const direction = new THREE.Vector3()
  const frontVector = new THREE.Vector3()
  const sideVector = new THREE.Vector3()
  const rotation = new THREE.Vector3()

  const jump = () => {
    // const origin = body.current.translation();
    // origin.y -= 0.31;
    // const direction = { x: 0, y: -1, z: 0}
    // const ray = new rapier.Ray(origin, direction);
    // const hit = world.castRay(ray, 10, true)
    // console.log(hit)

    // if (hit.toi < 0.15) {
    //   body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    // }
  }

  const reset = () => {
    body.current.setTranslation({x:0, y:3, z:0})
    body.current.setLinvel({x:0, y:0, z:0})
    body.current.setAngvel({x:0, y:0, z:0})
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
      (value) => {if (value=='ready') reset()}
    )
    
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump, 
      (value) => {if (value) jump()}
    )
    
    const unsubscribeAny = subscribeKeys(
      () => start()
    )
      
    return () => {
      // unsubscribeJump();
      unsubscribeAny();
      unsubscribeReset();
    }


  }, [])

  useFrame((state, delta) => {

    const {forward, backward, leftward, rightward, jump} = getKeys();
    const velocity = body.current.linvel();
    frontVector.set(0, 0, backward - forward)
    sideVector.set(leftward - rightward, 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
    body.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z })
    const ray = world.castRay(new rapier.Ray(body.current.translation(), { x: 0, y: -1, z: 0 }))
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
    if (jump && grounded) body.current.setLinvel({ x: 0, y: 7.5, z: 0 })


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
     * Camera
     */
    const bodyPosition = body.current.translation();
    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y +=0.65
    
    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)


    /**
     * Phases
     */
    if (bodyPosition.z < -(blocksCount * 4 +2))
      end()

    if(bodyPosition.y < -4)
      restart()



  })

  return <>
    <RigidBody position={[0, 0.5, 0]} colliders={false} restitution={0.2} friction={1} canSleep={false} ref={body} linearDamping={0.5} angularDamping={0.5} type='dynamic' enabledRotations={[false, false, false]}>
      <CuboidCollider args={[0.08, 0.2, 0.08]} position={ [ 0, 0.1, 0 ] }/>
      <primitive object={knight.scene} scale={0.5} rotation={[0, Math.PI, 0]}/>
    </RigidBody>
    
  </>
}