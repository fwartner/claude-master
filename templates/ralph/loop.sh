#!/usr/bin/env bash
# Ralph Loop — Autonomous iterative development
# Usage:
#   ./loop.sh              # Build mode (unlimited iterations)
#   ./loop.sh plan         # Planning mode
#   ./loop.sh build 20     # Build max 20 iterations
#   ./loop.sh plan 5       # Plan max 5 iterations
#   ./loop.sh specs        # Specification mode
#   ./loop.sh reverse      # Reverse engineering mode

set -euo pipefail

MODE="${1:-build}"
MAX_ITERATIONS="${2:-0}"  # 0 = unlimited

COUNTER=0
PROMPT_FILE=""

case "$MODE" in
  plan)    PROMPT_FILE=".ralph/PROMPT_plan.md" ;;
  build)   PROMPT_FILE=".ralph/PROMPT_build.md" ;;
  specs)   PROMPT_FILE=".ralph/PROMPT_specs.md" ;;
  reverse) PROMPT_FILE=".ralph/PROMPT_reverse_engineer.md" ;;
  *)
    echo "Usage: $0 [plan|build|specs|reverse] [max_iterations]"
    exit 1
    ;;
esac

if [ ! -f "$PROMPT_FILE" ]; then
  echo "Error: $PROMPT_FILE not found. Run ralph-enable first."
  exit 1
fi

echo "Ralph Loop — Mode: $MODE"
echo "Prompt: $PROMPT_FILE"
[ "$MAX_ITERATIONS" -gt 0 ] && echo "Max iterations: $MAX_ITERATIONS"
echo "---"

while :; do
  COUNTER=$((COUNTER + 1))
  echo ""
  echo "=== Iteration $COUNTER ==="
  echo ""

  # Pipe prompt to Claude
  cat "$PROMPT_FILE" | claude -p --dangerously-skip-permissions --output-format stream-json --verbose 2>&1 || true

  # Push changes after each iteration
  git add -A 2>/dev/null || true
  git diff --cached --quiet 2>/dev/null || git commit -m "ralph: iteration $COUNTER ($MODE mode)" 2>/dev/null || true

  # Check iteration limit
  if [ "$MAX_ITERATIONS" -gt 0 ] && [ "$COUNTER" -ge "$MAX_ITERATIONS" ]; then
    echo ""
    echo "=== Reached max iterations ($MAX_ITERATIONS) ==="
    break
  fi
done

echo ""
echo "Ralph Loop completed after $COUNTER iterations."
