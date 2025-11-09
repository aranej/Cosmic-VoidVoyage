/**
 * Camera Controller for Cosmic VoidVoyage
 *
 * Handles automated camera flight along spline paths with smooth easing.
 * Designed for synchronized flight duration with audio tracks.
 */

import * as THREE from 'three';

/**
 * Easing functions for smooth camera motion
 */
export const Easing = {
  // Linear interpolation (no easing)
  linear: (t: number): number => t,

  // Ease in-out cubic (smooth acceleration and deceleration)
  // Starts slow, accelerates in middle, decelerates at end
  easeInOutCubic: (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  // Ease in-out quad (gentler than cubic)
  easeInOutQuad: (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  },

  // Ease out cubic (fast start, slow end)
  easeOutCubic: (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  },

  // Ease in cubic (slow start, fast end)
  easeInCubic: (t: number): number => {
    return t * t * t;
  },
};

export interface CameraFlightConfig {
  camera: THREE.Camera;
  path: THREE.CatmullRomCurve3;
  duration: number; // Flight duration in seconds
  easing?: (t: number) => number; // Easing function (default: easeInOutCubic)
  lookAtTarget?: THREE.Vector3; // Optional fixed look-at target
  dynamicLookAhead?: boolean; // Look ahead along path (default: true)
  onComplete?: () => void; // Callback when flight completes
  onProgress?: (progress: number) => void; // Callback with progress (0-1)
}

export class CameraController {
  private camera: THREE.Camera;
  private path: THREE.CatmullRomCurve3;
  private duration: number;
  private easing: (t: number) => number;
  private lookAtTarget: THREE.Vector3 | null;
  private dynamicLookAhead: boolean;
  private onComplete: (() => void) | null;
  private onProgress: ((progress: number) => void) | null;

  private isFlying: boolean = false;
  private startTime: number = 0;
  private currentProgress: number = 0;

  constructor(config: CameraFlightConfig) {
    this.camera = config.camera;
    this.path = config.path;
    this.duration = config.duration;
    this.easing = config.easing || Easing.easeInOutCubic;
    this.lookAtTarget = config.lookAtTarget || null;
    this.dynamicLookAhead = config.dynamicLookAhead ?? true;
    this.onComplete = config.onComplete || null;
    this.onProgress = config.onProgress || null;
  }

  /**
   * Start the camera flight
   */
  start(): void {
    this.isFlying = true;
    this.startTime = performance.now();
    this.currentProgress = 0;
    console.log('Camera flight started');
  }

  /**
   * Stop the camera flight
   */
  stop(): void {
    this.isFlying = false;
    console.log('Camera flight stopped');
  }

  /**
   * Reset the camera flight to start position
   */
  reset(): void {
    this.isFlying = false;
    this.currentProgress = 0;
    this.updateCameraPosition(0);
  }

  /**
   * Update camera position (call this in animation loop)
   */
  update(): void {
    if (!this.isFlying) return;

    const currentTime = performance.now();
    const elapsed = (currentTime - this.startTime) / 1000; // Convert to seconds

    // Calculate linear progress (0 to 1)
    const linearProgress = Math.min(elapsed / this.duration, 1.0);

    // Apply easing function
    const easedProgress = this.easing(linearProgress);

    // Update camera position
    this.updateCameraPosition(easedProgress);

    // Store current progress
    this.currentProgress = linearProgress;

    // Call progress callback
    if (this.onProgress) {
      this.onProgress(linearProgress);
    }

    // Check if flight is complete
    if (linearProgress >= 1.0) {
      this.isFlying = false;
      if (this.onComplete) {
        this.onComplete();
      }
      console.log('Camera flight completed');
    }
  }

  /**
   * Update camera position and orientation based on progress
   */
  private updateCameraPosition(progress: number): void {
    // Get position along path
    const position = this.path.getPoint(progress);
    this.camera.position.copy(position);

    // Update camera orientation
    if (this.lookAtTarget) {
      // Look at fixed target (e.g., nebula center)
      this.camera.lookAt(this.lookAtTarget);
    } else if (this.dynamicLookAhead) {
      // Look ahead along the path for natural motion
      const lookAheadProgress = Math.min(progress + 0.05, 1.0); // Look 5% ahead
      const lookAtPoint = this.path.getPoint(lookAheadProgress);
      this.camera.lookAt(lookAtPoint);
    }
  }

  /**
   * Get current flight progress (0 to 1)
   */
  getProgress(): number {
    return this.currentProgress;
  }

  /**
   * Check if camera is currently flying
   */
  isActive(): boolean {
    return this.isFlying;
  }

  /**
   * Set flight duration (useful for audio synchronization)
   */
  setDuration(duration: number): void {
    this.duration = duration;
  }

  /**
   * Update the flight path
   */
  setPath(path: THREE.CatmullRomCurve3): void {
    this.path = path;
  }

  /**
   * Update look-at target
   */
  setLookAtTarget(target: THREE.Vector3 | null): void {
    this.lookAtTarget = target;
  }
}

/**
 * Helper function to create a simple flight path to a nebula
 */
export function createNebulaFlightPath(
  startPosition: THREE.Vector3,
  nebulaPosition: THREE.Vector3,
  curveIntensity: number = 0.5
): THREE.CatmullRomCurve3 {
  // Calculate distance for curve variation
  const distance = startPosition.distanceTo(nebulaPosition);

  // Create control points for smooth curve
  const points: THREE.Vector3[] = [];

  // Start point (distant origin)
  points.push(startPosition.clone());

  // Intermediate points for curve variation
  // Add some lateral offset for interesting flight path
  const midPoint1 = startPosition
    .clone()
    .lerp(nebulaPosition, 0.25)
    .add(
      new THREE.Vector3(
        (Math.random() - 0.5) * distance * curveIntensity,
        (Math.random() - 0.5) * distance * curveIntensity * 0.5,
        0
      )
    );

  const midPoint2 = startPosition
    .clone()
    .lerp(nebulaPosition, 0.5)
    .add(
      new THREE.Vector3(
        (Math.random() - 0.5) * distance * curveIntensity * 0.8,
        (Math.random() - 0.5) * distance * curveIntensity * 0.3,
        0
      )
    );

  const midPoint3 = startPosition
    .clone()
    .lerp(nebulaPosition, 0.75)
    .add(
      new THREE.Vector3(
        (Math.random() - 0.5) * distance * curveIntensity * 0.3,
        (Math.random() - 0.5) * distance * curveIntensity * 0.2,
        0
      )
    );

  points.push(midPoint1);
  points.push(midPoint2);
  points.push(midPoint3);

  // End point (nebula center)
  points.push(nebulaPosition.clone());

  // Create CatmullRomCurve3
  // closed: false (not a loop)
  // curveType: 'catmullrom' (smooth curve through all points)
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
}
