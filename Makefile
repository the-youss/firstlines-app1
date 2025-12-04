  # Makefile for Project

.PHONY: all build

# ⚙️ Build
build:
	pnpm install && pnpm build:worker && pnpm build
