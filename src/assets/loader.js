import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Variables para almacenar los objetos y mixers
let jupiter;
let tunnelMixer;


function loadJupiter(modelPath, scene) {
  return new Promise((resolve, reject) => {
    // Crear loader
    const loader = new GLTFLoader();
    
    // Cargar modelo
    loader.load(modelPath, (gltf) => {
      jupiter = gltf.scene;
      jupiter.position.set(0, 0, -2);
      jupiter.rotation.x = THREE.MathUtils.degToRad(22);
      jupiter.scale.set(2, 2, 2);
      
      jupiter.traverse(function(node) {
        if(node.isMesh)
          node.castShadow = true;
      });
      
      scene.add(jupiter);
      resolve(jupiter);
    }, undefined, (error) => {
      console.error(`Error loading model:`, error);
      reject(error);
    });
  });
}


function loadTunnel(modelPath, scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    
    loader.load(modelPath, (gltf) => {
      const tunnel = gltf.scene;
      tunnel.position.set(1100, 0, 0);
      tunnel.rotation.x = THREE.MathUtils.degToRad(22);
      tunnel.scale.set(2, 2, 2);

      tunnel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      scene.add(tunnel);

      // Configurar el mixer para las animaciones
      if (gltf.animations && gltf.animations.length > 0) {
        tunnelMixer = new THREE.AnimationMixer(tunnel);
        gltf.animations.forEach((clip) => {
          tunnelMixer.clipAction(clip).play();
        });
      }
      
      resolve({ tunnel, tunnelMixer });
    }, undefined, (error) => {
      console.error('Error loading tunnel model:', error);
      reject(error);
    });
  });
}

// Función para actualizar las animaciones del mixer
function updateAnimations(delta) {
  if (tunnelMixer) {
    tunnelMixer.update(delta);
  }
}


// Función para actualizar la rotación de Jupiter
function updateJupiter() {

}

// Exportamos las funciones y objetos necesarios
export { 
  loadJupiter, 
  loadTunnel, 
  updateAnimations, 
  updateJupiter, 
  jupiter,
  tunnelMixer 
};