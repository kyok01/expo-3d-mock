import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default function App() {
  const glRef = useRef(null);

  const onContextCreate = async (gl) => {
    // Create a renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Create a scene
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Create a light
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(0, 0, 5);
    scene.add(light);

    // Load the model
    const loader = new OBJLoader();
    loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/obj/walt/WaltHead.obj',
      (object) => {
        // Add the model to the scene
        scene.add(object);
        // Start the animation loop
        animate(renderer, scene, camera);
      }
    );
  };

  const animate = (renderer, scene, camera) => {
    requestAnimationFrame(() => animate(renderer, scene, camera));
    renderer.render(scene, camera);
    glRef.current.endFrameEXP();
  };

  return (
    <View style={{ flex: 1 }}>
      <GLView
        ref={glRef}
        style={{ flex: 1 }}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}
