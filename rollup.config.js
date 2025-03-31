import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'chakra',
      format: 'umd',
      file: 'dist/chakra-umd.min.js',
      sourcemap: true,
    },
    {
      name: 'chakra',
      format: 'es',
      file: 'dist/chakra-es.js',
    },
    {
      name: 'chakra',
      format: 'cjs',
      file: 'dist/chakra-cjs.js',
    },
  ],
  external: {},
  plugins: [
    typescript({
      declaration: false,
    }),
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
