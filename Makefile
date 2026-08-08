.DEFAULT_GOAL := help
.PHONY: help install skills-install build typecheck test check generate clean distclean

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

check: build test ## Full gate: build, test, CSS rules, and generated files
	bun run tools/check_css.ts
	bun run tools/generate.ts --check
	@echo "✓ check passed"

check-css: ## Verify tokens exist and no literal colours are used
	bun run tools/check_css.ts

clean: ## Remove build output
	rm -rf dist

distclean: clean ## Remove build output and dependencies
	rm -rf node_modules
