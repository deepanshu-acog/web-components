.DEFAULT_GOAL := help
.PHONY: help install build test run preview clean distclean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	bun install

build: ## Build the static site + Pagefind search index
	bun run build

test: ## Type-check .astro/.ts files
	bun run check

run: ## Run the dev server (HMR; search needs `make build` + `make preview` instead)
	bun run dev

preview: ## Serve the production build from dist/ (needed for search to work)
	bun run preview

clean: ## Remove build output
	rm -rf dist .astro

distclean: clean ## Remove build output and dependencies
	rm -rf node_modules
