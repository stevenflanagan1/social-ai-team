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

install_xquik_validator() {
  local xquik_dir="$SKILLS_DIR/xquik"
  local validator_stage
  local validator_backup

  validator_stage="$(mktemp -d "$xquik_dir/.validator-install.XXXXXX")" || return 1
  validator_backup="$validator_stage/previous-node_modules"

  if ! cp "$xquik_dir/package.json" "$xquik_dir/package-lock.json" "$validator_stage/"; then
    rm -rf "$validator_stage"
    return 1
  fi

  if ! (cd "$validator_stage" && npm ci --omit=dev --ignore-scripts --no-audit --no-fund); then
    rm -rf "$validator_stage"
    return 1
  fi

  if [[ -e "$xquik_dir/node_modules" || -L "$xquik_dir/node_modules" ]]; then
    if ! mv "$xquik_dir/node_modules" "$validator_backup"; then
      rm -rf "$validator_stage"
      return 1
    fi
  fi

  if mv "$validator_stage/node_modules" "$xquik_dir/node_modules"; then
    rm -rf "$validator_stage"
    return 0
  fi

  if [[ -e "$validator_backup" ]] && ! mv "$validator_backup" "$xquik_dir/node_modules"; then
    echo "    Previous validator kept at $validator_backup."
    return 1
  fi
  rm -rf "$validator_stage"
  return 1
}

if command -v npm >/dev/null 2>&1; then
  if install_xquik_validator; then
    echo "  ✓ Xquik weighted-length validator"
  else
    echo "  ⚠ Xquik validator update failed. Any previous validator remains installed."
    echo "    Fix npm, then rerun this installer before using /xquik."
  fi
else
  echo "  ⚠ Xquik validator skipped. Other skills remain installed."
  echo "    Install Node.js and npm, then rerun this installer before using /xquik."
fi

echo ""
echo "Done. All 11 skills installed to $SKILLS_DIR"
echo "Open Claude Code and run /social-media-manager to get started."
