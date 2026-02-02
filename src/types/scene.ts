import type { CommunityStats, GitHubContributor } from "../hooks/useGitHubStats";

/**
 * Base props shared by all scene components
 */
export interface BaseSceneProps {
  /**
   * Monospace font family for labels and code-like text
   */
  monoFontFamily: string;
}

/**
 * Props for scenes that receive GitHub data from parent
 */
export interface GitHubDataProps {
  /**
   * GitHub stats data
   */
  stats: CommunityStats | null;
  /**
   * Loading state
   */
  loading: boolean;
  /**
   * Error message if fetch failed
   */
  error: string | null;
}

/**
 * Props for scenes that receive GitHub data including contributors
 */
export interface GitHubDataWithContributorsProps extends GitHubDataProps {
  /**
   * List of contributors
   */
  contributors: GitHubContributor[];
}

/**
 * Props for scenes that fetch GitHub data (deprecated - use GitHubDataProps)
 */
export interface GitHubSceneProps extends BaseSceneProps {
  /**
   * GitHub repository in format "owner/repo" (e.g., "langgenius/dify")
   */
  repo?: string;
}
