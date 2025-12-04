  # Makefile for Project

.PHONY: all build release

# ⚙️ Build
build:
	pnpm install && pnpm build:worker && pnpm build

release:
	pm2 start ecosystem.config.js

all: build release
