'use client';
// import { Canvas, LoaderProto, extend, useThree } from "@react-three/fiber";

// import { Box } from '@react-three/drei';
// import { ARButton, Controllers, VRButton, XR } from '@react-three/xr';
// import { Suspense, useState } from "react";
// import { XRController } from '@react-three/xr';
// import { Texture } from "three/src/textures/Texture.js";

// export default function ARPage() {
//   return (
//     <div id="canvas-container" style={{ width: '100vw', height: '100vh' }}>
//       {/* Simple AR scene with cube */}
//       <ARButton />

//       <Canvas>
//         <XR>
//           {/* Your scene content */}
//           <Box args={[1, 1, 1]} position={[0, 1, 0]} castShadow receiveShadow />

//           {/* <XRController>
//             {(controller: { ray: any; }) => {
//               const { scene } = useThree();
//               const { ray } = controller;
//               const [hovered, setHovered] = useState(false);
//               const [active, setActive] = useState(false);

//               // Ray grabbing logic here

//               return (
//                 <group>
//                   <mesh
//                     visible={!active}
//                     onPointerOver={() => setHovered(true)}
//                     onPointerOut={() => setHovered(false)}
//                     onClick={() => setActive(!active)}
//                     position={ray.origin}
//                     scale={hovered ? [1.5, 1.5, 1.5] : [1, 1, 1]}
//                   >
//                     <boxGeometry args={[0.1, 0.1, 0.1]} />
//                     <meshStandardMaterial color={hovered ? 'red' : 'blue'} />
//                   </mesh>
//                 </group>
//               );
//             }}
//           </XrController> */}

//           <Controllers
//             /** Optional material props to pass to controllers' ray indicators */
//             rayMaterial={{ color: 'blue' }}
//             /** Whether to hide controllers' rays on blur. Default is `false` */
//             hideRaysOnBlur={false}
//             /**
//              * Optional environment map to apply to controller models.
//              * Useful for make controllers look more realistic
//              * if you don't want to apply an env map globally on a scene
//              */
//             envMap={Texture}
//             /**
//              * Optional environment map intensity to apply to controller models.
//              * Useful for tweaking the env map intensity if they look too bright or dark
//              */
//             envMapIntensity={1}
//           />

//         </XR>
//       </Canvas>

//     </div >
//   );
// }

import React, { useRef } from 'react';
import { VRButton, ARButton, XR, Controllers, Hands, XREvent, XRManagerEvent } from '@react-three/xr';
import { Box, Html, useGLTF, QuadraticBezierLine, RandomizedLight, AccumulativeShadows } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { RayGrab } from '@react-three/xr';
import { Vector3 } from 'three/src/math/Vector3.js';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { AmbientLight, BoxGeometry, DirectionalLight } from 'three';
import { NiceLight } from '@/components/xr/nice-environment';

import * as THREE from 'three';


export default function ARPage() {

  const [cubes, setCubes] = React.useState([
    { position: [0, 0, 0], color: 'pink' },
    { position: [1, 0, 0], color: 'white' },
    { position: [0, 1, 0], color: 'white' },
  ]);

  const handleKeyPress = React.useCallback((event: XREvent<any> & { type: string }) => {
    if (event.type === 'keydown' && event.nativeEvent.code === 'KeyA') {
      setCubes([...cubes, { position: [0, 0, 0], color: 'red' }]);
    }
  }, [cubes]);

  function Model(props: any) {
    const gltf = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/palm-long/model.gltf')
    console.log(gltf)

    return <primitive object={gltf.scene} {...props} />
  }

  function Axe(props: any) {
    const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/double-axe/model.gltf')
    return <primitive object={scene} {...props} />
  }

  function Table(props: any) {
    const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/desk/model.gltf')
    return <primitive object={scene} {...props} />
  }

  function Laptop(props: any) {
    const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf')
    return <primitive object={scene} {...props} />
  }


  function Anvil(props: any) {
    const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/anvil/model.gltf')
    return <primitive object={scene} {...props} />
  }


  function Nes(props: any) {
    const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/nes/model.gltf')
    return <primitive object={scene} {...props} />
  }


  function NesController(props: any) {
    const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/nes-controller/model.gltf')
    return <primitive object={scene} {...props} />
  }

  function Cable({ start, end, v1 = new THREE.Vector3(0,0,0.1), v2 = new THREE.Vector3(0,0,-0.1) }) {
    const ref = useRef()
    useFrame(() => ref.current.setPoints(start.current.getWorldPosition(v1), end.current.getWorldPosition(v2)), [])
    return <QuadraticBezierLine ref={ref} lineWidth={3} color="#ff2060" />
  }

  const cube = useRef()
  const cube2 = useRef()
  return (
    <>


      <ARButton
        sessionInit={{
          requiredFeatures: ['hit-test', 'hand-tracking'],
          optionalFeatures: ['dom-overlay'],
        }}
      />
      <Canvas
        shadows
      >
        <AccumulativeShadows temporal frames={100} scale={10}>
          <RandomizedLight amount={8} position={[5, 5, -10]} />
        </AccumulativeShadows>
        <NiceLight />
        <XR
          foveation={0}
          referenceSpace="local-floor">
          <Hands
            modelLeft='https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/skeleton-left-hand-webxr/model.gltf'
            modelRight='https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/right-hand-black-webxr-tracking-ready/model.gltf'
          />
          <RayGrab>
            <mesh ref={cube} position={[1, 1, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
            </mesh>
          </RayGrab>
          <RayGrab>
            <mesh ref={cube2} position={[0, 1, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.1]} />
            </mesh>
          </RayGrab>
          <Cable start={cube} end={cube2} />
        </XR>
      </Canvas>
    </>
  );
}