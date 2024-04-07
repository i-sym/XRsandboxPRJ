'use client';
import React from 'react';
import { VRButton, ARButton, XR, Controllers, Hands, XREvent, XRManagerEvent } from '@react-three/xr';
import { Canvas, useFrame } from '@react-three/fiber';
import { RayGrab } from '@react-three/xr';
import { Vector3 } from 'three/src/math/Vector3.js';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { AmbientLight, BufferGeometry, DirectionalLight, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from 'three';
import { Physics, useBox, usePlane } from '@react-three/cannon';



export default function ARPage() {

    function Cube(props: any) {
        const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], ...props }))
        return (
            <mesh ref={ref as React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
            </mesh>
        )
    }
    function Plane(props: any) {
        const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
        return (
            <mesh ref={ref as React.MutableRefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>} >
                <planeGeometry args={[100, 100]} />
            </mesh>
        )
    }

    const [cubes, setCubes] = React.useState([
        { position: [0, 0, 0], color: 'red' },
        { position: [1, 0, 0], color: 'green' },
        { position: [0, 1, 0], color: 'blue' },
        { position: [1, 1, 0], color: 'yellow' },
    ]);

    const handleKeyPress = React.useCallback((event: XREvent<any> & { type: string }) => {
        if (event.type === 'keydown' && event.nativeEvent.code === 'KeyA') {
            setCubes([...cubes, { position: [0, 0, 0], color: 'red' }]);
        }
    }, [cubes]);

    return (
        <>
            <ARButton />
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[0, 10, 5]} intensity={1} />
                <XR
                    foveation={0}
                    frameRate={72 | 90 | 120}
                    referenceSpace="local-floor"
                >
                    <Controllers
                        rayMaterial={{ color: 'blue' }}
                        hideRaysOnBlur={false}
                        envMap={undefined}
                        envMapIntensity={1}
                    />
                    <Hands
                        modelLeft='shoe-draco.glb'
                        modelRight='shoe-draco.glb'
                    />
                    <Physics>
                        {cubes.map((cube, index) => (
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
                                    <Cube />
                                    <meshStandardMaterial color={cube.color} />
                                </mesh>
                            </RayGrab>
                        ))}
                        <Plane />
                    </Physics>
                </XR>
            </Canvas>
        </>
    );
}
