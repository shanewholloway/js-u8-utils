import rpi_jsy from 'rollup-plugin-jsy'
import { terser as rpi_terser } from 'rollup-plugin-terser'

import pkg from './package.json'
const pkg_name = pkg.name.replace('-', '_')

const configs = []
export default configs

const sourcemap = true
const external = id => /^\w+:/.test(id)

const plugins = []
const plugins_generic = [
  rpi_jsy({defines: {}}),
  ... plugins ]
const plugins_nodejs = [
  rpi_jsy({defines: {PLAT_NODEJS: true}}),
  ... plugins ]
const plugins_web = [
  rpi_jsy({defines: {PLAT_WEB: true}}),
  ... plugins ]
const plugins_min = [
  ... plugins_web,
  rpi_terser({}) ]


add_jsy('index', {module_name: pkg_name})
add_jsy('base2')
add_jsy('hex')
add_jsy('base64')
add_jsy('utf8')
add_jsy('json')
add_jsy('random', {skip_generic: true})
add_jsy('buffer')


function add_jsy(src_name, opt={}) {
  let module_name = opt.module_name || `${pkg_name}_${src_name}`

  if (plugins_generic && !opt.skip_generic)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_generic, external,
      output: { file: `esm/${src_name}.mjs`, format: 'es', sourcemap }})

  if (plugins_nodejs)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_nodejs, external,
      output: [
        { file: `cjs/${src_name}.cjs`, format: 'cjs', exports:'named', sourcemap },
        { file: `esm/node/${src_name}.mjs`, format: 'es', sourcemap } ]})

  if (plugins_web)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_web, external,
      output: [
        { file: `umd/${src_name}.js`, format: 'umd', name:module_name, exports:'named', sourcemap },
        { file: `esm/web/${src_name}.js`, format: 'es', sourcemap } ]})

  if (plugins_min)
    configs.push({
      input: `code/${src_name}.jsy`,
      plugins: plugins_min, external,
      output: { file: `umd/${src_name}.min.js`, format: 'umd', name:module_name, exports:'named', sourcemap }})
}
