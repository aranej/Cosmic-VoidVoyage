/**
 * Nebula Fragment Shader
 *
 * Procedural nebula generation using Simplex noise and Fractal Brownian Motion (fBM).
 * Inspired by the Carina Nebula from Hubble Space Telescope imagery.
 *
 * Authentic Hubble Palette (SHO):
 * - Sulfur (S II) → Deep reds and crimsons (warm dust regions)
 * - Hydrogen (H-alpha) → Greens and ambers (ionized gas)
 * - Oxygen (O III) → Cyans and teals (hot ionized regions)
 * - Star-forming cores → Bright golds and whites
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
// Authentic Carina Nebula color palette (Hubble SHO mapping)
//
vec3 getNebulaColor(float density, float depth) {
  // Hubble palette colors based on real Carina Nebula observations
  vec3 darkTeal = vec3(0.03, 0.12, 0.18);      // Oxygen (O III) - diffuse outer regions
  vec3 crimson = vec3(0.4, 0.08, 0.12);        // Sulfur (S II) - warm dust clouds
  vec3 deepRust = vec3(0.6, 0.25, 0.15);       // Sulfur + Hydrogen blend
  vec3 amber = vec3(0.85, 0.55, 0.2);          // Hydrogen (H-alpha) - ionized gas
  vec3 golden = vec3(1.0, 0.85, 0.4);          // Dense hydrogen - star-forming regions
  vec3 paleGold = vec3(1.0, 0.95, 0.85);       // Bright stellar cores

  // Multi-layered color mixing based on density (matches real nebula structure)
  vec3 color = darkTeal;

  // Layer 1: Teal to crimson (oxygen to sulfur transition)
  color = mix(color, crimson, smoothstep(0.15, 0.35, density));

  // Layer 2: Crimson to rust (sulfur-rich regions)
  color = mix(color, deepRust, smoothstep(0.35, 0.5, density));

  // Layer 3: Rust to amber (hydrogen emission appears)
  color = mix(color, amber, smoothstep(0.5, 0.65, density));

  // Layer 4: Amber to golden (dense hydrogen regions)
  color = mix(color, golden, smoothstep(0.65, 0.82, density));

  // Layer 5: Golden to pale gold (bright stellar cores)
  color = mix(color, paleGold, smoothstep(0.82, 1.0, density));

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

  // Add subtle vertical pillar structure (characteristic of Carina Nebula)
  // Creates gentle vertical streaks without being too literal
  float verticalNoise = snoise(vec3(vPosition.x * 1.5, vPosition.y * 0.8, uTime * 0.01));
  float pillarStructure = smoothstep(0.3, 0.7, verticalNoise * 0.5 + 0.5);
  density = mix(density, density * pillarStructure, 0.25); // Subtle 25% blend

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
  // DISTANCE-BASED FADE FOR CLOSE PROXIMITY
  // Prevents hard edges when camera is very close to nebula plane
  //

  // Calculate distance from camera to this fragment's position in world space
  float fragDistanceFromCamera = length(vPosition - uCameraPosition);

  // Apply gentle fade when camera is very close (< 5 units)
  // This prevents harsh cutoffs at close range
  float proximityFade = smoothstep(0.5, 5.0, fragDistanceFromCamera);
  alpha *= proximityFade;

  // Output final color
  gl_FragColor = vec4(color, alpha);
}
