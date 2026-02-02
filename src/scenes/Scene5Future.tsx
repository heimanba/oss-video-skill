import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { BackgroundOrbs, orbPresets } from "../components";
import type { BaseSceneProps } from "../types/scene";
import { fadeIn } from "../utils/animations";

export const Scene5Future: React.FC<BaseSceneProps> = ({
  monoFontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge animation (0s - 0.6s)
  const badgeOpacity = fadeIn(frame, 0, 0.6 * fps);

  // Title line 1 animation with spring for natural slide
  const line1Spring = spring({
    frame,
    fps,
    delay: Math.round(0.3 * fps),
    config: { damping: 200 }, // Smooth, no bounce
  });
  const line1Opacity = line1Spring;
  const line1Y = interpolate(line1Spring, [0, 1], [32, 0]);

  // Title line 2 animation with spring
  const line2Spring = spring({
    frame,
    fps,
    delay: Math.round(0.5 * fps),
    config: { damping: 200 },
  });
  const line2Opacity = line2Spring;
  const line2Y = interpolate(line2Spring, [0, 1], [32, 0]);

  // Description animation (0.9s - 1.7s)
  const descOpacity = fadeIn(frame, 0.9 * fps, 1.7 * fps);

  // CTA animation (1.3s - 1.9s)
  const ctaOpacity = fadeIn(frame, 1.3 * fps, 1.9 * fps);

  return (
    <AbsoluteFill className="bg-[#020617] flex items-center justify-center">
      {/* Background Orbs */}
      <BackgroundOrbs orbs={orbPresets.triColor} />

      <div className="max-w-5xl mx-auto text-center px-4">
        {/* Badge */}
        <div className="mb-8 inline-block" style={{ opacity: badgeOpacity }}>
          <span
            className="text-xs tracking-[0.3em] text-blue-400 border border-blue-400/30 px-4 py-2 rounded-full"
            style={{ fontFamily: monoFontFamily }}
          >
            WHAT'S NEXT
          </span>
        </div>

        {/* Title */}
        <h2 className="text-7xl font-bold mb-8 leading-tight">
          <span
            className="block"
            style={{
              opacity: line1Opacity,
              transform: `translateY(${line1Y}px)`,
            }}
          >
            Define Your Multi-Agent System.
          </span>
          <span
            className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mt-2"
            style={{
              opacity: line2Opacity,
              transform: `translateY(${line2Y}px)`,
            }}
          >
            Shape the Future of AOP.
          </span>
        </h2>

        {/* Description */}
        <p
          className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          style={{ opacity: descOpacity }}
        >
          从语音智能体到 Agent Skill，从 A2UI 到 Agentic RL。
          <br />
          AgentScope 正在从框架进化为{" "}
          <span className="text-white font-medium">新的编程范式</span>。
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-row justify-center gap-4"
          style={{ opacity: ctaOpacity }}
        >
          <div className="group relative px-8 py-4 bg-white text-black font-medium rounded-full overflow-hidden flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Star on GitHub
          </div>
          <div className="px-8 py-4 border border-white/20 text-white font-medium rounded-full">
            探索 AgentScope
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
