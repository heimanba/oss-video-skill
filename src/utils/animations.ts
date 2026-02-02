import { interpolate, Easing, spring } from "remotion";

/**
 * Default interpolate options for clamped animations
 */
const CLAMP_OPTIONS = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/**
 * Spring animation configuration presets
 */
export const springPresets = {
  /** Smooth, no bounce - ideal for subtle reveals */
  smooth: { damping: 200 },
  /** Snappy, minimal bounce - ideal for UI elements */
  snappy: { damping: 20, stiffness: 200 },
  /** Bouncy entrance - ideal for playful animations */
  bouncy: { damping: 8 },
  /** Heavy, slow, small bounce */
  heavy: { damping: 15, stiffness: 80, mass: 2 },
} as const;

/**
 * Creates a spring animation value (0 to 1) with natural motion
 * Use this instead of linear interpolate for more organic feel
 */
export const springIn = (
  frame: number,
  fps: number,
  options?: {
    delay?: number;
    config?: { damping?: number; stiffness?: number; mass?: number };
  }
): number =>
  spring({
    frame,
    fps,
    delay: options?.delay,
    config: options?.config ?? springPresets.smooth,
  });

/**
 * Creates a fade-in animation value (0 to 1)
 */
export const fadeIn = (
  frame: number,
  startFrame: number,
  endFrame: number
): number =>
  interpolate(frame, [startFrame, endFrame], [0, 1], CLAMP_OPTIONS);

/**
 * Creates a fade-out animation value (1 to 0)
 */
export const fadeOut = (
  frame: number,
  startFrame: number,
  endFrame: number
): number =>
  interpolate(frame, [startFrame, endFrame], [1, 0], CLAMP_OPTIONS);

/**
 * Creates a slide-in animation value (from distance to 0)
 * Commonly used with translateX or translateY
 */
export const slideIn = (
  frame: number,
  startFrame: number,
  endFrame: number,
  distance: number = 20
): number =>
  interpolate(frame, [startFrame, endFrame], [distance, 0], CLAMP_OPTIONS);

/**
 * Creates a scale animation value (0 to 1) with optional overshoot
 */
export const scaleIn = (
  frame: number,
  startFrame: number,
  endFrame: number,
  overshoot: boolean = false
): number =>
  interpolate(frame, [startFrame, endFrame], [0, 1], {
    ...CLAMP_OPTIONS,
    easing: overshoot ? Easing.out(Easing.back(1.4)) : undefined,
  });

/**
 * Creates staggered animation values for multiple elements
 * Returns an array of { opacity, offset } for each element
 */
export const createStaggerAnimation = (
  frame: number,
  count: number,
  options: {
    baseStartFrame?: number;
    staggerDelay?: number;
    duration?: number;
    offsetDistance?: number;
    direction?: "x" | "y";
  } = {}
): Array<{ opacity: number; offset: number }> => {
  const {
    baseStartFrame = 0,
    staggerDelay = 6,
    duration = 24,
    offsetDistance = 20,
  } = options;

  return Array.from({ length: count }, (_, index) => {
    const startFrame = baseStartFrame + index * staggerDelay;
    const endFrame = startFrame + duration;

    return {
      opacity: fadeIn(frame, startFrame, endFrame),
      offset: slideIn(frame, startFrame, endFrame, offsetDistance),
    };
  });
};

/**
 * Utility type for stagger animation result
 */
export interface StaggerAnimationValue {
  opacity: number;
  offset: number;
}

/**
 * Creates a counting animation from 0 to target value
 */
export const countUp = (
  frame: number,
  startFrame: number,
  endFrame: number,
  targetValue: number
): number =>
  interpolate(frame, [startFrame, endFrame], [0, targetValue], {
    ...CLAMP_OPTIONS,
    easing: Easing.out(Easing.quad),
  });
