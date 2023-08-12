import { createRequire } from 'node:module'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')
const externals = ['react', 'react-dom', 'prop-types']

const plugins = [
  nodeResolve({ skip: externals }),
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
    'prop-types': 'PropTypes',
  },
}

export default [
  {
    input: 'src/react-a11y-dialog.tsx',
    plugins: plugins,
    external: externals,
    output: [
      { ...umdCfg, file: 'dist/react-a11y-dialog.js' },
      {
        ...umdCfg,
        file: 'dist/react-a11y-dialog.min.js',
        plugins: [minify],
      },
    ],
  },
  {
    input: 'src/react-a11y-dialog.tsx',
    plugins: plugins,
    external: externals,
    output: [
      {
        file: 'dist/react-a11y-dialog.esm.js',
        format: 'esm',
        exports: 'named',
      },
      {
        file: 'dist/react-a11y-dialog.esm.min.js',
        format: 'esm',
        exports: 'named',
        plugins: [minify],
      },
    ],
  },
]
