import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Este es el setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);


// Luces
const spotlight = new THREE.SpotLight(0xffffff, 9, 100, Math.PI / 4, 0.5, 2);
spotlight.position.set(8, 1.4, 6);  
const targetPosition = new THREE.Vector3(-3, 0.4, -3);  // Coordenadas de saturno
spotlight.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
scene.add(spotlight);
scene.add(spotlight.target);
// Crear el helper para la spotlight
//const spotlightHelper = new THREE.SpotLightHelper(spotlight);
// Añadir el helper a la escena
//scene.add(spotlightHelper);


// Estrellas
function addStar() {
  const geometry = new THREE.SphereGeometry(0.125, 24, 24);
 
  // Usamos MeshBasicMaterial para que las estrellas brillen sin emitir luz
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Amarillo brillante
  const star = new THREE.Mesh(geometry, material);
 
  // Generar posiciones aleatorias
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
 
  // Añadir la estrella a la escena (sin luz)
  scene.add(star);
}
// Llamamos a la función 200 veces para añadir estrellas que brillan
Array(200).fill().forEach(addStar);


// Saturno
let saturn; // Declare saturn globally so we can reference it

function loadSaturn(modelPath) {
  // Crear loader
  const loader = new GLTFLoader();
  // Cargar modelo
  loader.load(modelPath, (gltf) => {
      
      saturn = gltf.scene;
      saturn.position.set (-3, 0.4, -3);
      saturn.rotation.x = THREE.MathUtils.degToRad(22);
      saturn.scale.set(2, 2, 2);
      saturn.traverse(function(node) {
        if(node.isMesh)
          node.castShadow = true;
      });
      
      scene.add(saturn);
  }, undefined, (error) => {
      console.error(`Error loading model:`, error);
  });
}
loadSaturn('src/models/saturn.glb');

//Controles de órbita
// const controls = new OrbitControls(camera, renderer.domElement);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.008;
  camera.position.x = t * -0.004;
  camera.position.y = t * -0.001;
}
document.body.onscroll = moveCamera;
moveCamera();
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);



function animate() {
  requestAnimationFrame(animate);
  
  // Optional: Add some rotation to saturn if it's loaded
  if (saturn) {
    saturn.rotation.y += 0.0005;
  }
  
  renderer.render(scene, camera);
}
animate();