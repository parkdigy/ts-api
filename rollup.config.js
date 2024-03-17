import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import eslint from '@rollup/plugin-eslint';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import del from 'rollup-plugin-delete';

const packageJson = require('./package.json');

const externalDeps = Object.keys(packageJson.dependencies || {}).concat(
  Object.keys(packageJson.peerDependencies || {})
);

const getOutput = (path, format) => ({
  file: path,
  format: format,
  sourcemap: false,
  compact: true,
  exports: 'named',
});

const getConfig = () => ({
  input: 'src/index.ts',
  output: [getOutput(packageJson.main, 'cjs'), getOutput(packageJson.module, 'esm')],
  external: externalDeps,
  context: 'window',
  plugins: [
    eslint({
      throwOnError: true,
      throwOnWarning: true,
      include: ['./src/**/*.{ts,tsx}'],
    }),
    del({ targets: 'dist/*' }),
    peerDepsExternal(),
    postcss(),
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
});

export default [getConfig()];
