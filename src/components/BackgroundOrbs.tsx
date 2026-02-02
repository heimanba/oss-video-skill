export interface OrbConfig {
  /**
   * CSS width class (e.g., "w-96", "w-80")
   */
  widthClass: string;
  /**
   * CSS height class (e.g., "h-96", "h-80")
   */
  heightClass: string;
  /**
   * Background color class (e.g., "bg-blue-600", "bg-purple-600")
   */
  colorClass: string;
  /**
   * Position style object
   */
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  /**
   * Blur radius in pixels
   */
  blur?: number;
  /**
   * Opacity value (0-1)
   */
  opacity?: number;
}

export interface BackgroundOrbsProps {
  /**
   * Array of orb configurations. If not provided, default orbs will be used.
   */
  orbs?: OrbConfig[];
}

const defaultOrbs: OrbConfig[] = [
  {
    widthClass: "w-96",
    heightClass: "h-96",
    colorClass: "bg-blue-600",
    position: { top: "-10%", left: "-10%" },
    blur: 100,
    opacity: 0.4,
  },
  {
    widthClass: "w-80",
    heightClass: "h-80",
    colorClass: "bg-purple-600",
    position: { bottom: "-10%", right: "-10%" },
    blur: 100,
    opacity: 0.4,
  },
];

/**
 * Preset orb configurations for common use cases
 */
export const orbPresets = {
  /**
   * Default two-orb configuration (blue + purple)
   */
  default: defaultOrbs,

  /**
   * Three-orb configuration with pink accent (used in Scene1 and Scene5)
   */
  triColor: [
    {
      widthClass: "w-96",
      heightClass: "h-96",
      colorClass: "bg-blue-600",
      position: { top: "-10%", left: "-10%" },
      blur: 100,
      opacity: 0.4,
    },
    {
      widthClass: "w-80",
      heightClass: "h-80",
      colorClass: "bg-purple-600",
      position: { bottom: "-10%", right: "-10%" },
      blur: 100,
      opacity: 0.4,
    },
    {
      widthClass: "w-64",
      heightClass: "h-64",
      colorClass: "bg-pink-600",
      position: { top: "40%", left: "60%" },
      blur: 100,
      opacity: 0.2,
    },
  ] as OrbConfig[],

  /**
   * Minimal single-orb configuration
   */
  minimal: [
    {
      widthClass: "w-96",
      heightClass: "h-96",
      colorClass: "bg-blue-600",
      position: { top: "50%", left: "50%" },
      blur: 120,
      opacity: 0.3,
    },
  ] as OrbConfig[],
};

/**
 * BackgroundOrbs - Renders decorative blurred orbs for background effects
 *
 * Features:
 * - Configurable orb positions, sizes, and colors
 * - Default configuration matching the project's design system
 */
export const BackgroundOrbs: React.FC<BackgroundOrbsProps> = ({
  orbs = defaultOrbs,
}) => (
  <>
    {orbs.map((orb, index) => (
      <div
        key={index}
        className={`absolute ${orb.widthClass} ${orb.heightClass} ${orb.colorClass} rounded-full`}
        style={{
          ...orb.position,
          filter: `blur(${orb.blur ?? 100}px)`,
          opacity: orb.opacity ?? 0.4,
        }}
      />
    ))}
  </>
);

export default BackgroundOrbs;
