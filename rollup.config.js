import { createRequire } from 'node:module'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const min = filename => filename.replace('.js', '.min.js')
const require = createRequire(import.meta.url)
const pkg = require('./package.json')
const externals = [...Object.keys(pkg.peerDependencies)]

const plugins = [
  nodeResolve(),
  commonjs(),
  typescript({ tsconfig: './tsconfig.json' }),
]

const minify = terser({
  format: {
    preamble: `/*! react-a11y-dialog ${pkg.version} — © Kitty Giraudel */`,
  },
})

const umdCfg = {
  format: 'umd',
  name: 'A11yDialog',
  exports: 'named',
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
}
const esmCfg = {
  format: 'esm',
  exports: 'named',
}

export default [
  {
    input: 'src/react-a11y-dialog.tsx',
    plugins: plugins,
    external: externals,
    output: [
      { ...umdCfg, file: pkg.main },
      { ...umdCfg, file: min(pkg.main), plugins: [minify] },
    ],
  },
  {
    input: 'src/react-a11y-dialog.tsx',
    plugins: plugins,
    external: externals,
    output: [
      { ...esmCfg, file: pkg.module },
      { ...esmCfg, file: min(pkg.module), plugins: [minify] },
    ],
  },
]
