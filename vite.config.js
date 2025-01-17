import rollupOptions from './rollup.config.js'
import path from 'node:path'

export default ({
  appType: 'mpa',
  resolve: {
    alias: {
      "#test/bdd": path.resolve("./platform/web-bdd-mocha.js"),
    },
  },
  build: {
    rollupOptions,
  },
})
