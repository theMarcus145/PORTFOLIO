import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { loadJupiter, loadTunnel, loadGalaxy, loadCluster, updateAnimations, loadSun } from './assets/loader.js';
import { setupAnimations, playScrollAnimations, setupScroll } from './assets/animation.js';

// Crear un reloj para las animaciones
const clock = new THREE.Clock();

// Inicializar la escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

// Configurar la cámara
camera.position.setZ(3.4);
camera.position.setX(2);
camera.position.setY(0);

// Configurar el renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

// Configurar el postprocesado con Bloom
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // intensidad
  0.4,  // radio
  0.85  // umbral
);
bloomPass.threshold = 0.2;
bloomPass.strength = 1.2; // Más intensidad de glow
bloomPass.radius = 0.8;

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Configurar luces
const light = new THREE.DirectionalLight(0xffefd9, 0.8);
light.position.set(70, 3, 6);  
const targetPosition = new THREE.Vector3(0, 0, -2);  // Coordenadas de jupiter
light.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
scene.add(light);
scene.add(light.target);

// Configurar sombras
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
light.shadow.camera.left = -30;
light.shadow.camera.right = 30;
light.shadow.camera.top = 30;
light.shadow.camera.bottom = -30;
light.shadow.bias = -0.005;

// Función para añadir estrellas
function addStar() {
  const geometry = new THREE.SphereGeometry(0.075, 24, 24); // Tamaño y forma de las estrellitas
  let material; // Material
  
  const colorChoice = Math.floor(Math.random() * 3) + 1; // Generar un número aleatorio para luego asignar color

  switch (colorChoice) {
    case 1:
      material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Amarillo
      break;
    case 2:
      material = new THREE.MeshBasicMaterial({ color: 0xc6eeee }); // Azul claro
      break;
    case 3:
      material = new THREE.MeshBasicMaterial({ color: 0xffaaff }); // Magenta
      break;
    default:
      material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Blanco
      break;
  }

  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));
  star.position.set(x, y, z);

  scene.add(star);
}

// Añadir estrellas a la escena
Array(200).fill().forEach(addStar);

// Configurar los controladores de animación
const animations = setupAnimations(camera);
const getScrollPercent = setupScroll();

// Cargar modelos
Promise.all([
  loadJupiter('src/models/jupiter.glb', scene),
  loadTunnel('src/models/spacedrive.glb', scene),
  loadGalaxy('src/models/galaxy.glb', scene),
  loadCluster('src/models/cluster.glb', scene),
  loadSun('src/models/sun.glb', scene)
]).then(() => {
  console.log('Todos los modelos cargados correctamente');
}).catch(error => {
  console.error('Error cargando modelos:', error);
});

// Función de animación principal
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const scrollPercent = getScrollPercent();
  
  // Actualizar rotaciones y animaciones
  updateAnimations(delta);
  
  // Aplicar animaciones de scroll
  playScrollAnimations(scrollPercent, animations);
  
  // Renderizar la escena con postprocesado
  composer.render();
}

// Iniciar el bucle de animación
animate();

// Manejar el redimensionamiento de la ventana
window.addEventListener('resize', () => {
  // Actualizar cámara
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  // Actualizar renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});