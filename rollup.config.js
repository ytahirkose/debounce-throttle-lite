import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named'
    },
    plugins: [typescript()]
  },
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    plugins: [typescript()]
  },
  // Minified build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.min.js',
      format: 'umd',
      name: 'DebounceThrottle',
      exports: 'named'
    },
    plugins: [typescript(), terser()]
  }
];
