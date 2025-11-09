/**
 * Nebula Vertex Shader
 *
 * Transforms vertex positions and passes UV coordinates and world position
 * to the fragment shader for procedural texture generation.
 */

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
