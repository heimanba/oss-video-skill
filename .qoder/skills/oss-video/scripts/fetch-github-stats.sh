#!/bin/bash
#
# Build-time script to fetch GitHub statistics
# Usage: ./scripts/fetch-github-stats.sh [owner/repo]
#
# Requires: curl, jq

set -e

REPO="${1:-langgenius/dify}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_PATH="${SCRIPT_DIR}/../../../../src/data/github-stats.json"

# Validate repo format
if [[ ! "$REPO" =~ ^[^/]+/[^/]+$ ]]; then
  echo "Error: Invalid repo format. Expected 'owner/repo'" >&2
  exit 1
fi

OWNER="${REPO%/*}"
REPO_NAME="${REPO#*/}"
BASE_URL="https://api.github.com/repos/${OWNER}/${REPO_NAME}"

echo "Fetching GitHub stats for ${REPO}..."

# Create temp files for headers
REPO_HEADERS=$(mktemp)
CONTRIBUTORS_HEADERS=$(mktemp)
PULLS_HEADERS=$(mktemp)

# Cleanup on exit
trap "rm -f $REPO_HEADERS $CONTRIBUTORS_HEADERS $PULLS_HEADERS" EXIT

# Fetch repo info
REPO_INFO=$(curl -s -D "$REPO_HEADERS" "$BASE_URL")

# Check for API errors
if echo "$REPO_INFO" | jq -e '.message' >/dev/null 2>&1; then
  ERROR_MSG=$(echo "$REPO_INFO" | jq -r '.message')
  echo "Error: Failed to fetch repo info: $ERROR_MSG" >&2
  exit 1
fi

# Extract stats from repo info
STARS_COUNT=$(echo "$REPO_INFO" | jq -r '.stargazers_count')
FORKS_COUNT=$(echo "$REPO_INFO" | jq -r '.forks_count')

# Extract repo metadata
PROJECT_NAME=$(echo "$REPO_INFO" | jq -r '.name')
DESCRIPTION=$(echo "$REPO_INFO" | jq -r '.description // ""')
HTML_URL=$(echo "$REPO_INFO" | jq -r '.html_url')
LANGUAGE=$(echo "$REPO_INFO" | jq -r '.language // ""')
TOPICS=$(echo "$REPO_INFO" | jq -c '.topics // []')
CREATED_AT=$(echo "$REPO_INFO" | jq -r '.created_at')
LICENSE_NAME=$(echo "$REPO_INFO" | jq -r '.license.name // ""')
OWNER_LOGIN=$(echo "$REPO_INFO" | jq -r '.owner.login')
OWNER_AVATAR=$(echo "$REPO_INFO" | jq -r '.owner.avatar_url')
HOMEPAGE=$(echo "$REPO_INFO" | jq -r '.homepage // ""')
DEFAULT_BRANCH=$(echo "$REPO_INFO" | jq -r '.default_branch')

# Fetch contributors
CONTRIBUTORS_RESPONSE=$(curl -s -D "$CONTRIBUTORS_HEADERS" "${BASE_URL}/contributors?per_page=100&anon=true")

# Parse contributors count from Link header or response
# Link header format: <url?page=N>; rel="last"
CONTRIBUTORS_LINK=$(grep -i '^link:' "$CONTRIBUTORS_HEADERS" 2>/dev/null | grep -o 'page=[0-9]*' | tail -1 | cut -d= -f2 || echo "")
if [[ -n "$CONTRIBUTORS_LINK" ]]; then
  CONTRIBUTORS_COUNT=$((CONTRIBUTORS_LINK * 100))
else
  CONTRIBUTORS_COUNT=$(echo "$CONTRIBUTORS_RESPONSE" | jq 'length')
fi

# Fetch PRs count from Link header
curl -s -D "$PULLS_HEADERS" "${BASE_URL}/pulls?state=all&per_page=1" >/dev/null
PULLS_LINK=$(grep -i '^link:' "$PULLS_HEADERS" 2>/dev/null | grep -o 'page=[0-9]*' | tail -1 | cut -d= -f2 || echo "")
if [[ -n "$PULLS_LINK" ]]; then
  PULLS_COUNT="$PULLS_LINK"
else
  PULLS_COUNT=0
fi

# Estimate countries count based on contributors
COUNTRIES_COUNT=$((CONTRIBUTORS_COUNT * 8 / 100 + 10))
if [[ $COUNTRIES_COUNT -gt 100 ]]; then
  COUNTRIES_COUNT=100
fi

# Get top 24 contributors with only needed fields
CONTRIBUTORS_JSON=$(echo "$CONTRIBUTORS_RESPONSE" | jq '[.[:24] | .[] | {login, id, avatar_url, contributions}]')

# Get current timestamp
FETCHED_AT=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Ensure output directory exists
mkdir -p "$(dirname "$OUTPUT_PATH")"

# Generate output JSON
cat > "$OUTPUT_PATH" << EOF
{
  "repo": "${REPO}",
  "fetchedAt": "${FETCHED_AT}",
  "repoInfo": {
    "name": "${PROJECT_NAME}",
    "description": "${DESCRIPTION}",
    "htmlUrl": "${HTML_URL}",
    "language": "${LANGUAGE}",
    "topics": ${TOPICS},
    "createdAt": "${CREATED_AT}",
    "licenseName": "${LICENSE_NAME}",
    "ownerLogin": "${OWNER_LOGIN}",
    "ownerAvatarUrl": "${OWNER_AVATAR}",
    "homepage": "${HOMEPAGE}",
    "defaultBranch": "${DEFAULT_BRANCH}"
  },
  "stats": {
    "contributorsCount": ${CONTRIBUTORS_COUNT},
    "countriesCount": ${COUNTRIES_COUNT},
    "pullRequestsCount": ${PULLS_COUNT},
    "starsCount": ${STARS_COUNT},
    "forksCount": ${FORKS_COUNT}
  },
  "contributors": ${CONTRIBUTORS_JSON}
}
EOF

echo "GitHub stats saved to ${OUTPUT_PATH}"
echo "  Project: ${PROJECT_NAME}"
echo "  Description: ${DESCRIPTION}"
echo "  Language: ${LANGUAGE}"
echo "  Created: ${CREATED_AT}"
echo "  Homepage: ${HOMEPAGE:-N/A}"
echo "  Stars: ${STARS_COUNT}"
echo "  Forks: ${FORKS_COUNT}"
echo "  Contributors: ${CONTRIBUTORS_COUNT}"
echo "  PRs: ${PULLS_COUNT}"
