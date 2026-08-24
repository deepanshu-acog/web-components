#!/usr/bin/env bash
# ==============================================================================
# atk-ui CLI Installer
# Builds, compiles, and installs `atk-ui` CLI binary globally.
# ==============================================================================

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

echo "📦 Building @aganitha/atk-ui and CLI binary..."

# 1. Ensure dependencies are present
if [ ! -d "node_modules" ]; then
  echo "  ↳ Installing dependencies with bun..."
  bun install
fi

# 2. Run catalog generator & bundle previews
bun run tools/generate.ts 2>/dev/null || true
bun run build
bun run tools/bundle_preview.ts

# 3. Ensure template dependencies are installed for Hugo Pipes
if [ -d "templates/hugo" ]; then
  echo "  ↳ Preparing Hugo template assets..."
  (cd templates/hugo && bun install 2>/dev/null || true)
fi

# 3. Compile standalone native binary
mkdir -p dist/bin
echo "  ↳ Compiling standalone executable with bun..."
bun build --compile --outfile="dist/bin/atk-ui" src/cli/index.ts

chmod +x dist/bin/atk-ui

# 4. Determine installation target directory
INSTALL_DIR=""
if [ -d "$HOME/.local/bin" ] || mkdir -p "$HOME/.local/bin" 2>/dev/null; then
  INSTALL_DIR="$HOME/.local/bin"
elif [ -d "$HOME/.aganitha/bin" ] || mkdir -p "$HOME/.aganitha/bin" 2>/dev/null; then
  INSTALL_DIR="$HOME/.aganitha/bin"
else
  INSTALL_DIR="/usr/local/bin"
fi

echo "🚀 Installing CLI binary to ${INSTALL_DIR}..."

# Copy atk-ui binary
cp "dist/bin/atk-ui" "${INSTALL_DIR}/atk-ui"
chmod +x "${INSTALL_DIR}/atk-ui"

# Copy starter templates to user share directory for global preview support
mkdir -p "$HOME/.local/share/atk-ui/templates"
cp -R templates/* "$HOME/.local/share/atk-ui/templates/" 2>/dev/null || true

# Remove old atk alias if present
rm -f "${INSTALL_DIR}/atk"

# 5. Check PATH and advise shell config
PATH_CONFIGURED=true
if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
  PATH_CONFIGURED=false
  echo ""
  echo "⚠️  Note: ${INSTALL_DIR} is not in your current PATH."
  echo "   Add it to your shell configuration (~/.zshrc or ~/.bashrc):"
  echo "   export PATH=\"${INSTALL_DIR}:\$PATH\""
  echo ""
fi

# 6. Global npm/bun package link
bun link 2>/dev/null || true

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
