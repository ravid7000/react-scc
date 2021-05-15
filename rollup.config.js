import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import url from "@rollup/plugin-url";
import { uglify } from "rollup-plugin-uglify";
import bundleSize from "rollup-plugin-filesize";
import fs from "fs";
import path from "path";

const ignoreFiles = (file) => {
  const ignore = ['types.ts', 'utils.ts']
  if (ignore.includes(file)) {
    return false
  }
  return file.endsWith(".ts") || file.endsWith(".tsx")
}

const getSource = (dir) => {
  return fs
    .readdirSync(path.resolve(__dirname, dir))
    .filter(ignoreFiles)
    .map(file => path.join(dir, file))
};

const plugins = [
  external(),
  resolve(),
  typescript(),
  url({ exclude: ["**/*.svg"] }),
  commonjs({ extensions: [".js", ".ts"] }),
  uglify({
    keep_fnames: true,
    compress: false,
  }),
  bundleSize({
    showBeforeSizes: "build",
  }),
];

const cjs = (options) => ({
  format: "cjs",
  exports: "named",
  sourcemap: false,
  chunkFileNames: "[name]-[hash]-[format].js",
  ...options,
});

const es = (options) => ({
  format: "es",
  exports: "named",
  sourcemap: false,
  entryFileNames: "[name].[format].js",
  chunkFileNames: "[name]-[hash]-[format].js",
  ...options,
});

const config = [
  {
    input: getSource('./src'),
    output: [cjs({ dir: "./dist" }), es({ dir: "./dist" })],
    plugins,
  },
  {
    input: getSource('./src/hooks'),
    output: [cjs({ dir: "./dist/hooks" }), es({ dir: "./dist/hooks" })],
    plugins,
  },
];

export default config;
