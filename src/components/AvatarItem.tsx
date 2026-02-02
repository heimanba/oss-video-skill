import { interpolate, Easing, Img } from "remotion";
import type { GitHubContributor } from "../hooks/useGitHubStats";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-orange-500",
];

export interface AvatarItemProps {
  /**
   * Index of this avatar in the grid
   */
  index: number;
  /**
   * Current frame number for animation
   */
  frame: number;
  /**
   * Total number of avatars in the grid (used for stagger calculation)
   */
  totalAvatars: number;
  /**
   * Optional GitHub contributor data for displaying real avatar
   */
  contributor?: GitHubContributor;
  /**
   * Custom color classes for fallback avatars
   */
  colors?: string[];
  /**
   * Base delay for animation start (in frames)
   */
  animationStartFrame?: number;
  /**
   * Animation duration (in frames)
   */
  animationDuration?: number;
}

/**
 * AvatarItem - Displays a contributor avatar with staggered entrance animation
 *
 * Features:
 * - Displays GitHub avatar image if contributor data is provided
 * - Falls back to colored circle with initial letter
 * - Staggered animation from center outward
 * - Scale and translate entrance effects
 */
export const AvatarItem: React.FC<AvatarItemProps> = ({
  index,
  frame,
  totalAvatars,
  contributor,
  colors = AVATAR_COLORS,
  animationStartFrame = 30,
  animationDuration = 15,
}) => {
  // Calculate delay based on distance from center
  const centerIndex = totalAvatars / 2;
  const distanceFromCenter = Math.abs(index - centerIndex);
  const normalizedDistance = distanceFromCenter / centerIndex;
  const delay = normalizedDistance * 45; // Stagger from center

  const startFrame = animationStartFrame + delay;
  const endFrame = startFrame + animationDuration;

  const opacity = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const scale = interpolate(frame, [startFrame, endFrame], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  const translateY = interpolate(frame, [startFrame, endFrame], [50, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const colorClass = colors[index % colors.length];
  const letter = contributor?.login
    ? contributor.login.charAt(0).toUpperCase()
    : String.fromCharCode(65 + (index % 26));

  return (
    <div
      className="relative aspect-square rounded-full overflow-hidden border-2 border-white/10"
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
      }}
    >
      {contributor?.avatar_url ? (
        <Img
          src={contributor.avatar_url}
          alt={contributor.login}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full ${colorClass} bg-opacity-40 flex items-center justify-center text-lg font-bold text-white/80`}
        >
          {letter}
        </div>
      )}
    </div>
  );
};

export default AvatarItem;
