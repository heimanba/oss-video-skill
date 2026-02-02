---
name: oss-video
description: 为开源官网制作宣传视频，传入 {owner}/{repo} 参数
---
# opensource-video 开源项目场景制作指南

## 工作流程

### 信息收集

制作宣传视频前，需要通过以下方式收集项目信息：

#### 1. 前置条件

启动 Chrome Debug Protocol (CDP)，用于后续浏览器自动化操作：

```bash
.qoder/skills/oss-video/scripts/check-cdp.sh
```


#### 2. GitHub 数据获取

使用统一脚本获取所有 GitHub 相关数据：

```bash
# 从项目根目录执行
.qoder/skills/oss-video/scripts/fetch-github-stats.sh {owner}/{repo}

# 示例：获取 alibaba/higress 的信息
.qoder/skills/oss-video/scripts/fetch-github-stats.sh alibaba/higress
```

脚本将数据保存至 `src/data/github-stats.json`，包含以下字段：

##### 2.1 仓库基本信息 (`repoInfo`)

| 字段 | 用途 | 对应场景 |
|------|------|----------|
| `name` | 项目名称 | Scene1 标题 |
| `description` | 项目描述/Slogan | Scene1 Slogan、Scene3 定位 |
| `htmlUrl` | GitHub 仓库链接 | Scene5 CTA 按钮跳转 |
| `language` | 主要编程语言 | Scene3 技术栈 |
| `topics` | 项目标签/领域 | Scene3 定位描述 |
| `createdAt` | 创建时间 | Scene1 "EST. 20XX" |
| `licenseName` | 开源许可证 | 可选展示 |
| `ownerLogin` | 组织/作者名 | Scene1 "Powered by XXX" |
| `ownerAvatarUrl` | 组织头像 | 可选 Logo 素材 |
| `homepage` | 项目官网 | **需进一步访问收集信息** |
| `defaultBranch` | 默认分支 | 获取贡献者时需要 |

##### 2.2 统计数据 (`stats`)

| 字段 | 用途 | 对应场景 |
|------|------|----------|
| `starsCount` | Stars 数量 | Scene2 数据展示 |
| `forksCount` | Forks 数量 | Scene2 数据展示 |
| `contributorsCount` | 贡献者总数 | Scene4 统计 |
| `pullRequestsCount` | PR 总数 | Scene4 统计 |
| `countriesCount` | 贡献者国家数（估算） | Scene4 统计 |

##### 2.3 贡献者列表 (`contributors`)

返回前 24 个贡献者的详细信息：
- `login`: 用户名
- `id`: 用户 ID
- `avatar_url`: 头像 URL（用于 Scene4 头像墙）
- `contributions`: 贡献次数

**注意**：GitHub API 有速率限制（未认证 60次/小时，认证后 5000次/小时）。如遇限流，可设置 `GITHUB_TOKEN` 环境变量后重试。

#### 3. 官网信息补充（homepage）

如果 GitHub API 返回了 `homepage` 字段（项目官网 URL），需要进一步访问官网收集补充信息。

##### 3.1 前置依赖

确保 CDP 已启动（步骤 1），然后使用 `Browser Agent` 访问官网。

##### 3.2 Logo URL 获取

使用脚本自动获取 Logo URL：

```bash
# 从项目根目录执行
.qoder/skills/oss-video/scripts/logo-url.sh <homepage_url>

# 示例
.qoder/skills/oss-video/scripts/logo-url.sh https://higress.ai
```

**脚本查找优先级**：
1. `<link rel="apple-touch-icon">` - 高清图标（180x180+）
2. `<link rel="icon">` - favicon
3. header/nav 区域的 logo 图片
4. 常见路径探测：`/logo.svg`, `/favicon.ico` 等

**失败时的备选方案**：
- 使用 `owner.avatar_url`（GitHub 组织头像）
- 使用文字 Logo 方案（见 Scene1 定制说明）

##### 3.3 品牌主色调获取

使用 `Browser Agent` 访问官网后，通过以下方式提取品牌色：

**输出格式**：
```
主色调: #3B82F6 (blue-500)
辅助色: #8B5CF6 (purple-500)
```

##### 3.4 其他官网信息采集

使用 `Browser Agent` 浏览官网，收集以下信息：

| 信息类型 | 查找位置 | 用途 |
|---------|---------|------|
| 产品定位 | 首页 Hero 区域 | Scene3 理念描述 |
| 用户数据 | 首页/关于页 | Scene2 第三指标（企业用户/下载量） |
| 竞品对比 | 文档/对比页 | Scene3 差异化描述 |
| 社区数据 | 社区/贡献者页 | Scene4 国家数等 |
| 未来愿景 | Roadmap/博客 | Scene5 愿景文案 |

**第三指标备选项**（按优先级）：
1. 企业用户数 - "500+ Enterprise Users"
2. 全球安装量 - "100M+ Downloads"
3. npm 周下载量 - 通过 `https://api.npmjs.org/downloads/point/last-week/{package}` 获取
4. Docker 拉取量 - Docker Hub 页面获取
5. 贡献者数量 - 已从 GitHub API 获取

#### 4. 数据验证与转换

在收集完数据后，需进行格式化和验证处理：

##### 4.1 数据格式转换规则

| 原始数据 | 转换规则 | 输出示例 |
|---------|---------|---------|
| `createdAt: "2019-03-15T..."` | 提取年份 | `"EST. 2019"` |
| `starsCount: 12345` | 千位分隔或简写 | `"12,345"` 或 `"12K+"` |
| `forksCount: 1234` | 千位分隔或简写 | `"1,234"` 或 `"1.2K+"` |
| 贡献者数量 > 100 | 显示为区间 | `"500+"` |

**数字格式化规则**：
- `< 1,000`: 显示原数字
- `1,000 - 9,999`: 显示千位分隔（如 `1,234`）或 `X.XK+`
- `10,000 - 999,999`: 显示为 `XXK+`（如 `12K+`）
- `>= 1,000,000`: 显示为 `X.XM+`（如 `1.2M+`）

##### 4.2 空值与错误处理

| 情况 | 处理方式 |
|------|---------|
| `repoInfo.homepage` 为空 | 跳过官网信息采集，使用 GitHub 数据 |
| Logo URL 获取失败 | 使用 `repoInfo.ownerAvatarUrl` 或文字 Logo |
| 官网无法访问 | 记录错误，仅使用 GitHub 数据 |
| 第三指标无法获取 | 使用 `stats.contributorsCount` 作为替代 |
| 脚本执行失败 | 检查网络连接或设置 `GITHUB_TOKEN` 后重试 |

##### 4.3 数据完整性验证

执行信息收集后，确保以下**必需字段**已获取：

```
Scene1 必需: repoInfo.name, repoInfo.description, repoInfo.createdAt, repoInfo.ownerLogin, logo_url
Scene2 必需: stats.starsCount, stats.forksCount, 第三指标
Scene3 必需: repoInfo.language, repoInfo.topics, 竞品对比描述
Scene4 必需: contributors (头像列表), stats.pullRequestsCount
Scene5 必需: repoInfo.htmlUrl, CTA 文案
```

#### 5. 信息收集检查清单

```markdown
□ 基础信息（Scene1）- 来自 github-stats.json
  - [ ] 项目名称 (repoInfo.name)
  - [ ] 项目描述/Slogan (repoInfo.description)
  - [ ] 创建年份 (repoInfo.createdAt → "EST. 20XX")
  - [ ] 所属组织 (repoInfo.ownerLogin)
  - [ ] GitHub 仓库链接 (repoInfo.htmlUrl)

□ 数据指标（Scene2）- 来自 github-stats.json
  - [ ] GitHub Stars (stats.starsCount)
  - [ ] GitHub Forks (stats.forksCount)
  - [ ] 第三指标（企业用户/下载量/安装量）
  - [ ] 第三指标来源说明

□ 技术定位（Scene3）- 来自 github-stats.json + 官网
  - [ ] 主要语言 (repoInfo.language)
  - [ ] 技术标签 (repoInfo.topics)
  - [ ] 与竞品的差异化描述
  - [ ] 核心价值主张

□ 品牌素材 - 需从官网获取
  - [ ] Logo URL（或备选方案：repoInfo.ownerAvatarUrl）
  - [ ] 品牌主色调 HEX 值
  - [ ] 辅助色调 HEX 值
  - [ ] 官方 Slogan

□ 社区数据（Scene4）- 来自 github-stats.json
  - [ ] 贡献者头像列表 (contributors，至少 20 个)
  - [ ] 贡献者总数 (stats.contributorsCount)
  - [ ] PR 数量 (stats.pullRequestsCount)
  - [ ] 贡献者国家数 (stats.countriesCount)

□ 愿景内容（Scene5）- 需从官网获取
  - [ ] CTA 主文案
  - [ ] CTA 副文案
  - [ ] 未来发展方向/Roadmap 摘要
```

**注意**：完成信息收集后，整体输出 Report 报告文档，确保所有数据完整后再进行下一步场景定制。

---

## 场景概览

当前项目包含 5 个场景，构成一个完整的开源项目介绍视频叙事：

| 场景 | 文件 | 用途 | 核心要素 |
|------|------|------|----------|
| Scene1 | `Scene1Origin.tsx` | 起源/品牌展示 | Logo、项目名称、Slogan、成立时间 |
| Scene2 | `Scene2Growth.tsx` | 数据增长展示 | Stars、Forks、全球安装量等统计 |
| Scene3 | `Scene3Philosophy.tsx` | 理念/定位阐述 | 与竞品对比、技术栈展示、核心价值 |
| Scene4 | `Scene4Community.tsx` | 社区展示 | 贡献者头像、国家数、PR 数量 |
| Scene5 | `Scene5Future.tsx` | 愿景/行动号召 | 未来方向、CTA 按钮 |

---

## 入口文件配置

在定制场景之前，需要先修改入口文件：

### Composition.tsx - 数据源配置

```tsx
// 修改 GitHub 仓库地址，用于获取 Stars、Forks、贡献者等数据
repo = "owner/repo"  // 替换为目标项目的 GitHub 仓库
```

Composition 使用 Zod schema 定义参数，支持 Remotion Studio 可视化编辑：

```tsx
export const CompositionSchema = z.object({
  fontFamily: z.string().describe("Main font family"),
  monoFontFamily: z.string().describe("Monospace font family"),
  repo: z.string().optional().describe("GitHub repository"),
});
```

### Root.tsx - Composition 标识

```tsx
// 修改 Composition ID（用于渲染命令）
id="ProjectNamePromo"  // 替换为项目名称

// 确保 schema 正确引用
schema={CompositionSchema}
```

---

## 为其他开源项目定制场景

### Scene1Origin - 起源场景

需要修改的内容：

```tsx
// 1. Logo 设计 - 根据项目品牌选择合适的方案

// 方案 A：远程 Logo URL（推荐，从官网获取 apple-touch-icon 或 logo）
<Img src="https://example.com/logo.png" alt="{repo} Logo" className="h-12 w-auto" />

// 方案 B：文字 Logo（双色，无法获取远程 Logo 时的备选）
<div className="... bg-white">
  <span className="text-blue-600">Hi</span>
  <span className="text-slate-900">gress</span>
</div>

// 方案 C：渐变背景 Logo（无法获取远程 Logo 时的备选）
<div className="... bg-gradient-to-br from-orange-500 to-amber-400 text-white">
  <span>Hi</span>
</div>

// 方案 D：本地图片/SVG Logo（需要 import { staticFile } from "remotion"）
<img src={staticFile("logo.svg")} className="w-16 h-16" />

// 方案 E：图标 + 文字组合
<div className="flex items-center gap-2">
  <IconComponent className="w-8 h-8" />
  <span>Name</span>
</div>

// 2. 标题文字
const titleText = "ProjectName";  // 改为你的项目名称

// 3. Slogan
<p>Your Project Slogan</p>  // 改为你的项目 Slogan

// 4. 元信息
<span>EST. 2023</span>           // 成立年份
<span>Powered by XXX</span>      // 技术栈或版本历程
```

### Scene2Growth - 增长数据场景

需要修改的内容：

```tsx
// 1. 默认统计数据（当 API 获取失败时使用）
const starsCount = stats?.starsCount ?? 10000;  // 默认 Stars
const forksCount = stats?.forksCount ?? 1000;   // 默认 Forks

// 2. 第三个指标 - 可自定义为任意指标
globalInstalls = 100,  // 默认值，传入 props

// 在 AnimatedCounter 中修改：
<AnimatedCounter
  targetValue={globalInstalls}
  label="Global Installs"   // 改为: "企业用户"、"Downloads"、"Active Users" 等
  suffix="万+"              // 改为: "+"、"K"、"M" 等
/>

// 3. 描述文案
<p>从第一个 commit 到全球开发者信赖的基础设施</p>

// 4. 结语引言
<p>"从 <span>实验性工具</span> 到 <span>企业级平台</span>"</p>
```

### Scene3Philosophy - 理念场景

需要修改的内容：

```tsx
// 1. 左侧标题（渐变色）
<span className="bg-gradient-to-r from-blue-400 to-purple-400">不只是</span>
<span>工具箱</span>  // 改为你的项目定位

// 2. 与竞品对比的文案
<p>LangChain 是锤子与钉子，</p>
<p>而 ProjectName 是<span>脚手架</span>。</p>

// 3. 技术定位（左侧边框装饰）
<p className="border-l-2 border-blue-500">  // 边框颜色需与品牌色一致
  Backend as a Service + LLMOps
  <br />
  让 AI 应用开发从第一天就具备生产级能力
</p>

// 4. 工作流节点（右侧）- 每个节点需修改颜色、标签和描述
// Node 1
<div className="w-2 h-2 rounded-full bg-blue-500" />     // 节点颜色
<span className="text-blue-400">MODEL</span>             // 标签颜色和文字
<p>GPT-4 / Claude / Llama</p>                            // 描述

// Node 2
<div className="w-2 h-2 rounded-full bg-purple-500" />
<span className="text-purple-400">ORCHESTRATION</span>
<p>Workflow & Agent</p>

// Node 3
<div className="w-2 h-2 rounded-full bg-emerald-500" />
<span className="text-emerald-400">DEPLOYMENT</span>
<p>API + WebApp</p>

// 5. 连接线颜色（需与对应节点颜色一致）
<path stroke="rgba(59,130,246,0.3)" />   // Node1→Node2 连线，蓝色
<path stroke="rgba(139,92,246,0.3)" />   // Node2→Node3 连线，紫色

// 6. 底部格言
<p>简单 · 克制 · 迭代迅速</p>
```

### Scene4Community - 社区场景

需要修改的内容：

```tsx
// 1. 默认显示值（当 API 获取失败时使用，根据项目规模调整）
const contributorsDisplay = stats ? formatCountWithPlus(stats.contributorsCount) : "100+";
const countriesDisplay = stats ? `${stats.countriesCount}+` : "20+";
const pullRequestsDisplay = stats ? formatCountWithPlus(stats.pullRequestsCount) : "1,000+";

// 2. 描述文案
<p>来自全球的开发者共同书写开源的未来</p>
```

### Scene5Future - 未来场景

需要修改的内容：

```tsx
// 1. 主标题
<span>Define your AI.</span>           // 动作召唤语
<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
  Modify the Future.                   // 愿景声明（渐变色需与品牌色一致）
</span>

// 2. 描述
<p>从 RAG 到 Agent，从 Workflow 到 Autonomous AI。</p>
<p>ProjectName 正在从工具进化为 <span>更大的愿景</span>。</p>

// 3. CTA 按钮
<div>Star on GitHub</div>     // 主按钮（保持不变）
<div>Explore ProjectName</div> // 次按钮（改为项目名称）
```

---

## 配色方案修改清单

当需要根据项目品牌色调整配色时，以下是所有需要修改的位置：

| 场景 | 位置 | 默认颜色 | 修改示例 |
|------|------|----------|----------|
| Scene1 | Logo 背景/文字 | `text-blue-600` | `text-orange-500` 或 `bg-gradient-to-br from-X to-Y` |
| Scene3 | 标题渐变 | `from-blue-400 to-purple-400` | `from-orange-400 to-amber-400` |
| Scene3 | 边框装饰 | `border-blue-500` | `border-orange-500` |
| Scene3 | Node1 颜色 | `bg-blue-500`, `text-blue-400` | `bg-orange-500`, `text-orange-400` |
| Scene3 | 连接线颜色 | `rgba(59,130,246,0.3)` | `rgba(249,115,22,0.3)` |
| Scene5 | 标题渐变 | `from-blue-400 via-purple-400 to-pink-400` | `from-orange-400 via-amber-400 to-yellow-400` |
| 全局 | BackgroundOrbs | 蓝+紫预设 | 自定义 `OrbConfig[]` |

### 常用 Tailwind 颜色对照

```
蓝色系: blue-400/500/600    rgba(59,130,246,X)
紫色系: purple-400/500      rgba(139,92,246,X)
橙色系: orange-400/500      rgba(249,115,22,X)
琥珀色: amber-400/500       rgba(245,158,11,X)
绿色系: emerald-400/500     rgba(16,185,129,X)
红色系: red-400/500         rgba(239,68,68,X)
```

---

## 可复用组件

| 组件 | 用途 | 关键 Props |
|------|------|------------|
| `BackgroundOrbs` | 背景模糊光球效果 | `orbs`: OrbConfig[] |
| `AnimatedCounter` | 数字递增动画 | `targetValue`, `startFrame`, `endFrame`, `suffix` |
| `AvatarItem` | 贡献者头像展示 | `contributor`, `index`, `frame` |
| `StatItem` | 静态统计项 | `value`, `label` |
| `StatusWrapper` | 加载/错误状态包装 | `loading`, `error`, `loadingMessage` |

### 背景预设 `orbPresets`

```tsx
import { BackgroundOrbs, orbPresets } from "../components";

// 使用预设
<BackgroundOrbs orbs={orbPresets.default} />   // 双色（蓝+紫）
<BackgroundOrbs orbs={orbPresets.triColor} />  // 三色（蓝+紫+粉）- 用于开场和结尾
<BackgroundOrbs orbs={orbPresets.minimal} />   // 单色简约
```

---

## 动画工具函数

位于 `src/utils/animations.ts`：

| 函数 | 作用 | 参数 |
|------|------|------|
| `fadeIn` | 淡入 (0→1) | `frame, startFrame, endFrame` |
| `fadeOut` | 淡出 (1→0) | `frame, startFrame, endFrame` |
| `slideIn` | 滑入位移 | `frame, startFrame, endFrame, distance` |
| `scaleIn` | 缩放进入 | `frame, startFrame, endFrame, overshoot` |
| `countUp` | 数字递增 | `frame, startFrame, endFrame, targetValue` |
| `springIn` | Spring 弹性动画 | `frame, fps, options?` |
| `createStaggerAnimation` | 批量交错动画 | `frame, count, options` |

### Spring 预设 `springPresets`

```tsx
import { springPresets } from "../utils/animations";

springPresets.smooth  // { damping: 200 } - 平滑无弹跳，适合细腻入场
springPresets.snappy  // { damping: 20, stiffness: 200 } - 快速响应
springPresets.bouncy  // { damping: 8 } - 活泼弹跳效果
springPresets.heavy   // { damping: 15, stiffness: 80, mass: 2 } - 厚重感
```

### 动画示例

```tsx
import { fadeIn, slideIn, springIn, springPresets } from "../utils/animations";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// 淡入动画：从 0 秒到 0.8 秒完成（使用 fps 计算帧数）
const opacity = fadeIn(frame, 0, 0.8 * fps);

// 滑入动画：从 20px 偏移滑入到原位
const translateY = slideIn(frame, 0, 0.8 * fps, 20);

// Spring 动画：自然弹性效果
const logoScale = spring({
  frame,
  fps,
  config: springPresets.bouncy, // 活泼弹跳
});

// Spring + interpolate 组合：映射到位移
const titleSpring = spring({ frame, fps, delay: 10, config: springPresets.smooth });
const titleY = interpolate(titleSpring, [0, 1], [32, 0]);

// 应用到元素
<div style={{ opacity, transform: `translateY(${translateY}px)` }}>
  Content
</div>
```

---

## 定制建议

1. **配色方案**: 根据项目品牌色修改 Tailwind 类名（如 `text-blue-500` → `text-green-500`）

2. **数据源**: 修改 `useGitHubStats` hook 中的 `repo` 参数以获取正确的 GitHub 数据
   ```tsx
   const { stats, contributors, loading, error } = useGitHubStats("owner/repo");
   ```

3. **内容本地化**: 根据目标受众调整中英文文案

4. **时长调整**: 使用 `useVideoConfig()` 获取 fps，以秒数乘以 fps 来控制动画时长
   ```tsx
   const { fps } = useVideoConfig();
   // 0.8 秒淡入动画
   const opacity = fadeIn(frame, 0, 0.8 * fps);
   // 0.5 秒后开始，持续 1 秒的动画
   const slide = slideIn(frame, 0.5 * fps, 1.5 * fps, 20);
   ```

5. **自定义背景**: 通过 `orbPresets` 或自定义 `OrbConfig[]` 调整背景效果
   ```tsx
   const customOrbs: OrbConfig[] = [
     {
       widthClass: "w-96",
       heightClass: "h-96",
       colorClass: "bg-green-600",  // 自定义颜色
       position: { top: "-10%", left: "-10%" },
       blur: 100,
       opacity: 0.4,
     },
   ];
   ```

---

## Remotion 最佳实践

本项目遵循 Remotion 官方最佳实践，以下是关键要点：

### 1. 使用 fps 计算帧数

动画时长应使用秒数乘以 fps，而非硬编码帧数：

```tsx
// ✅ 推荐：使用 fps 计算
const { fps } = useVideoConfig();
const opacity = fadeIn(frame, 0, 0.8 * fps);

// ❌ 避免：硬编码帧数
const opacity = fadeIn(frame, 0, 24);
```

### 2. 使用 TransitionSeries 实现场景过渡

使用 `@remotion/transitions` 的 `TransitionSeries` 组件实现场景间的专业过渡效果：

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>
    <Scene1 />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  <TransitionSeries.Sequence durationInFrames={120}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

**注意**：TransitionSeries 会自动计算总时长（减去过渡重叠时间）。

### 3. 使用 spring() 实现自然动画

对于 UI 入场动画，推荐使用 `spring()` 替代线性 `interpolate`：

```tsx
import { spring } from "remotion";

// ✅ 推荐：使用 spring 获得自然动效
const logoScale = spring({
  frame,
  fps,
  config: { damping: 15, stiffness: 100 }, // 轻微弹跳
});

// 或使用预设
import { springPresets } from "../utils/animations";
const scale = spring({
  frame,
  fps,
  config: springPresets.smooth, // 平滑无弹跳
});
```

### 4. 使用 Zod Schema 实现参数化

使用 Zod schema 让 Composition 支持 Remotion Studio 的可视化 props 编辑：

```tsx
import { z } from "zod";

export const CompositionSchema = z.object({
  fontFamily: z.string().describe("Main font family"),
  repo: z.string().optional().describe("GitHub repository"),
});

export type CompositionProps = z.infer<typeof CompositionSchema>;

// 在 Root.tsx 中使用
<Composition
  schema={CompositionSchema}
  defaultProps={{ fontFamily: "...", repo: "owner/repo" }}
  // ...
/>
```

### 5. Props 类型使用 type 而非 interface

Remotion 对 `type` 的类型推断更友好：

```tsx
// ✅ 推荐
export type CompositionProps = z.infer<typeof CompositionSchema>;

// ❌ 避免
export interface CompositionProps { ... }
```

### 6. 禁止 CSS/Tailwind 动画类

所有动画必须通过 `useCurrentFrame()` 驱动，不要使用：
- CSS `transition-*` 属性
- CSS `animation-*` 属性
- Tailwind `animate-*` 类名

---

## 文件结构

```
src/
├── scenes/
│   ├── Scene1Origin.tsx      # 起源场景
│   ├── Scene2Growth.tsx      # 增长场景
│   ├── Scene3Philosophy.tsx  # 理念场景
│   ├── Scene4Community.tsx   # 社区场景
│   └── Scene5Future.tsx      # 未来场景
├── components/
│   ├── BackgroundOrbs.tsx    # 背景光球
│   ├── AnimatedCounter.tsx   # 动画计数器
│   ├── AvatarItem.tsx        # 头像项
│   ├── StatItem.tsx          # 统计项
│   ├── StatusOverlay.tsx     # 状态覆盖层
│   └── index.ts              # 组件导出
├── utils/
│   └── animations.ts         # 动画工具函数
├── types/
│   └── scene.ts              # 场景类型定义
└── hooks/
    └── useGitHubStats.ts     # GitHub 数据获取
```