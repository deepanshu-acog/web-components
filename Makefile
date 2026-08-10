.DEFAULT_GOAL := help
.PHONY: help install skills-install build typecheck test check generate run \
	check-generated bundle-preview build-cli release publish clean distclean

# Platforms atk-ui start/preview ships for (macOS + Linux — see CLAUDE.md
# defaults). One name per `bun build --compile --target`.
CLI_TARGETS := bun-darwin-arm64 bun-darwin-x64 bun-linux-x64 bun-linux-arm64

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	bun install

skills-install: ## Restore project skills from skills-pack.lock.json
	skills-pack update && skills-pack upgrade

typecheck: ## Type-check without emitting
	bun run tsc --noEmit

build: ## Compile to dist/ and copy CSS
	bun run tsc
	@mkdir -p dist/theme dist/patterns
	@cp src/theme/*.css dist/theme/ 2>/dev/null || true
	@cat src/patterns/*/*.css > dist/patterns/patterns.css 2>/dev/null || true

test: ## Run tests
	bun test

generate: ## Regenerate custom-elements.json and the agent skill
	bun run tools/generate.ts

run: ## Run the atk-ui CLI (pass ARGS="preview" etc.)
	bun run src/cli/index.ts $(ARGS)

check: build test ## Full gate: build, standalone CLI, test, CSS rules, and generated files
	bun run tools/check_css.ts
	bun run tools/generate.ts --check
	bun run tools/check_content_layout.ts
	$(MAKE) build-cli
	@echo "✓ check passed"

check-generated: ## Verify generated catalog files are current
	bun run tools/generate.ts --check

bundle-preview: check-generated build ## Bundle every catalogued component into one file, for atk-ui preview to embed
	bun run tools/bundle_preview.ts

build-cli: bundle-preview ## Cross-compile the atk-ui CLI for every supported platform (no CI — runs locally)
	@mkdir -p dist/bin
	@for target in $(CLI_TARGETS); do \
		echo "  compiling $$target"; \
		bun build --compile --target=$$target --outfile=dist/bin/atk-ui-$${target#bun-} src/cli/index.ts || exit 1; \
	done
	@echo "✓ built $(words $(CLI_TARGETS)) binaries in dist/bin/"

release: ## Build, tag, and publish CLI binaries as a GitHub release (VERSION must match package.json)
	@[ -n "$(VERSION)" ] || { echo "Usage: make release VERSION=x.y.z"; exit 2; }
	@package_version="$$(bun -e 'import { version } from "./package.json"; console.log(version)')"; \
		[ "$(VERSION)" = "$$package_version" ] || { \
			echo "Error: VERSION=$(VERSION) does not match package.json ($$package_version)."; exit 2; \
		}
	@[ -z "$$(git status --porcelain)" ] || { \
		echo "Error: release requires a clean worktree so the tag matches the binaries."; git status --short; exit 2; \
	}
	@if git rev-parse -q --verify "refs/tags/v$(VERSION)" >/dev/null; then \
		echo "Error: tag v$(VERSION) already exists."; exit 2; \
	fi
	$(MAKE) build-cli
	@[ -z "$$(git status --porcelain)" ] || { \
		echo "Error: build changed tracked files; commit them before releasing."; git status --short; exit 2; \
	}
	git tag "v$(VERSION)"
	git push origin "v$(VERSION)"
	gh release create "v$(VERSION)" dist/bin/* --title "v$(VERSION)" --generate-notes

publish: check ## Publish the library to the Aganitha npm registry
	npm publish

check-css: ## Verify tokens exist and no literal colours are used
	bun run tools/check_css.ts

clean: ## Remove build output
	rm -rf dist

distclean: clean ## Remove build output and dependencies
	rm -rf node_modules
