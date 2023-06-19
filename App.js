import React, { useState } from "react";
import { View } from "react-native";
import { GLView } from "expo-gl";
import ExpoTHREE, { Renderer } from "expo-three";
import {
  PointLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  Clock, // アニメーションのため追加
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Asset } from "expo-asset"; // ファイル読み込みのため追加

export default function App() {
  const [cameras, setCameras] = useState(null);
  const [models, setModels] = useState(null); // 3Dモデルをセットする変数
  
  return (
    <>
      <View style={{ flex: 1 }}>
        <GLView
          style={{ flex: 1 }}
          onContextCreate={async (gl) => {
            // 3D空間の準備
            const { drawingBufferWidth: width, drawingBufferHeight: height } =
              gl;
            const renderer = new Renderer({ gl }); // レンダラーの準備
            renderer.setSize(width, height); // 3D空間の幅と高さ
            renderer.setClearColor("white"); // 3D空間の配色
            const scene = new Scene(); // これが3D空間
            scene.add(new GridHelper(100, 100)); //グリッドを表示

            let mixer;
            let clock = new Clock();

            const [{ localUri }] = await Asset.loadAsync(require('./assets/adamHead/adamHead.gltf'));
            console.log(localUri);
            
            const loader = new GLTFLoader();
            loader.load(
              localUri,
              (gltf) => {
                console.log(gltf);
                scene.add(gltf.scene);
              },
              (xhr) => {
                console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
              },
              (error) => {
                console.error(error);
              }
            );

            // 3D空間の光！
            const pointLight = new PointLight(0xffffff, 2, 1000, 1); //一点からあらゆる方向への光源(色, 光の強さ, 距離, 光の減衰率)
            pointLight.position.set(0, 200, 200); //配置される座標 (x,y,z)
            scene.add(pointLight); //3D空間に追加
            // カメラが映し出す設定(視野角, アスペクト比, near, far)
            const camera = new PerspectiveCamera(45, width / height, 1, 1000);
            setCameras(camera);
            // カメラの初期座標
            let cameraInitialPositionX = 0;
            let cameraInitialPositionY = 2;
            let cameraInitialPositionZ = 7;
            // カメラの座標
            camera.position.set(
              cameraInitialPositionX,
              cameraInitialPositionY,
              cameraInitialPositionZ
            );
            const render = () => {
              requestAnimationFrame(render); // アニメーション　moveUd関数、moveLr関数でカメラ座標が移動
              renderer.render(scene, camera); // レンダリング
              //Animation Mixerを実行
              if (mixer) {
                mixer.update(clock.getDelta());
              }
              gl.endFrameEXP(); // 現在のフレームを表示する準備ができていることをコンテキストに通知するpresent (Expo公式)
            };
            render();
          }}
        />
      </View>
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
      </View>
    </>
  );
}

