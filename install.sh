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
  "linkedin-writer"
  "threads-writer"
  "x-writer"
  "xquik"
  "publisher"
)

for skill in "${SKILLS[@]}"; do
  src="$SCRIPT_DIR/skills/$skill"
  dst="$SKILLS_DIR/$skill"
  mkdir -p "$dst"
  cp -r "$src/." "$dst/"
  echo "  ✓ $skill"
done

if command -v npm >/dev/null 2>&1; then
  if (cd "$SKILLS_DIR/xquik" && npm ci --omit=dev --ignore-scripts --no-audit --no-fund); then
    echo "  ✓ Xquik weighted-length validator"
  else
    echo "  ⚠ Xquik validator setup failed. Other skills remain installed."
    echo "    Fix npm, then rerun this installer before using /xquik."
  fi
else
  echo "  ⚠ Xquik validator skipped. Other skills remain installed."
  echo "    Install Node.js and npm, then rerun this installer before using /xquik."
fi

echo ""
echo "Done. All 11 skills installed to $SKILLS_DIR"
echo "Open Claude Code and run /social-media-manager to get started."
