#!/bin/bash
# Install Social AI Team skills into Claude Code

SKILLS_DIR="$HOME/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Installing Social AI Team skills..."

SKILLS=(
  "social-media-manager"
  "brand-onboarding"
  "content-calendar"
  "caption-writer"
  "social-creative-designer"
  "social-performance-review"
)

for skill in "${SKILLS[@]}"; do
  src="$SCRIPT_DIR/skills/$skill"
  dst="$SKILLS_DIR/$skill"
  mkdir -p "$dst"
  cp -r "$src/." "$dst/"
  echo "  ✓ $skill"
done

echo ""
echo "Done. All 6 skills installed to $SKILLS_DIR"
echo "Open Claude Code and run /social-media-manager to get started."
