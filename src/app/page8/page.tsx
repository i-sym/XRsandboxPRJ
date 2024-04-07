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

import React from 'react';
import { VRButton, ARButton, XR, Controllers, Hands, XREvent, XRManagerEvent, Interactive } from '@react-three/xr';
import { Center, Html, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { RayGrab } from '@react-three/xr';
import { Vector3 } from 'three/src/math/Vector3.js';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { AmbientLight, BoxGeometry, DirectionalLight } from 'three';


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
        const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/palm-long/model.gltf')
        return <primitive object={scene} {...props} />
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
    return (
        <>
            <ARButton
                sessionInit={{
                    requiredFeatures: ['hit-test', 'hand-tracking'],
                    optionalFeatures: ['dom-overlay'],

                }}
            />
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 10, 5]} intensity={1} />
                <XR
                    foveation={0}
                    frameRate={72 | 90 | 120}
                    referenceSpace="local-floor"
                >
                    {/* <Controllers
                        rayMaterial={{ color: 'blue' }}
                        hideRaysOnBlur={false}
                        envMap={undefined}
                        envMapIntensity={1}
                    /> */}
                    <Hands modelLeft='https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/left-hand-black-webxr-tracking-ready/model.gltf' modelRight='https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/right-hand-black-webxr-tracking-ready/model.gltf' />
                    {/* {cubes.map((cube, index) => (
                        <RayGrab key={index}>
                            <mesh
                                position={new Vector3(...cube.position)}
                                castShadow
                                receiveShadow
                                onClick={() => {
                                    const newCubes = [...cubes];
                                    newCubes.splice(index, 1);
                                    setCubes(newCubes);
                                }}
                            >
                                <boxGeometry args={[0.3, 0.3, 1.2]} />
                                <meshStandardMaterial color={cube.color} />
                            </mesh>
                        </RayGrab>
                    ))} */}


                    <Interactive>
                        <mesh position={[1, 1, 1]}>
                            <boxGeometry args={[0.5, 0.5, 0.5]} />
                        </mesh>
                    </Interactive>

                    {/* Hand grab object */}

                    <RayGrab>
                        <mesh scale={0.8}>
                            <Axe />
                        </mesh>
                    </RayGrab>

                    <RayGrab>
                        <mesh scale={0.6}>
                            <Table />
                        </mesh>
                    </RayGrab>
                    <RayGrab>
                        <mesh scale={0.1}>
                            <Laptop />
                        </mesh>
                    </RayGrab>

                    {/* 
                    <RayGrab>
                        <mesh scale={0.1}>
                            <Model />
                        </mesh>
                    </RayGrab>
                    <RayGrab>
                        <mesh scale={0.8}>
                            <Axe />
                        </mesh>
                    </RayGrab>
                    <RayGrab>
                        <mesh scale={0.6}>
                            <Table />
                        </mesh>
                    </RayGrab>
                    
                    <RayGrab>
                        <mesh scale={0.1}>
                            <Anvil />
                        </mesh>
                    </RayGrab>
                    <RayGrab>
                        <mesh scale={0.1}>
                            <Nes />
                        </mesh>
                    </RayGrab>
                    <RayGrab>
                        <mesh scale={0.1}>
                            <NesController />
                        </mesh>
                    </RayGrab> */}


                </XR>
            </Canvas>
        </>
    );
}