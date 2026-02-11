#!/usr/bin/env bash
#
# ensure-running.sh — Start or verify the headless browser Docker container.
#
# Usage: ./ensure-running.sh [--status]
#   --status  Just check status, don't start anything
#
# Container: ghcr.io/browserless/chromium (ARM64-native)
# Port: 3333 → 3000 (container)
# Token: openclaw (change via BROWSERLESS_TOKEN env var)

set -euo pipefail

CONTAINER_NAME="${BROWSERLESS_CONTAINER:-openclaw-browser}"
HOST_PORT="${BROWSERLESS_PORT:-3333}"
CONTAINER_PORT="3000"
TOKEN="${BROWSERLESS_TOKEN:-openclaw}"
IMAGE="ghcr.io/browserless/chromium:latest"
MAX_CONCURRENT="${BROWSERLESS_CONCURRENT:-10}"

# Colors (if terminal supports them)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

status_only=false
if [[ "${1:-}" == "--status" ]]; then
  status_only=true
fi

# Check Docker is available
if ! command -v docker &>/dev/null; then
  echo -e "${RED}Error: Docker is not installed or not in PATH${NC}" >&2
  echo "Install Docker Desktop: https://www.docker.com/products/docker-desktop/" >&2
  exit 1
fi

# Check Docker daemon is running
if ! docker info &>/dev/null; then
  echo -e "${RED}Error: Docker daemon is not running${NC}" >&2
  echo "Start Docker Desktop and try again." >&2
  exit 1
fi

# Check if container exists
container_exists=$(docker ps -a --filter "name=^${CONTAINER_NAME}$" --format '{{.Names}}' 2>/dev/null)
container_running=$(docker ps --filter "name=^${CONTAINER_NAME}$" --format '{{.Names}}' 2>/dev/null)

if [[ -n "$container_running" ]]; then
  # Container is running — verify health
  if curl -sf "http://localhost:${HOST_PORT}/pressure?token=${TOKEN}" &>/dev/null; then
    echo -e "${GREEN}✓ Headless browser is running and healthy${NC}"
    echo "  URL: http://localhost:${HOST_PORT}"
    echo "  Token: ${TOKEN}"
    echo "  Docs: http://localhost:${HOST_PORT}/docs"
    exit 0
  else
    echo -e "${YELLOW}⚠ Container is running but not responding — restarting${NC}"
    docker restart "$CONTAINER_NAME" &>/dev/null
    sleep 5
  fi
elif [[ -n "$container_exists" ]]; then
  if $status_only; then
    echo -e "${YELLOW}⚠ Container exists but is stopped${NC}"
    exit 1
  fi
  echo -e "${YELLOW}Container exists but stopped — starting...${NC}"
  docker start "$CONTAINER_NAME" &>/dev/null
  sleep 5
else
  if $status_only; then
    echo -e "${RED}✗ No headless browser container found${NC}"
    exit 1
  fi

  echo "Pulling and starting headless browser..."

  # Detect architecture
  arch=$(uname -m)
  platform_flag=""
  if [[ "$arch" == "arm64" || "$arch" == "aarch64" ]]; then
    platform_flag="--platform linux/arm64"
  fi

  # shellcheck disable=SC2086
  docker run -d \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    $platform_flag \
    -p "${HOST_PORT}:${CONTAINER_PORT}" \
    -e "CONCURRENT=${MAX_CONCURRENT}" \
    -e "TOKEN=${TOKEN}" \
    "$IMAGE" 2>&1

  echo "Waiting for container to start..."
  sleep 8
fi

# Verify health (with retries)
for i in 1 2 3 4 5; do
  if curl -sf "http://localhost:${HOST_PORT}/pressure?token=${TOKEN}" &>/dev/null; then
    echo -e "${GREEN}✓ Headless browser is running and healthy${NC}"
    echo "  URL: http://localhost:${HOST_PORT}"
    echo "  Token: ${TOKEN}"
    echo "  Docs: http://localhost:${HOST_PORT}/docs"
    exit 0
  fi
  sleep 2
done

echo -e "${RED}Error: Container started but health check failed${NC}" >&2
echo "Check logs: docker logs ${CONTAINER_NAME}" >&2
exit 1
