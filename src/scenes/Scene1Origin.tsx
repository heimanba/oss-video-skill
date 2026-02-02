import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring, Img } from "remotion";
import { BackgroundOrbs, orbPresets } from "../components";
import type { BaseSceneProps } from "../types/scene";
import { fadeIn } from "../utils/animations";

export const Scene1Origin: React.FC<BaseSceneProps> = ({
  monoFontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation: spring scale with slight bounce for natural feel
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 }, // Slight bounce
  });
  const logoOpacity = fadeIn(frame, 0, 0.4 * fps);
  
  // Logo rotation for dynamic feel
  const logoRotation = interpolate(frame, [0, 0.8 * fps], [0, 360], {
    extrapolateRight: "clamp",
  });
  
  // Glow effect pulsating
  const glowIntensity = interpolate(
    frame,
    [1 * fps, 2 * fps, 3 * fps],
    [0, 1, 0.6],
    { extrapolateRight: "clamp" }
  );

  // Title typewriter effect (1.5s)
  const titleText = "AgentScope";
  const titleProgress = interpolate(frame, [0, 1.5 * fps], [0, titleText.length], {
    extrapolateRight: "clamp",
  });
  const displayedTitle = titleText.slice(0, Math.floor(titleProgress));

  // Subtitle animation (1s - 1.5s)
  const subtitleOpacity = fadeIn(frame, 1 * fps, 1.5 * fps);
  const subtitleLetterSpacing = interpolate(frame, [1 * fps, 1.5 * fps], [0, 0.2], {
    extrapolateRight: "clamp",
  });

  // Meta info animation (1.3s - 1.8s)
  const metaOpacity = fadeIn(frame, 1.3 * fps, 1.8 * fps);

  return (
    <AbsoluteFill className="bg-[#020617] flex items-center justify-center">
      {/* Background Orbs */}
      <BackgroundOrbs orbs={orbPresets.triColor} />

      {/* Content */}
      <div className="text-center max-w-4xl mx-auto z-10">
        {/* Logo */}
        <div className="mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 p-1"
            style={{
              transform: `scale(${logoScale}) rotate(${logoRotation}deg)`,
              opacity: logoOpacity,
              boxShadow: `0 0 ${40 * glowIntensity}px rgba(61, 80, 245, ${0.6 * glowIntensity}), 0 0 ${80 * glowIntensity}px rgba(44, 70, 201, ${0.4 * glowIntensity})`,
            }}
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Img
                src="https://doc.agentscope.io/_static/logo.svg"
                alt="AgentScope Logo"
                className="w-[70%] h-[70%] object-contain"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-8xl font-bold mb-6 tracking-tighter">
          <span className="text-gradient glow-text">{displayedTitle}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-2xl text-slate-400 font-light"
          style={{
            opacity: subtitleOpacity,
            letterSpacing: `${subtitleLetterSpacing}em`,
          }}
        >
          Where Agents Come Alive
        </p>

        {/* Meta */}
        <div
          className="mt-12 flex justify-center gap-8 text-sm text-slate-500"
          style={{ opacity: metaOpacity, fontFamily: monoFontFamily }}
        >
          <span>EST. 2024</span>
          <span>•</span>
          <span>Powered by Alibaba Tongyi Lab</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
