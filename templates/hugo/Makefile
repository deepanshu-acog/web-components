.DEFAULT_GOAL := help
.PHONY: help install build run clean distclean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	bun install

build: ## Build the static site
	hugo --gc --minify

run: ## Run the Hugo dev server
	hugo server -D

clean: ## Remove build output
	rm -rf public resources

distclean: clean ## Remove dependencies
	rm -rf node_modules
