#!/usr/bin/env bash
# ==============================================================================
# atk-ui CLI Installer — dev/test convenience only.
#
# Builds and installs the same standalone `atk-ui` binary production gets
# via `atk install --pack atk-utils` (GitHub release, no install.sh
# involved there). This script exists only so a teammate testing from a
# source checkout gets the real artifact, not a facsimile — it does exactly
# what `make build-cli` does, then copies the one binary out. It must not
# grow beyond that: the binary embeds everything it needs (component
# catalog, Hugo starter template) at compile time, so nothing here should
# ever need to vendor node_modules, templates, or dist/ into a share
# directory for the binary to work at runtime. If `atk-ui preview` needs
# something from disk, that's a bug in the embedding, not a reason to add
# a step here.
# ==============================================================================

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

echo "📦 Building @aganitha/atk-ui and CLI binary..."

if [ ! -d "node_modules" ]; then
  echo "  ↳ Installing dependencies with bun..."
  bun install
fi

bun run tools/generate.ts
bun run tools/bundle_hugo_app.ts
bun run tools/copy_hugo_static_assets.ts
bun run build
bun run tools/bundle_preview.ts
bun run tools/bundle_hugo_template.ts

mkdir -p dist/bin
echo "  ↳ Compiling standalone executable with bun..."
bun build --compile --outfile="dist/bin/atk-ui" src/cli/index.ts
chmod +x dist/bin/atk-ui

INSTALL_DIR=""
if [ -d "$HOME/.local/bin" ] || mkdir -p "$HOME/.local/bin" 2>/dev/null; then
  INSTALL_DIR="$HOME/.local/bin"
elif [ -d "$HOME/.aganitha/bin" ] || mkdir -p "$HOME/.aganitha/bin" 2>/dev/null; then
  INSTALL_DIR="$HOME/.aganitha/bin"
else
  INSTALL_DIR="/usr/local/bin"
fi

echo "🚀 Installing to ${INSTALL_DIR}..."
cp "dist/bin/atk-ui" "${INSTALL_DIR}/atk-ui"
chmod +x "${INSTALL_DIR}/atk-ui"

# bun link makes `atk-ui` resolve to this fresh build ahead of any stale
# global install (e.g. an npm-installed @aganitha/atk-ui).
bun link 2>/dev/null || true

PATH_CONFIGURED=true
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  PATH_CONFIGURED=false
  echo ""
  echo "⚠️  Note: ${INSTALL_DIR} is not in your current PATH."
  echo "   Add it to your shell configuration (~/.zshrc or ~/.bashrc):"
  echo "   export PATH=\"${INSTALL_DIR}:\$PATH\""
  echo ""
fi

echo "✅ Installation complete!"
echo ""
echo "Try running:"
if [ "$PATH_CONFIGURED" = true ]; then
  echo "  atk-ui --version"
  echo "  atk-ui --help"
  echo "  atk-ui preview"
  echo "  atk-ui start my-new-project"
else
  echo "  ${INSTALL_DIR}/atk-ui --version"
  echo "  ${INSTALL_DIR}/atk-ui --help"
fi
