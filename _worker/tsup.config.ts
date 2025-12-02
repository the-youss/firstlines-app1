import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["_worker/index.ts"],
  splitting: false,
  sourcemap: false,
  clean: true,
  outDir: "_worker/dist",
  format: ['cjs'],
  external: ["pg",'node-fetch','lodash'],
  skipNodeModulesBundle: true,
  minify:true,
  treeshake:true
});