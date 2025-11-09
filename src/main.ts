/**
 * Cosmic VoidVoyage - Milestone 1
 * Procedural Nebula Implementation
 *
 * Features:
 * - Procedural nebula generation using Simplex noise + fBM
 * - Hubble-inspired color gradients (Carina Nebula palette)
 * - Animated with subtle pulsing and rotation
 * - Three.js ShaderMaterial with custom GLSL
 */

import * as THREE from 'three';

// Import shaders as raw strings (Vite feature)
import noiseGLSL from './shaders/noise.glsl?raw';
import vertexShader from './shaders/nebula.vert.glsl?raw';
import fragmentShaderRaw from './shaders/nebula.frag.glsl?raw';

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
camera.position.z = 2;

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
// Replace the #include <noise> directive with actual noise code
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
  blending: THREE.AdditiveBlending, // Additive blending for glow effect
});

// Create large plane geometry to fill the view
const nebulaGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);

// Create mesh
const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebulaMesh);

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

// Performance monitoring
let lastTime = performance.now();
let frameCount = 0;
let fps = 60;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update time uniform
  uniforms.uTime.value = performance.now() * 0.001; // Convert to seconds

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

    // Update FPS display if element exists
    const fpsElement = document.getElementById('fps');
    if (fpsElement) {
      fpsElement.textContent = `${fps} FPS`;
    }
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Update resolution uniform
  uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Log initialization
console.log('Cosmic VoidVoyage - Milestone 1 initialized');
console.log('Three.js version:', THREE.REVISION);
console.log('Renderer:', renderer.capabilities.isWebGL2 ? 'WebGL2' : 'WebGL');
console.log('Procedural nebula shader active');
