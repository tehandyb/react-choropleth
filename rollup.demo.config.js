import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

// Bundle using an entry point as if it was a real app using the choropleth
export default {
    entry: 'demo/entry.js',
    dest: 'demo/demo.js',
    format: 'umd',
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        nodeResolve({
            jsnext: true
        }),
        commonjs({
            include: 'node_modules/**',
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
    ],
    sourceMap: true
}