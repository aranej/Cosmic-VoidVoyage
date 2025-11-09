/**
 * Nebula Fragment Shader
 *
 * Procedural nebula generation using Simplex noise and Fractal Brownian Motion (fBM).
 * Inspired by the Carina Nebula from Hubble Space Telescope imagery.
 *
 * Color palette:
 * - Deep blues/purples (outer regions, cooler gas)
 * - Pink/magenta (ionized hydrogen)
 * - Orange/yellow (inner glow, warmer regions)
 * - Bright whites (star-forming regions)
 */

precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uCameraPosition;

varying vec2 vUv;
varying vec3 vPosition;

// Import noise functions (will be injected during shader compilation)
// snoise(vec3) - 3D Simplex Noise
// fbm(vec3, int octaves) - Fractal Brownian Motion

#include <noise>

//
// Color palette inspired by Carina Nebula
//
vec3 getNebulaColor(float density, float depth) {
  // Base colors
  vec3 deepBlue = vec3(0.05, 0.1, 0.3);     // Outer region
  vec3 purple = vec3(0.3, 0.1, 0.4);         // Mid region
  vec3 magenta = vec3(0.8, 0.2, 0.6);        // Ionized hydrogen
  vec3 orange = vec3(0.9, 0.4, 0.1);         // Inner glow
  vec3 yellow = vec3(1.0, 0.9, 0.3);         // Bright core
  vec3 white = vec3(1.0, 1.0, 1.0);          // Star-forming regions

  // Multi-layered color mixing based on density
  vec3 color = deepBlue;

  // Layer 1: Deep blue to purple (low density)
  color = mix(color, purple, smoothstep(0.1, 0.3, density));

  // Layer 2: Purple to magenta (medium density)
  color = mix(color, magenta, smoothstep(0.3, 0.5, density));

  // Layer 3: Magenta to orange (high density)
  color = mix(color, orange, smoothstep(0.5, 0.7, density));

  // Layer 4: Orange to yellow (very high density)
  color = mix(color, yellow, smoothstep(0.7, 0.85, density));

  // Layer 5: Yellow to white (extreme density - bright cores)
  color = mix(color, white, smoothstep(0.85, 1.0, density));

  // Add depth variation (darker in distance, brighter closer)
  color *= (0.5 + 0.5 * depth);

  return color;
}

void main() {
  // Normalized coordinates (0 to 1)
  vec2 uv = vUv;

  // Center coordinates (-0.5 to 0.5)
  vec2 centeredUv = uv - 0.5;

  // Create 3D sampling position with slow time-based rotation
  vec3 samplePos = vec3(
    vPosition.x,
    vPosition.y,
    vPosition.z + uTime * 0.02  // Slow drift in Z
  );

  // Calculate distance from center for radial falloff
  float distFromCenter = length(centeredUv);

  // Base nebula structure using fBM with 6 octaves
  float nebula1 = fbm(samplePos * 2.0, 6);

  // Secondary layer with different frequency for variation
  float nebula2 = fbm(samplePos * 3.5 + vec3(100.0), 5);

  // Fine detail layer
  float nebula3 = fbm(samplePos * 7.0 + vec3(200.0), 4);

  // Combine layers with weights
  float combinedNoise = nebula1 * 0.5 + nebula2 * 0.3 + nebula3 * 0.2;

  // Map noise from [-1, 1] to [0, 1]
  float density = (combinedNoise + 1.0) * 0.5;

  // Apply radial falloff (nebula fades toward edges)
  float radialMask = 1.0 - smoothstep(0.2, 0.6, distFromCenter);
  density *= radialMask;

  // Add subtle pulsing (breathing effect)
  float pulse = sin(uTime * 0.5) * 0.1 + 0.9;
  density *= pulse;

  // Depth calculation (varies across nebula)
  float depth = 0.5 + 0.5 * snoise(samplePos * 0.5);

  // Get final color
  vec3 color = getNebulaColor(density, depth);

  // Apply overall opacity based on density
  float alpha = density;

  // Boost brightness in high-density regions
  color *= (1.0 + density * 0.5);

  //
  // VOLUMETRIC FADE-OUT EFFECT
  // Simulates exiting a fog volume when camera passes through nebula
  //

  // Calculate Z distance from camera to nebula plane (nebula is at z=0)
  float cameraZ = uCameraPosition.z;

  // When camera passes through the nebula (z < 0), apply smooth fadeout
  // This creates the effect of exiting a volume of fog rather than hitting a wall
  if (cameraZ < 0.0) {
    // Distance past the nebula plane
    float distancePastNebula = abs(cameraZ);

    // Smooth fadeout: starts at z=0, fully transparent by z=-3
    // Adjust the fadeout distance (3.0) to control how quickly it fades
    float fadeoutFactor = 1.0 - smoothstep(0.0, 3.0, distancePastNebula);

    // Apply fadeout to alpha
    alpha *= fadeoutFactor;
  }

  // Output final color
  gl_FragColor = vec4(color, alpha);
}
