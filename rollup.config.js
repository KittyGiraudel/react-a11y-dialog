import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const externals = ['react', 'react-dom', 'prop-types']

const plugins = [
  nodeResolve({
    skip: externals,
  }),
  commonjs(),
  typescript({ tsconfig: './tsconfig.json' }),
]

export default [
  {
    input: 'src/index.tsx',
    plugins: plugins,
    external: externals,
    output: [
      {
        file: 'dist/index.js',
        format: 'esm',
        exports: 'named',
      },
    ],
  },
]
