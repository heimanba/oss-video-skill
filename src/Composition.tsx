import {
  AbsoluteFill,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { z } from "zod";
import { Scene1Origin } from "./scenes/Scene1Origin";
import { Scene2Growth } from "./scenes/Scene2Growth";
import { Scene3Philosophy } from "./scenes/Scene3Philosophy";
import { Scene4Community } from "./scenes/Scene4Community";
import { Scene5Future } from "./scenes/Scene5Future";
import { useGitHubStats } from "./hooks/useGitHubStats";

// Zod schema for composition props
export const CompositionSchema = z.object({
  fontFamily: z.string().describe("Main font family"),
  monoFontFamily: z.string().describe("Monospace font family"),
  repo: z
    .string()
    .optional()
    .default("agentscope-ai/agentscope")
    .describe("GitHub repository (e.g., 'langgenius/dify')"),
});

export type CompositionProps = z.infer<typeof CompositionSchema>;

// Scene durations in frames (at 30fps)
const SCENE_DURATIONS = {
  scene1: 90, // ~3 seconds
  scene2: 150, // ~5 seconds (counter animation takes longer)
  scene3: 120, // ~4 seconds
  scene4: 120, // ~4 seconds
  scene5: 120, // ~4 seconds
};

const TRANSITION_DURATION = 15; // 0.5 seconds fade

// Grain overlay component using SVG directly
const GrainOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50" style={{ opacity: 0.03 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={3}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  );
};

export const MyComposition: React.FC<CompositionProps> = ({
  fontFamily,
  monoFontFamily,
  repo = "agentscope-ai/agentscope",
}) => {
  // Fetch GitHub stats once at composition level
  const { stats, contributors, loading, error } = useGitHubStats(repo);

  const transitionTiming = linearTiming({ durationInFrames: TRANSITION_DURATION });

  return (
    <AbsoluteFill className="bg-[#020617]" style={{ fontFamily }}>
      {/* Background Music */}
      <Audio src={staticFile("audio/bgm.mp3")} volume={0.5} />

      {/* Grain Overlay */}
      <GrainOverlay />

      {/* Scene Transitions using @remotion/transitions */}
      <TransitionSeries>
        {/* Scene 1: Origin */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene1}>
          <Scene1Origin monoFontFamily={monoFontFamily} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />

        {/* Scene 2: Growth */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene2}>
          <Scene2Growth
            monoFontFamily={monoFontFamily}
            stats={stats}
            loading={loading}
            error={error}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />

        {/* Scene 3: Philosophy */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene3}>
          <Scene3Philosophy monoFontFamily={monoFontFamily} />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />

        {/* Scene 4: Community */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene4}>
          <Scene4Community
            monoFontFamily={monoFontFamily}
            stats={stats}
            contributors={contributors}
            loading={loading}
            error={error}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={transitionTiming}
        />

        {/* Scene 5: Future */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.scene5}>
          <Scene5Future monoFontFamily={monoFontFamily} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// Export total duration for Root.tsx
// With TransitionSeries, transitions overlap adjacent scenes
// Total = sum of scenes - (number of transitions * transition duration)
export const TOTAL_DURATION =
  SCENE_DURATIONS.scene1 +
  SCENE_DURATIONS.scene2 +
  SCENE_DURATIONS.scene3 +
  SCENE_DURATIONS.scene4 +
  SCENE_DURATIONS.scene5 -
  4 * TRANSITION_DURATION; // 4 transitions between 5 scenes
