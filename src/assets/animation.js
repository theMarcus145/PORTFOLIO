import { jupiter } from './loader.js';

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

//LA POSICIÓN INICIAL DE JUPITER ES: jupiter.position.set(0, 0, -2);
// Función para inicializar las animaciones basadas en scroll
function setupAnimations(camera) {
  animationScripts.push({
    start: 0,
    end: 10,
    func: function(scrollPercent) {
      camera.position.x = lerp(-10, -5.630546555852936, scalePercent(scrollPercent, this.start, this.end));
      camera.position.y = lerp(-2, 1.5, scalePercent(scrollPercent, this.start, this.end));
      
      if (jupiter) {
        jupiter.rotation.y = lerp(0, Math.PI / 4, scalePercent(scrollPercent, this.start, this.end));
        camera.lookAt(jupiter.position);
      }
    }
  });

  animationScripts.push({
    start: 10,
    end: 40,
    func: function(scrollPercent) {
      camera.position.x = lerp(-5.630546555852936, 10, scalePercent(scrollPercent, this.start, this.end));

      if (jupiter) {
        jupiter.position.z = lerp(-2, -4, scalePercent(scrollPercent, this.start, this.end));
        jupiter.rotation.y = lerp(Math.PI / 4, Math.PI, scalePercent(scrollPercent, this.start, this.end));
        camera.lookAt(jupiter.position);
      }
    }
  });

  animationScripts.push({
    start: 40,
    end: 55,
    func: function(scrollPercent) {
      camera.position.x = lerp(10, 15, scalePercent(scrollPercent, this.start, this.end)); 
      camera.position.y = lerp(1.5, 2, scalePercent(scrollPercent, this.start, this.end));
      camera.lookAt(0, 0, -4);
      
      if (jupiter) {
        jupiter.position.x = lerp(0, 10, scalePercent(scrollPercent, this.start, this.end));
        jupiter.position.y = lerp(0, 0.5, scalePercent(scrollPercent, this.start, this.end));
        jupiter.position.z = lerp(-4, -8.2, scalePercent(scrollPercent, this.start, this.end));
        jupiter.rotation.y = lerp(Math.PI, Math.PI * 1.6, scalePercent(scrollPercent, this.start, this.end));
      }
    }
  });

  animationScripts.push({
    start: 55,
    end: 80,
    func: function(scrollPercent) {
      camera.lookAt(0, 0, -4);
      camera.position.z = 3.4;
      camera.position.x = 15;
      camera.position.y = 2;

      if (jupiter) {
        jupiter.rotation.y = lerp(Math.PI * 1.6, Math.PI * 2.2 , scalePercent(scrollPercent, this.start, this.end));
      }
    }
  });

  animationScripts.push({
    start: 80,
    end: 100,
    func: function(scrollPercent) {
      camera.position.set(0, -1000, 0);
      camera.lookAt(0, -1000, -5);
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

// This script adds intersection observer functionality
// to trigger animations when elements scroll into view

document.addEventListener('DOMContentLoaded', () => {
  // Select all sections and blockquotes 
  const animatedElements = document.querySelectorAll('section, blockquote');
  
  // Create observer options
  const observerOptions = {
    root: null, // use viewport as root
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% of element is visible
  };
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class to start animation
        entry.target.classList.add('visible');
        
        // Unobserve once animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe all animated elements
  animatedElements.forEach(element => {
    observer.observe(element);
  });
});

export { 
  setupAnimations, 
  playScrollAnimations, 
  setupScroll
};