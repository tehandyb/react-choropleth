import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

export default {
  entry: 'src/choropleth.js',
  dest: 'build/choropleth-dist.js',
  format: 'umd',
  moduleName: 'ReactChoropleth',
  plugins: [
    babel({
      exclude: 'node-modules/**'
    }),
    nodeResolve({
      jsnext: true
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
  sourceMap: true,
  // Don't bloat our bundle with React, the parent will provide it
  external: ['react']
}