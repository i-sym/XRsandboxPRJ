"use client";

import { GltfModel } from "@/components/xr/mesh-loader";
import { Box, Grid, OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ARButton, Hands, RayGrab, XR } from "@react-three/xr";
import { useEffect, useState } from "react";



import * as THREE from "three";

type PistonState = {
    extension: number; // 0 to 1
}

type PistonProps = {
    state: PistonState;
    position: [number, number, number];
    rotation: [number, number, number];
}

function Piston(props: PistonProps) {
    const { state, position, rotation } = props;


    return <group position={position} scale={0.001} rotation={rotation}>
        <GltfModel gltfUrl="/models/piston.glb" position={[-70, 0, 0]} />
        <GltfModel gltfUrl="/models/cylinder.glb" position={[0, 0, 0]} rotation={[0, 0, 0]} />
    </group>;
}

function Garage(props) {

    const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/barn/model.gltf')
    return <primitive object={scene} {...props} />

}

export default function DebugPage() {

    const [state, setState] = useState(0);


    useEffect(() => {
        console.log("DebugPage mounted");
        return () => {
            console.log("DebugPage unmounted");
        };
    }, [state]);


    return (
        <div className="w-full h-full min-h-screen bg-gray-100">
            <ARButton
                sessionInit={{ requiredFeatures: ['hit-test', 'hand-tracking', 'local-floor'] }}
            />
            <Canvas shadows>
                <XR>
                    <Environment preset="city" background blur={1} />

                    <Hands modelLeft='https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/skeleton-left-hand-webxr/model.gltf'
                        modelRight='https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/right-hand-black-webxr-tracking-ready/model.gltf'
                    />
                    <ambientLight intensity={0.5} castShadow />


                    {/* Background  color*/}
                    <color attach="background" args={['#010101']} />
                    <OrbitControls />
                    {/* White plane as a floor */}
                    {/* <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                        <planeGeometry args={[100, 100]} />
                        <meshStandardMaterial color="white" />
                    </mesh> */}
                    <gridHelper args={[10, 10]} />
                    <GltfModel gltfUrl="/models/Table.glb" position={[0, 0, -1]} scale={0.015} rotation={[Math.PI / 2, 0, 0]} />
                    <GltfModel gltfUrl="/models/Button - red.glb" position={[0, 0, 2]} scale={0.001} rotation={[0, 0, 0]} />

                    <GltfModel gltfUrl="/models/SAI2092.glb" position={[0, 0.7, 2]} scale={0.001} rotation={[0, 0, 0]} />
                    <RayGrab>
                        <Piston state={{ extension: 0.5 }} position={[0, 0.3, 2]} rotation={[0, 0, 0]} />
                    </RayGrab>
                    <RayGrab>
                        <Piston state={{ extension: 0.5 }} position={[0, 0.5, 2]} rotation={[0, 0, 0]} />
                    </RayGrab>
                    <RayGrab>
                        <Piston state={{ extension: 0.5 }} position={[0, 0.7, 2]} rotation={[0, 0, 0]} />
                    </RayGrab>
                    {/* <Model1 position={[0, 0, 2]} scale={1} rotation={[0, 0, 0]} /> */}
                    <Garage position={[0, 0, 0]} scale={3} rotation={[0, 0, 0]} />
                </XR>
            </Canvas>
        </div>
    );
}

function JustAComponent() {
    return <div>Just a component</div>;
}