import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BackgroundOrbs } from "../components";
import type { BaseSceneProps } from "../types/scene";
import { fadeIn, slideIn } from "../utils/animations";

export const Scene3Philosophy: React.FC<BaseSceneProps> = ({
  monoFontFamily,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Text animations with stagger (slide from left)
  const text1Opacity = fadeIn(frame, 0, 0.8 * fps);
  const text1X = slideIn(frame, 0, 0.8 * fps, -20);

  const text2Opacity = fadeIn(frame, 0.3 * fps, 1.1 * fps);
  const text2X = slideIn(frame, 0.3 * fps, 1.1 * fps, -20);

  const text3Opacity = fadeIn(frame, 0.6 * fps, 1.4 * fps);
  const text3X = slideIn(frame, 0.6 * fps, 1.4 * fps, -20);

  // Workflow nodes animation (slide from bottom)
  const node1Opacity = fadeIn(frame, 0.5 * fps, 1.1 * fps);
  const node1Y = slideIn(frame, 0.5 * fps, 1.1 * fps, 30);

  const node2Opacity = fadeIn(frame, 0.7 * fps, 1.3 * fps);
  const node2Y = slideIn(frame, 0.7 * fps, 1.3 * fps, 30);

  const node3Opacity = fadeIn(frame, 0.9 * fps, 1.5 * fps);
  const node3Y = slideIn(frame, 0.9 * fps, 1.5 * fps, 30);

  // Motto animation (2s - 3s)
  const mottoOpacity = fadeIn(frame, 2 * fps, 3 * fps);

  // Line drawing animation (1.5s - 2.5s)
  const lineProgress = interpolate(frame, [1.5 * fps, 2.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-[#020617] flex items-center justify-center">
      {/* Background Orbs */}
      <BackgroundOrbs />

      <div className="max-w-6xl mx-auto w-full relative h-[500px] flex items-center justify-center">
        {/* Left Content */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 max-w-xl z-10 px-4">
          <h2 className="text-6xl font-bold mb-8 leading-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              不只是
            </span>
            <span className="block text-white mt-2">Agent 框架</span>
          </h2>

          <div className="space-y-6 text-lg text-slate-300 font-light leading-relaxed">
            <p
              style={{
                opacity: text1Opacity,
                transform: `translateX(${text1X}px)`,
              }}
            >
              LangChain 是链式调用工具库，
            </p>
            <p
              style={{
                opacity: text2Opacity,
                transform: `translateX(${text2X}px)`,
              }}
            >
              而 AgentScope 是 <span className="text-white font-medium">多智能体编排平台</span>。
            </p>
            <p
              className="text-sm text-slate-400 mt-8 border-l-2 border-blue-500 pl-4"
              style={{
                opacity: text3Opacity,
                transform: `translateX(${text3X}px)`,
              }}
            >
              Agent-Oriented Programming
              <br />
              让多智能体系统从第一天就具备生产级能力
            </p>
          </div>
        </div>

        {/* Right - Workflow Diagram */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[400px]">
          {/* Node 1 - REACT AGENT */}
          <div
            className="workflow-node absolute top-0 left-0 w-48"
            style={{
              opacity: node1Opacity,
              transform: `translateY(${node1Y}px)`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-blue-400" style={{ fontFamily: monoFontFamily }}>
                REACT AGENT
              </span>
            </div>
            <p className="text-sm text-slate-400">推理 + 行动 + 工具调用</p>
          </div>

          {/* Node 2 - MULTI-AGENT */}
          <div
            className="workflow-node absolute top-[120px] left-[100px] w-48"
            style={{
              opacity: node2Opacity,
              transform: `translateY(${node2Y}px)`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs text-purple-400" style={{ fontFamily: monoFontFamily }}>
                MULTI-AGENT
              </span>
            </div>
            <p className="text-sm text-slate-400">Message Hub + Pipeline</p>
          </div>

          {/* Node 3 - PRODUCTION */}
          <div
            className="workflow-node absolute top-[240px] left-[200px] w-48"
            style={{
              opacity: node3Opacity,
              transform: `translateY(${node3Y}px)`,
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-400" style={{ fontFamily: monoFontFamily }}>
                PRODUCTION
              </span>
            </div>
            <p className="text-sm text-slate-400">Runtime + Sandbox + OTel</p>
          </div>

          {/* Connection Lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: -1 }}
          >
            <path
              d="M 100 40 L 150 140"
              stroke="rgba(59,130,246,0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              strokeDashoffset={100 * (1 - lineProgress)}
            />
            <path
              d="M 200 160 L 250 260"
              stroke="rgba(139,92,246,0.3)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              strokeDashoffset={100 * (1 - lineProgress)}
            />
          </svg>
        </div>
      </div>

      {/* Bottom Motto */}
      <div
        className="absolute bottom-20 left-0 right-0 text-center"
        style={{ opacity: mottoOpacity }}
      >
        <p className="text-slate-500 text-sm tracking-widest" style={{ fontFamily: monoFontFamily }}>
          透明 · 可控 · 生产就绪
        </p>
      </div>
    </AbsoluteFill>
  );
};
