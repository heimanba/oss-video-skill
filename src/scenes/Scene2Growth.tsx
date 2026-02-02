import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedCounter, BackgroundOrbs, StatusWrapper } from "../components";
import type { BaseSceneProps, GitHubDataProps } from "../types/scene";
import { fadeIn, slideIn } from "../utils/animations";

export interface Scene2Props extends BaseSceneProps, GitHubDataProps {
  /**
   * Contributors count (e.g., 35 means 35+ contributors)
   * This value is available from GitHub API stats
   */
  contributors?: number;
}

export const Scene2Growth: React.FC<Scene2Props> = ({
  monoFontFamily,
  stats,
  loading,
  error,
  contributors = 35,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Label and description animation (0s - 0.6s, 0.3s - 0.9s)
  const labelOpacity = fadeIn(frame, 0, 0.6 * fps);
  const descOpacity = fadeIn(frame, 0.3 * fps, 0.9 * fps);

  // Stats animation with stagger (0.5s, 0.7s, 0.9s starts)
  const statOpacity1 = fadeIn(frame, 0.5 * fps, 1 * fps);
  const statOpacity2 = fadeIn(frame, 0.7 * fps, 1.2 * fps);
  const statOpacity3 = fadeIn(frame, 0.9 * fps, 1.4 * fps);

  // Quote animation (3s - 3.7s)
  const quoteOpacity = fadeIn(frame, 3 * fps, 3.7 * fps);
  const quoteY = slideIn(frame, 3 * fps, 3.7 * fps, 20);

  // Determine display values from API or use fallback
  const starsCount = stats?.starsCount ?? 16078;
  const forksCount = stats?.forksCount ?? 1424;

  return (
    <StatusWrapper
      loading={loading}
      error={error}
      loadingMessage="Loading GitHub data..."
    >
      <AbsoluteFill className="bg-[#020617] flex items-center justify-center">
        {/* Background Orbs */}
        <BackgroundOrbs />

        <div className="max-w-6xl mx-auto w-full px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2
              className="text-sm text-blue-400 tracking-[0.3em] uppercase mb-4"
              style={{ opacity: labelOpacity, fontFamily: monoFontFamily }}
            >
              OPEN SOURCE IMPACT
            </h2>
            <p className="text-slate-400 text-lg" style={{ opacity: descOpacity }}>
              从实验室项目到企业级多智能体框架
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-16">
            <AnimatedCounter
              frame={frame}
              targetValue={starsCount}
              startFrame={30}
              endFrame={90}
              opacity={statOpacity1}
              colorClass="text-blue-500"
              label="GitHub Stars"
              monoFontFamily={monoFontFamily}
            />

            <AnimatedCounter
              frame={frame}
              targetValue={forksCount}
              startFrame={36}
              endFrame={96}
              opacity={statOpacity2}
              colorClass="text-emerald-400"
              label="Forks"
              monoFontFamily={monoFontFamily}
            />

            <AnimatedCounter
              frame={frame}
              targetValue={contributors}
              startFrame={42}
              endFrame={102}
              opacity={statOpacity3}
              colorClass="text-purple-400"
              label="Contributors"
              suffix="+"
              monoFontFamily={monoFontFamily}
            />
          </div>

          {/* Quote */}
          <div
            className="mt-20 text-center"
            style={{
              opacity: quoteOpacity,
              transform: `translateY(${quoteY}px)`,
            }}
          >
            <p className="text-3xl font-light italic text-slate-300 max-w-3xl mx-auto leading-relaxed">
              "从 <span className="text-white font-medium">研究原型</span> 到{" "}
              <span className="text-white font-medium">生产就绪平台</span>，
              <br />
              塑造 Agent-Oriented Programming 的未来。"
            </p>
          </div>
        </div>
      </AbsoluteFill>
    </StatusWrapper>
  );
};
