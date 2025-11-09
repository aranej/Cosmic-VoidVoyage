/**
 * Cosmic VoidVoyage - Milestone 1.2
 * Camera Flight System Implementation
 *
 * Features:
 * - Procedural nebula generation using Simplex noise + fBM
 * - Automated camera flight along smooth spline path
 * - Easing functions for natural acceleration/deceleration
 * - Dynamic camera orientation (look-at nebula center)
 */

import * as THREE from 'three';

// Import shaders as raw strings (Vite feature)
import noiseGLSL from './shaders/noise.glsl?raw';
import vertexShader from './shaders/nebula.vert.glsl?raw';
import fragmentShaderRaw from './shaders/nebula.frag.glsl?raw';

// Import camera controller
import {
  CameraController,
  createNebulaFlightPath,
  Easing,
} from './camera/CameraController';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer setup - WebGL only (NOT WebGPU)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Add canvas to DOM
const container = document.getElementById('canvas-container');
if (container) {
  container.appendChild(renderer.domElement);
}

// Inject noise functions into fragment shader
const fragmentShader = fragmentShaderRaw.replace('#include <noise>', noiseGLSL);

// Shader uniforms
const uniforms = {
  uTime: { value: 0.0 },
  uResolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  },
};

// Create shader material
const nebulaMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// Create nebula mesh (positioned at origin)
const nebulaGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebulaMesh);

// Nebula position (center of the journey)
const nebulaPosition = new THREE.Vector3(0, 0, 0);

// Add background stars for depth
const starsGeometry = new THREE.BufferGeometry();
const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  transparent: true,
  opacity: 0.6,
});

const starsVertices = [];
for (let i = 0; i < 2000; i++) {
  const x = (Math.random() - 0.5) * 100;
  const y = (Math.random() - 0.5) * 100;
  const z = (Math.random() - 0.5) * 100;
  starsVertices.push(x, y, z);
}

starsGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(starsVertices, 3)
);

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// ===== CAMERA FLIGHT SYSTEM =====

// Starting position (distant from nebula)
const startPosition = new THREE.Vector3(0, 2, 20);

// Create flight path using CatmullRomCurve3
const flightPath = createNebulaFlightPath(
  startPosition,
  nebulaPosition,
  0.3 // Curve intensity (0 = straight, 1 = very curved)
);

// Create camera controller
const cameraController = new CameraController({
  camera,
  path: flightPath,
  duration: 10, // 10 second flight for testing (will sync with audio in M2)
  easing: Easing.easeInOutCubic,
  lookAtTarget: nebulaPosition, // Always look at nebula center
  onProgress: (progress) => {
    // Update progress display
    updateFlightProgress(progress);
  },
  onComplete: () => {
    console.log('Flight complete! Arrived at nebula.');
    updateFlightStatus('Complete');
  },
});

// Set initial camera position
camera.position.copy(startPosition);
camera.lookAt(nebulaPosition);

// ===== UI UPDATES =====

function updateFlightProgress(progress: number): void {
  const progressElement = document.getElementById('flight-progress');
  if (progressElement) {
    const percentage = Math.round(progress * 100);
    progressElement.textContent = `${percentage}%`;
  }
}

function updateFlightStatus(status: string): void {
  const statusElement = document.getElementById('flight-status');
  if (statusElement) {
    statusElement.textContent = status;

    // Update CSS class for color
    statusElement.className = '';
    switch (status.toLowerCase()) {
      case 'ready':
        statusElement.classList.add('status-ready');
        break;
      case 'flying':
        statusElement.classList.add('status-flying');
        break;
      case 'paused':
        statusElement.classList.add('status-paused');
        break;
      case 'complete':
        statusElement.classList.add('status-complete');
        break;
    }
  }
}

// ===== KEYBOARD CONTROLS =====

window.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'Space':
      event.preventDefault();
      if (cameraController.isActive()) {
        cameraController.stop();
        updateFlightStatus('Paused');
      } else {
        cameraController.start();
        updateFlightStatus('Flying');
      }
      break;

    case 'KeyR':
      // Reset to start position
      event.preventDefault();
      cameraController.reset();
      updateFlightStatus('Ready');
      updateFlightProgress(0);
      break;

    case 'Enter':
      // Start flight (same as space)
      event.preventDefault();
      cameraController.start();
      updateFlightStatus('Flying');
      break;
  }
});

// ===== PERFORMANCE MONITORING =====

let lastTime = performance.now();
let frameCount = 0;
let fps = 60;

// ===== ANIMATION LOOP =====

function animate() {
  requestAnimationFrame(animate);

  // Update time uniform
  uniforms.uTime.value = performance.now() * 0.001;

  // Update camera controller
  cameraController.update();

  // Slowly rotate stars for parallax effect
  stars.rotation.y += 0.0001;
  stars.rotation.x += 0.00005;

  // Render scene
  renderer.render(scene, camera);

  // FPS monitoring (every 60 frames)
  frameCount++;
  if (frameCount >= 60) {
    const currentTime = performance.now();
    const delta = currentTime - lastTime;
    fps = Math.round((frameCount / delta) * 1000);
    lastTime = currentTime;
    frameCount = 0;

    const fpsElement = document.getElementById('fps');
    if (fpsElement) {
      fpsElement.textContent = `${fps} FPS`;
    }
  }
}

// ===== WINDOW RESIZE =====

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

// ===== INITIALIZATION =====

// Start animation loop
animate();

// Log initialization
console.log('Cosmic VoidVoyage - Milestone 1.2 initialized');
console.log('Three.js version:', THREE.REVISION);
console.log('Renderer:', renderer.capabilities.isWebGL2 ? 'WebGL2' : 'WebGL');
console.log('Camera flight system active');
console.log('Controls: SPACE = Start/Pause | R = Reset | ENTER = Start');

// Initial UI state
updateFlightStatus('Ready');
updateFlightProgress(0);
