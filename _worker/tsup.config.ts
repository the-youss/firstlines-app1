import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["_worker/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: "_worker/dist",
  format: ['cjs'],
  external: ["@prisma/client",'lodash'],
  skipNodeModulesBundle: true,
  target:"esnext",
  minify:true,
  treeshake:true
});