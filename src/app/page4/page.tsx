
'use client';
import React, { useEffect } from 'react';

import { Canvas, useFrame } from '@react-three/fiber';
import { RayGrab } from '@react-three/xr';
import { Vector3 } from 'three/src/math/Vector3.js';
import { MeshStandardMaterial } from 'three/src/materials/MeshStandardMaterial.js';
import { AmbientLight, BufferGeometry, DirectionalLight, Group, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from 'three';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

import { HTMLMesh } from 'three/addons/interactive/HTMLMesh.js';
import { InteractiveGroup } from 'three/addons/interactive/InteractiveGroup.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

const ComponentWithHtml = () => {
    let camera, scene, renderer;
    let reflector;
    let stats, statsMesh;

    const parameters = {
        radius: 0.6,
        tube: 0.2,
        tubularSegments: 150,
        radialSegments: 20,
        p: 2,
        q: 3,
        thickness: 0.5
    };

    init();
    animate();

    function init() {

        scene = new THREE.Scene();


        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
        camera.position.set(0, 1.6, 1.5);

        // 

        const torusGeometry = new THREE.TorusKnotGeometry(...Object.values(parameters));
        const torusMaterial = new THREE.MeshPhysicalMaterial({
            transmission: 1.0, roughness: 0, metalness: 0.25, thickness: 0.5, side: THREE.DoubleSide
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.name = 'torus';
        torus.position.y = 1.5;
        torus.position.z = - 2;
        scene.add(torus);

        const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 50);
        const cylinderMaterial = new THREE.MeshStandardMaterial();
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.position.z = - 2;
        scene.add(cylinder);


        //

        reflector = new Reflector(new THREE.PlaneGeometry(2, 2), {
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio
        });
        reflector.position.x = 1;
        reflector.position.y = 1.5;
        reflector.position.z = - 3;
        reflector.rotation.y = - Math.PI / 4;
        // TOFIX: Reflector breaks transmission
        // scene.add( reflector );

        const frameGeometry = new THREE.BoxGeometry(2.1, 2.1, 0.1);
        const frameMaterial = new THREE.MeshPhongMaterial();
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.z = - 0.07;
        reflector.add(frame);

        //

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.autoClear = false;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        document.body.appendChild(renderer.domElement);

        document.body.appendChild(ARButton.createButton(renderer));

        window.addEventListener('resize', onWindowResize);

        //

        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 5)]);

        const controller1 = renderer.xr.getController(0);
        controller1.add(new THREE.Line(geometry));
        scene.add(controller1);

        const controller2 = renderer.xr.getController(1);
        controller2.add(new THREE.Line(geometry));
        scene.add(controller2);

        //

        const controllerModelFactory = new XRControllerModelFactory();

        const controllerGrip1 = renderer.xr.getControllerGrip(0);
        controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
        scene.add(controllerGrip1);

        const controllerGrip2 = renderer.xr.getControllerGrip(1);
        controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
        scene.add(controllerGrip2);

        // GUI

        function onChange() {

            torus.geometry.dispose();
            torus.geometry = new THREE.TorusKnotGeometry(...Object.values(parameters));

        }

        function onThicknessChange() {

            torus.material.thickness = parameters.thickness;

        }

        const gui = new GUI({ width: 300 });
        gui.add(parameters, 'radius', 0.0, 1.0).onChange(onChange);
        gui.add(parameters, 'tube', 0.0, 1.0).onChange(onChange);
        gui.add(parameters, 'tubularSegments', 10, 150, 1).onChange(onChange);
        gui.add(parameters, 'radialSegments', 2, 20, 1).onChange(onChange);
        gui.add(parameters, 'p', 1, 10, 1).onChange(onChange);
        gui.add(parameters, 'q', 0, 10, 1).onChange(onChange);
        gui.add(parameters, 'thickness', 0, 1).onChange(onThicknessChange);
        gui.domElement.style.visibility = 'hidden';

        const group = new InteractiveGroup();
        group.listenToPointerEvents(renderer, camera);
        group.listenToXRControllerEvents(controller1);
        group.listenToXRControllerEvents(controller2);
        scene.add(group);

        const mesh = new HTMLMesh(gui.domElement);
        mesh.position.x = - 0.75;
        mesh.position.y = 1.5;
        mesh.position.z = - 0.5;
        mesh.rotation.y = Math.PI / 4;
        mesh.scale.setScalar(2);
        group.add(mesh);


        // Add stats.js
        stats = new Stats();
        stats.dom.style.width = '80px';
        stats.dom.style.height = '48px';
        document.body.appendChild(stats.dom);

        statsMesh = new HTMLMesh(stats.dom);
        statsMesh.position.x = - 0.75;
        statsMesh.position.y = 2;
        statsMesh.position.z = - 0.6;
        statsMesh.rotation.y = Math.PI / 4;
        statsMesh.scale.setScalar(2.5);
        group.add(statsMesh);

        // Hello world card
        const card = document.createElement('div');
        card.style.width = '256px';
        card.style.height = '128px';
        card.style.backgroundColor = 'white';
        card.style.color = 'black';
        card.style.padding = '20px';
        card.style.borderRadius = '10px';
        card.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        card.textContent = 'Hello, WebXR!';
        document.body.appendChild(card);

        const cardMesh = new HTMLMesh(card);
        cardMesh.position.x = 1;
        cardMesh.position.y = 1.5;
        cardMesh.position.z = - 2;
        cardMesh.rotation.y = - Math.PI / 4;
        cardMesh.scale.setScalar(0.5);
        group.add(cardMesh);


    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function animate() {

        renderer.setAnimationLoop(render);

    }

    function render() {

        const time = performance.now() * 0.0002;
        const torus = scene.getObjectByName('torus');
        torus.rotation.x = time * 0.4;
        torus.rotation.y = time;

        renderer.render(scene, camera);
        stats.update();

        // Canvas elements doesn't trigger DOM updates, so we have to update the texture
        statsMesh.material.map.update();

    }



}

export default function ARPage() {


    // const handleKeyPress = React.useCallback((event: XREvent<any> & { type: string }) => {
    //     if (event.type === 'keydown' && event.nativeEvent.code === 'KeyA') {
    //         setCubes([...cubes, { position: [0, 0, 0], color: 'red' }]);
    //     }
    // }, []);

    useEffect(() => {
        ComponentWithHtml();
    }, []);


    return (
        <>
            <div></div>
        </>
    );
}
