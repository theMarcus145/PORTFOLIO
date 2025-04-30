import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


const clock = new THREE.Clock();

// Este es el setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Cámara
camera.position.setZ(3.4);
camera.position.setX(2);
camera.position.setY(0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

// Postprocesado con Bloom
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



// Luces
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(8, 1.4, 6);  
const targetPosition = new THREE.Vector3(0, 0, 0);  // Coordenadas de saturno
light.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
scene.add(light);
scene.add(light.target);

light.castShadow = true;

// Sombras
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 500;
light.shadow.camera.left = -30;
light.shadow.camera.right = 30;
light.shadow.camera.top = 30;
light.shadow.camera.bottom = -30;
light.shadow.bias = -0.005;


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
let saturn; 

function loadSaturn(modelPath) {
  // Crear loader
  const loader = new GLTFLoader();
  // Cargar modelo
  loader.load(modelPath, (gltf) => {
      
      saturn = gltf.scene;
      saturn.position.set (0, 0, 0);
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

let tunnel;

let tunnelMixer;

function loadTunnel(modelPath) {
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
  }, undefined, (error) => {
    console.error('Error loading tunnel model:', error);
  });
}



loadTunnel('src/models/spacedrive.glb');


function lerp(x, y, a) {
  return (1 - a) * x + a * y
}


// Llamar a esta función para definir distintas animaciones dependiendo del scroll. 
// Colocando el principio y el final de la animación
function scalePercent(start, end) {
  return (scrollPercent - start) / (end - start)
}

const animationScripts = []

animationScripts.push({
  start: 0,
  end: 100,
  func: () => {
    camera.position.x = lerp(1, 4, scalePercent(60, 80))
    camera.position.y = lerp(2, 4, scalePercent(60, 80))
    camera.lookAt(0,0,0)
    console.log(camera.position.x + " " + camera.position.y)
  }
})


// Función para calcular el porcentaje de scroll de la página
let scrollPercent = 0;

document.body.onscroll = () => {
  scrollPercent = (document.documentElement.scrollTop / 
    (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;

  const scrollElement = document.getElementById('scrollProgress');
  if (scrollElement) {
    scrollElement.innerText = 'Scroll Progress: ' + scrollPercent.toFixed(2) + '%';
  }
};


function playScrollAnimations() {
  animationScripts.forEach((a) => {
      if (scrollPercent >= a.start && scrollPercent < a.end) {
          a.func()
      }
  })
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); // Agrega un reloj global

  if (saturn) {
    saturn.rotation.y += 0.0005;
  }

  if (tunnelMixer) {
    tunnelMixer.update(delta); // Avanzar animaciones del túnel
  }

  playScrollAnimations();
  composer.render();
}

animate();