import typescript from 'rollup-plugin-typescript2';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import copy from 'rollup-plugin-copy';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  external: ['lodash'],
  preserveEntrySignatures: false,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    terser(),
    nodeResolve({browser: true}),
    copy({targets: [{src: 'src/globals.d.ts', dest: 'dist'}]}),
    external(),
    typescript({
      rollupCommonJSResolveHack: true,
      exclude: '**/__tests__/**',
      clean: true,
    }),
    commonjs({
      include: ['node_modules/**'],
    }),
  ],
};
