import { interpolate, Easing } from "remotion";

export interface AnimatedCounterProps {
  /**
   * Current animation frame
   */
  frame: number;
  /**
   * Target value to animate to
   */
  targetValue: number;
  /**
   * Frame to start the animation
   */
  startFrame?: number;
  /**
   * Frame to end the animation
   */
  endFrame?: number;
  /**
   * Opacity of the counter
   */
  opacity?: number;
  /**
   * Custom suffix to append (e.g., "万+")
   */
  suffix?: string;
  /**
   * Color class for the value
   */
  colorClass?: string;
  /**
   * Label text below the counter
   */
  label: string;
  /**
   * Font family for the label
   */
  monoFontFamily?: string;
}

/**
 * Formats a number with optional suffix for display
 */
const formatNumber = (num: number, suffix?: string): string => {
  if (suffix?.includes("万")) {
    return Math.floor(num) + suffix;
  }
  return Math.floor(num).toLocaleString();
};

/**
 * AnimatedCounter - Displays an animated counting number with label
 *
 * Features:
 * - Smooth easing animation from 0 to target value
 * - Customizable colors and styling
 * - Support for custom suffixes
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  frame,
  targetValue,
  startFrame = 30,
  endFrame = 90,
  opacity = 1,
  suffix,
  colorClass = "text-blue-500",
  label,
  monoFontFamily = "monospace",
}) => {
  const animatedValue = interpolate(frame, [startFrame, endFrame], [0, targetValue], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div className="text-center">
      <div
        className={`stat-value text-8xl font-bold mb-4 tracking-tighter ${colorClass}`}
        style={{ opacity }}
      >
        {formatNumber(animatedValue, suffix)}
      </div>
      <div
        className="text-sm text-slate-500 tracking-widest uppercase"
        style={{ opacity, fontFamily: monoFontFamily }}
      >
        {label}
      </div>
    </div>
  );
};

export default AnimatedCounter;
