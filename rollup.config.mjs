import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { createRequire } from 'node:module'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const min = filename => filename.replace(/.(c?js)/, '.min.$1')
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const plugins = [
  peerDepsExternal(),
  nodeResolve(),
  commonjs(),
  typescript({ tsconfig: './tsconfig.json' }),
]

const minify = terser({
  format: {
    preamble: `/*! react-a11y-dialog ${pkg.version} — © Kitty Giraudel */`,
  },
})

const cjsCfg = {
  format: 'cjs',
  name: 'A11yDialog',
  exports: 'named',
}
const esmCfg = {
  format: 'esm',
  exports: 'named',
}

export default [
  {
    input: 'src/react-a11y-dialog.tsx',
    plugins: plugins,
    output: [
      { ...cjsCfg, file: pkg.main },
      { ...cjsCfg, file: min(pkg.main), plugins: [minify] },
    ],
  },
  {
    input: 'src/react-a11y-dialog.tsx',
    plugins: plugins,
    output: [
      { ...esmCfg, file: pkg.module },
      { ...esmCfg, file: min(pkg.module), plugins: [minify] },
    ],
  },
]
