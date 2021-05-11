import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import url from '@rollup/plugin-url'
import { terser } from "rollup-plugin-terser";
import bundleSize from 'rollup-plugin-bundle-size';

import pkg from './package.json'

export default [{
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: false
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: false,
    }
  ],
  plugins: [
    external(),
    url({ exclude: ['**/*.svg'] }),
    resolve(),
    typescript(),
    commonjs({ extensions: ['.js', '.ts'] }),
    terser({
      output: {
        comments: () => false,
      },
    }),
    bundleSize(),
  ]
}, {
  input: 'src/store.ts',
  output: [
    {
      file: 'store.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: false
    },
    {
      file: 'store.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: false
    }
  ],
  plugins: [
    external(),
    url({ exclude: ['**/*.svg'] }),
    resolve(),
    typescript(),
    commonjs({ extensions: ['.js', '.ts'] }),
    terser({
      output: {
        comments: () => false,
      },
    }),
    bundleSize(),
  ]
}]
