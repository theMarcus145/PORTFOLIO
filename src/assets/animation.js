import { saturn } from './loader.js';

// Función para interpolación lineal
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

// Función para calcular el porcentaje de animación entre dos puntos de scroll
function scalePercent(scrollPercent, start, end) {
  return (scrollPercent - start) / (end - start);
}

// Array para almacenar las secuencias de animaciones
const animationScripts = [];

// Función para inicializar las animaciones basadas en scroll
function setupAnimations(camera) {
  // 0-10% scroll
  animationScripts.push({
    start: 0,
    end: 10,
    func: (scrollPercent) => {
      camera.position.x = lerp(-10, -5.630546555852936, scalePercent(scrollPercent, 0, 10));
      camera.position.y = lerp(-2, 1.5, scalePercent(scrollPercent, 0, 10));
      
      if (saturn) {
        camera.lookAt(saturn.position);
      }
    }
  });

  // 10-40% scroll
  animationScripts.push({
    start: 10,
    end: 40,
    func: (scrollPercent) => {
      camera.position.x = lerp(-5.630546555852936, 10, scalePercent(scrollPercent, 10, 40));

      if (saturn) {
        saturn.position.z = lerp(-2, -4, scalePercent(scrollPercent, 10, 40));
        camera.lookAt(saturn.position);
      }
    }
  });

  // 40-70% scroll
  animationScripts.push({
    start: 40,
    end: 70,
    func: (scrollPercent) => {
      // Desplazamiento horizontal hacia la derecha
      camera.position.x = lerp(10, 20, scalePercent(scrollPercent, 40, 70)); 
      camera.position.y = lerp(1.5, 2, scalePercent(scrollPercent, 40, 70));
      
      if (saturn) {
        saturn.position.x = lerp(0, 10, scalePercent(scrollPercent, 40, 70));
        saturn.position.y = lerp(0, 0.5, scalePercent(scrollPercent, 40, 70));
        saturn.position.z = lerp(-4, -23, scalePercent(scrollPercent, 40, 70));
        camera.lookAt(saturn.position);
      }
    }
  });

  return animationScripts;
}

// Función para ejecutar las animaciones según el scroll actual
function playScrollAnimations(scrollPercent, animations) {
  animations.forEach((animation) => {
    if (scrollPercent >= animation.start && scrollPercent < animation.end) {
      animation.func(scrollPercent);
    }
  });
}

// Función para configurar el scroll
function setupScroll() {
  let scrollPercent = 0;
  
  const scrollHandler = () => {
    scrollPercent = (document.documentElement.scrollTop / 
      (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;

    const scrollElement = document.getElementById('scrollProgress');
    if (scrollElement) {
      scrollElement.innerText = 'Scroll Progress: ' + scrollPercent.toFixed(2) + '%';
    }
    
    return scrollPercent;
  };
  
  // Añadir el event listener
  document.body.onscroll = scrollHandler;
  
  // Devolver la función para obtener el scroll percent actual
  return () => scrollPercent;
}

export { 
  setupAnimations, 
  playScrollAnimations, 
  setupScroll
};