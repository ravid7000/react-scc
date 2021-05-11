import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-peer-deps-external'
import url from '@rollup/plugin-url'
import { terser } from "rollup-plugin-terser";
import bundleSize from 'rollup-plugin-filesize';


const config = [{
  input: {
    index: 'src/index.ts',
    store: 'src/store.ts',
  },
  output: [
    {
      dir: './dist',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
      chunkFileNames: '[name]-[hash]-[format].js'
    },
    {
      dir: './dist',
      format: 'es',
      exports: 'named',
      sourcemap: false,
      entryFileNames: '[name].[format].js',
      chunkFileNames: '[name]-[hash]-[format].js'
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
  input: {
    index: 'src/hooks/index.ts',
    core: 'src/hooks/core.ts',
    store: 'src/hooks/store.ts',
  },
  output: [
    {
      dir: './dist/hooks',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
      chunkFileNames: '[name]-[hash]-[format].js'
    },
    {
      dir: './dist/hooks',
      format: 'es',
      exports: 'named',
      sourcemap: false,
      entryFileNames: '[name].[format].js',
      chunkFileNames: '[name]-[hash]-[format].js'
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

export default config
