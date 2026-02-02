import "./index.css";
import { Composition } from "remotion";
import { MyComposition, TOTAL_DURATION, CompositionSchema } from "./Composition";
import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

// Load Noto Sans SC (思源黑体) with multiple weights
const { fontFamily: notoSansSCFontFamily } = loadFont("normal", {
  weights: ["300", "400", "500", "600", "700", "900"],
});

// Load JetBrains Mono for code/monospace text
const { fontFamily: monoFontFamily } = loadJetBrainsMono("normal", {
  weights: ["400", "700"],
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AgentScopePromo"
        component={MyComposition}
        schema={CompositionSchema}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          fontFamily: notoSansSCFontFamily,
          monoFontFamily: monoFontFamily,
          repo: "agentscope-ai/agentscope",
        }}
      />
    </>
  );
};

export { notoSansSCFontFamily, monoFontFamily };
