import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Variables para almacenar los objetos y mixers
let jupiter;
let sun;
let cluster;
let rays;
let raysMixer;
let tunnel;
let tunnelMixer;
let galaxy;
let galaxyMixer;


function loadJupiter(modelPath, scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      jupiter = gltf.scene;
      jupiter.position.set(0, 0, -2);
      jupiter.rotation.x = THREE.MathUtils.degToRad(22);
      jupiter.scale.set(2, 2, 2);

      jupiter.traverse(node => {
        if (node.isMesh) node.castShadow = true;
      });

      scene.add(jupiter);
      resolve(jupiter);
    }, undefined, reject);
  });
}

function loadGalaxy(modelPath, scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      galaxy = gltf.scene;
      galaxy.position.set(-300, 120, -1400);
      galaxy.rotation.x = THREE.MathUtils.degToRad(55);
      galaxy.rotation.z = THREE.MathUtils.degToRad(-20);
      galaxy.scale.set(15, 15, 15);

      galaxy.traverse(node => {
        if (node.isMesh) node.castShadow = true;
      });

      scene.add(galaxy);

      // ✅ Añadir animaciones si existen
      if (gltf.animations && gltf.animations.length > 0) {
        galaxyMixer = new THREE.AnimationMixer(galaxy);
        gltf.animations.forEach((clip) => {
          const action = galaxyMixer.clipAction(clip);
          action.play();
        });
      }

      resolve(galaxy);
    }, undefined, (error) => {
      console.error(`Error loading model:`, error);
      reject(error);
    });
  });
}

function loadCluster(modelPath, scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      cluster = gltf.scene;
      cluster.position.set(-300, 120, -1400);
      cluster.rotation.x = THREE.MathUtils.degToRad(55);
      cluster.rotation.z = THREE.MathUtils.degToRad(-40);
      cluster.scale.set(50, 50, 50);

      cluster.traverse(node => {
        if (node.isMesh) node.castShadow = true;
      });

      scene.add(cluster);

      resolve(cluster);
    }, undefined, (error) => {
      console.error(`Error loading model:`, error);
      reject(error);
    });
  });
}

function loadSun(modelPath, scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      sun = gltf.scene;
      sun.position.set(900, 400, 120);
      sun.scale.set(1.6, 1.6, 1.6);

      sun.traverse(node => {
        if (node.isMesh) {
          node.castShadow = false;
          node.receiveShadow = false;

          // Clonar textura para usarla en un material que no depende de la luz
          const originalMap = node.material.map;
          node.material = new THREE.MeshBasicMaterial({
            map: originalMap // Aplica la textura original
          });
        }
      });

      scene.add(sun);
      resolve(sun);
    }, undefined, reject);
  });
}

function loadRays(modelPath, scene) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      rays = gltf.scene;
      rays.position.set(900, 393.5, 119.3);
      rays.scale.set(9, 9, 9);

      rays.traverse(node => {
        if (node.isMesh) node.castShadow = true;
      });

      scene.add(rays);

      // ✅ Añadir animaciones si existen
      if (gltf.animations && gltf.animations.length > 0) {
        raysMixer = new THREE.AnimationMixer(rays);
        gltf.animations.forEach((clip) => {
          const action = raysMixer.clipAction(clip);
          action.play();
        });
      }

      resolve(rays);
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
      tunnel = gltf.scene;
      tunnel.position.set(0, -1000, 0);
      tunnel.rotation.x = THREE.MathUtils.degToRad(22);
      tunnel.scale.set(2, 2, 2);

      tunnel.traverse((node) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });

      scene.add(tunnel);

      if (gltf.animations && gltf.animations.length > 0) {
        tunnelMixer = new THREE.AnimationMixer(tunnel);
        gltf.animations.forEach((clip) => {
          const action = tunnelMixer.clipAction(clip);
          action.timeScale = 2.0;
          action.play();
        });
      }

      resolve({ tunnel, tunnelMixer });
    }, undefined, reject);
  });
}

// ✅ Actualizar todos los mixers
function updateAnimations(delta) {
  if (tunnelMixer) tunnelMixer.update(delta);
  if (galaxyMixer) galaxyMixer.update(delta);
  if (raysMixer) raysMixer.update(delta);
}

export { 
  loadJupiter, 
  loadTunnel, 
  loadGalaxy,
  loadCluster,
  loadSun,
  loadRays,
  updateAnimations, 
  jupiter,
};
