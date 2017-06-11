import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import postcss from 'rollup-plugin-postcss'

// PostCSS plugins
import simplevars from 'postcss-simple-vars'
import nested from 'postcss-nested'
import cssnext from 'postcss-cssnext'

export default {
  entry: 'src/choropleth.js',
  dest: 'build/choropleth-dist.js',
  format: 'umd',
  moduleName: 'ReactChoropleth',
  plugins: [
    postcss({
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false })
      ],
      extensions: ['.css']
    }),
    babel({
      exclude: 'node-modules/**'
    }),
    nodeResolve({
      jsnext: true
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/immutable/dist/immutable.js': ['fromJS']
      }
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
  sourceMap: true,
  // Don't bloat our bundle with React, the parent will provide it
  external: ['react']
}
