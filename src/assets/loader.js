import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Variables para almacenar los objetos y mixers
let saturn;
let tunnelMixer;

/**
 * Carga el modelo de Saturno
 * @param {string} modelPath - Ruta al modelo GLTF
 * @param {THREE.Scene} scene - Escena donde se añadirá el modelo
 * @returns {Promise} - Promesa que resuelve con el objeto saturn cuando se carga
 */
function loadSaturn(modelPath, scene) {
  return new Promise((resolve, reject) => {
    // Crear loader
    const loader = new GLTFLoader();
    
    // Cargar modelo
    loader.load(modelPath, (gltf) => {
      saturn = gltf.scene;
      saturn.position.set(0, 0, -2);
      saturn.rotation.x = THREE.MathUtils.degToRad(22);
      saturn.scale.set(2, 2, 2);
      
      saturn.traverse(function(node) {
        if(node.isMesh)
          node.castShadow = true;
      });
      
      scene.add(saturn);
      resolve(saturn);
    }, undefined, (error) => {
      console.error(`Error loading model:`, error);
      reject(error);
    });
  });
}

/**
 * Carga el modelo del túnel espacial
 * @param {string} modelPath - Ruta al modelo GLTF
 * @param {THREE.Scene} scene - Escena donde se añadirá el modelo
 * @returns {Promise} - Promesa que resuelve con el objeto tunnel cuando se carga
 */
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

// Función para actualizar la rotación de Saturno
function updateSaturn() {
  if (saturn) {
    saturn.rotation.y += 0.0005;
  }
}

// Exportamos las funciones y objetos necesarios
export { 
  loadSaturn, 
  loadTunnel, 
  updateAnimations, 
  updateSaturn, 
  saturn,
  tunnelMixer 
};