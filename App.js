import React, { useRef } from 'react'
import { GLView } from 'expo-gl'
import { Renderer } from 'expo-three'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function App() {
  return (
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => {
          // GL Parameter disruption
          const {
            drawingBufferWidth: width,
            drawingBufferHeight: height,
          } = gl

          // Scene
          const scene = new THREE.Scene()

          // Camera
          const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            1,
            1000
          )
          camera.position.z = 2
          camera.position.x = 2
          camera.position.y = 2
          camera.lookAt(cube.position)
          setCamera(camera)
          scene.add(camera)

          // Renderer
          const renderer = new Renderer({ gl })
          renderer.setSize(width, height)
          renderer.setClearColor('#fff')

          // GLTF loader
          const gltfLoader = new GLTFLoader()

          // Load model from URL or local file
          gltfLoader.load(
            // resource URL or file path
            '/assets/adamHead/adamHead.gltf',
            // called when the resource is loaded
            function (gltf) {
              scene.add(gltf.scene)
            },
            // called while loading is progressing
            function (xhr) {
              console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            // called when loading has errors
            function (error) {
              console.log('An error happened', error)
            }
          )

          // Render function
          const render = () => {
            requestAnimationFrame(render)
            renderer.render(scene, camera)
            gl.endFrameEXP()
          }
          render()
        }}
      />
  )
}
