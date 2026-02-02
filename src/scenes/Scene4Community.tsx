import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { formatCountWithPlus } from "../hooks/useGitHubStats";
import { AvatarItem, StatItem, BackgroundOrbs, StatusWrapper } from "../components";
import type { BaseSceneProps, GitHubDataWithContributorsProps } from "../types/scene";
import { fadeIn } from "../utils/animations";


export const Scene4Community: React.FC<BaseSceneProps & GitHubDataWithContributorsProps> = ({
  monoFontFamily,
  stats,
  contributors,
  loading,
  error,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation (0s - 0.8s)
  const titleOpacity = fadeIn(frame, 0, 0.8 * fps);

  // Subtitle animation (0.4s - 1s)
  const subtitleOpacity = fadeIn(frame, 0.4 * fps, 1 * fps);

  // Stats animation (2.5s - 3.2s)
  const statsOpacity = fadeIn(frame, 2.5 * fps, 3.2 * fps);

  // Determine display values
  const contributorsDisplay = stats
    ? formatCountWithPlus(stats.contributorsCount)
    : "500+";
  const countriesDisplay = stats ? `${stats.countriesCount}+` : "50+";
  const pullRequestsDisplay = stats
    ? formatCountWithPlus(stats.pullRequestsCount)
    : "4,568+";

  // Calculate avatar count based on available contributors
  const avatarCount =
    contributors.length > 0 ? Math.min(contributors.length, 24) : 24;

  return (
    <StatusWrapper
      loading={loading}
      error={error}
      loadingMessage="Loading community data..."
    >
      <AbsoluteFill className="bg-[#020617] flex flex-col items-center justify-center">
        {/* Background Orbs */}
        <BackgroundOrbs />

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-5xl font-bold mb-4"
            style={{ opacity: titleOpacity }}
          >
            <span className="text-white">{contributorsDisplay}</span>{" "}
            <span className="text-slate-400 font-light">Contributors</span>
          </h2>
          <p className="text-slate-400" style={{ opacity: subtitleOpacity }}>
            来自全球的开发者共同书写云原生的未来
          </p>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-8 gap-4 max-w-3xl w-full px-8">
          {Array.from({ length: avatarCount }).map((_, index) => (
            <AvatarItem
              key={contributors[index]?.id || index}
              index={index}
              frame={frame}
              totalAvatars={avatarCount}
              contributor={contributors[index]}
            />
          ))}
        </div>

        {/* Stats */}
        <div
          className="mt-16 flex justify-center gap-12"
          style={{ opacity: statsOpacity }}
        >
          <StatItem
            value={countriesDisplay}
            label="Countries"
            monoFontFamily={monoFontFamily}
          />
          <StatItem
            value={pullRequestsDisplay}
            label="Pull Requests"
            monoFontFamily={monoFontFamily}
          />
          <StatItem value="∞" label="Possibilities" monoFontFamily={monoFontFamily} />
        </div>
      </AbsoluteFill>
    </StatusWrapper>
  );
};
