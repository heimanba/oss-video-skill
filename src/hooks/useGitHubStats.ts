import { useEffect, useState } from "react";
import { delayRender, continueRender } from "remotion";

// Import pre-fetched static data (generated at build time)
import staticGitHubData from "../data/github-stats.json";

// GitHub API response types
export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  state: string;
}

export interface GitHubRepoInfo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
}

// Community stats data structure
export interface CommunityStats {
  contributorsCount: number;
  countriesCount: number;
  pullRequestsCount: number;
  starsCount: number;
  forksCount: number;
}

export interface UseGitHubStatsResult {
  stats: CommunityStats | null;
  contributors: GitHubContributor[];
  loading: boolean;
  error: string | null;
}

interface UseGitHubStatsOptions {
  /**
   * Whether to use delayRender to wait for data before rendering
   * Set to false during development or if you want to show loading state
   */
  delayRenderUntilLoaded?: boolean;
}

// Type for static data structure
interface StaticGitHubData {
  repo: string | null;
  fetchedAt: string | null;
  stats: CommunityStats | null;
  contributors: GitHubContributor[];
}

/**
 * Check if static data is valid and matches the requested repo
 */
function hasValidStaticData(repo: string): boolean {
  const data = staticGitHubData as StaticGitHubData;
  return !!(
    data.repo === repo &&
    data.stats !== null &&
    data.fetchedAt !== null
  );
}

/**
 * Fetches GitHub repository statistics including contributors, PRs, and other metrics
 * Prioritizes pre-fetched static data (from build time), falls back to runtime API fetch
 * @param repo - Repository in format "owner/repo" (e.g., "langgenius/dify")
 * @param options - Configuration options
 */
export function useGitHubStats(
  repo: string,
  options: UseGitHubStatsOptions = {}
): UseGitHubStatsResult {
  const { delayRenderUntilLoaded = true } = options;

  // Check if we have valid static data for this repo
  const useStaticData = hasValidStaticData(repo);

  const [stats, setStats] = useState<CommunityStats | null>(
    useStaticData ? (staticGitHubData as StaticGitHubData).stats : null
  );
  const [contributors, setContributors] = useState<GitHubContributor[]>(
    useStaticData ? (staticGitHubData as StaticGitHubData).contributors : []
  );
  const [loading, setLoading] = useState(!useStaticData);
  const [error, setError] = useState<string | null>(null);

  // Only use delayRender if we need to fetch data at runtime
  const [handle] = useState(() =>
    delayRenderUntilLoaded && !useStaticData ? delayRender() : null
  );

  useEffect(() => {
    // Skip fetch if we have valid static data
    if (useStaticData) {
      return;
    }

    const fetchGitHubData = async () => {
      try {
        const [owner, repoName] = repo.split("/");
        if (!owner || !repoName) {
          throw new Error("Invalid repo format. Expected 'owner/repo'");
        }

        const baseUrl = `https://api.github.com/repos/${owner}/${repoName}`;

        // Fetch data in parallel
        const [repoInfoRes, contributorsRes, pullsRes] = await Promise.all([
          fetch(baseUrl),
          fetch(`${baseUrl}/contributors?per_page=100&anon=true`),
          fetch(`${baseUrl}/pulls?state=all&per_page=1`),
        ]);

        if (!repoInfoRes.ok) {
          throw new Error(`Failed to fetch repo info: ${repoInfoRes.status}`);
        }

        const repoInfo: GitHubRepoInfo = await repoInfoRes.json();

        // Parse contributors count from Link header or response
        let contributorsCount = 0;
        let contributorsList: GitHubContributor[] = [];

        if (contributorsRes.ok) {
          contributorsList = await contributorsRes.json();

          // Check Link header for total count
          const linkHeader = contributorsRes.headers.get("Link");
          if (linkHeader) {
            // Parse last page from Link header to estimate total contributors
            const lastPageMatch = linkHeader.match(
              /page=(\d+)>; rel="last"/
            );
            if (lastPageMatch) {
              contributorsCount = parseInt(lastPageMatch[1], 10) * 100;
            } else {
              contributorsCount = contributorsList.length;
            }
          } else {
            contributorsCount = contributorsList.length;
          }
        }

        // Parse PR count from Link header
        let pullRequestsCount = 0;
        if (pullsRes.ok) {
          const linkHeader = pullsRes.headers.get("Link");
          if (linkHeader) {
            const lastPageMatch = linkHeader.match(
              /page=(\d+)>; rel="last"/
            );
            if (lastPageMatch) {
              pullRequestsCount = parseInt(lastPageMatch[1], 10);
            }
          } else {
            const pulls = await pullsRes.json();
            pullRequestsCount = pulls.length;
          }
        }

        // Estimate countries count based on contributors
        // GitHub API doesn't directly provide country info, so we estimate
        // based on a typical open source distribution ratio
        const countriesCount = Math.min(
          Math.floor(contributorsCount * 0.08) + 10,
          100
        );

        setStats({
          contributorsCount,
          countriesCount,
          pullRequestsCount,
          starsCount: repoInfo.stargazers_count,
          forksCount: repoInfo.forks_count,
        });

        setContributors(contributorsList.slice(0, 24));
        setLoading(false);

        if (handle !== null) {
          continueRender(handle);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch GitHub data";
        setError(errorMessage);
        setLoading(false);

        if (handle !== null) {
          continueRender(handle);
        }
      }
    };

    fetchGitHubData();
  }, [repo, handle, useStaticData]);

  return { stats, contributors, loading, error };
}

/**
 * Formats a number with appropriate suffix (K, M) for display
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Formats a number with "+" suffix for display (e.g., "600+")
 */
export function formatCountWithPlus(count: number): string {
  const rounded = Math.floor(count / 100) * 100;
  if (rounded >= 1000) {
    return `${formatCount(rounded)}+`;
  }
  return `${rounded}+`;
}
