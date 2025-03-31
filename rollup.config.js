import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'axhr',
      format: 'umd',
      file: 'dist/axhr.min.js',
      sourcemap: true,
    },
    {
      name: 'axhr',
      format: 'es',
      file: 'dist/axhr-es.js',
    },
    {
      name: 'axhr',
      format: 'cjs',
      file: 'dist/axhr-cjs.js',
    },
  ],
  external: ['axios'],
  plugins: [
    typescript({
      declaration: false,
    }),
    json(),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: false,
    }),
    terser(),
    filesize(),
  ],
};
