import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import fs from 'fs';

const pack = JSON.parse(fs.readFileSync('./dist/package.json'));

const moduleName = 'bitbox-transpiler'
const moduleGlobal = 'bitbox.transform'
const copyright =
    '/*!\n' +
    ' * ' + moduleName + ' v' + pack.version + '\n' +
    ' * (c) ' + new Date().getFullYear() + ' ' + pack.author + '\n' +
    ' * Released under the ' + pack.license + ' License.\n' +
    ' */';

export default {
    entry: 'src/main.js',
    //format: 'umd',
    plugins: [
        json(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
    moduleName: moduleGlobal,
    globals: {
        moduleGlobal: moduleGlobal
    },
    banner: copyright,
    sourceMap: false,
    targets: [
  { dest: 'dist/bundle.cjs.js', format: 'cjs' },
  { dest: 'dist/bundle.umd.js', format: 'umd' },
  { dest: 'dist/bundle.es.js', format: 'es' },
  { dest: 'dist/bundle.global.js', format: 'iife' },
]
}
