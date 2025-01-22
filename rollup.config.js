import rpi_jsy from 'rollup-plugin-jsy'
import rpi_terser from '@rollup/plugin-terser'

import pkg from './package.json' with {type: 'json'}

const external = id => /^\w+:|^#/.test(id) || id.startsWith(pkg.name)
const plugins = [rpi_jsy()]
const plugins_min = [ ... plugins, rpi_terser({}) ]

export default [
  ... add_jsy('index'),
  ... add_jsy('base2'),
  ... add_jsy('hex'),
  ... add_jsy('base64'),
  ... add_jsy('base64_str_codec'),
  ... add_jsy('base64_u8_codec'),
  ... add_jsy('utf8'),
  ... add_jsy('json'),
  ... add_jsy('random'),
  ... add_jsy('buffer'),

  { input: 'test/unittest.jsy', external, plugins, output: { dir: 'esm/test/', sourcemap: true }},
]


function * add_jsy(src_name) {
  yield {
    input: `code/${src_name}.jsy`,
    plugins, external,
    output: { file: `esm/${src_name}.js`, format: 'es', sourcemap: true }}

  yield {
    input: `code/${src_name}.jsy`,
    plugins: plugins_min, external,
    output: { file: `esm/${src_name}.min.js`, format: 'esm', sourcemap: false }}
}
