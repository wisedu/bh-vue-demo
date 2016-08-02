// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    productionSourceMap: true
  },
  dev: {
    env: require('./dev.env'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    port: 3000,
    proxyTable: {
      '/fe_components/mock/**/*.json': 'http://res.wisedu.com/'
    }
  }
}
