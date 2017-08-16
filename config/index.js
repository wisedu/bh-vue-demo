// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '',
    assetsPublicPath: 'https://wisedu.github.io/bh-vue-demo/',
    productionSourceMap: true
  },
  dev: {
    env: require('./dev.env'),
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    port: 8000,
    proxyTable: {
      '/fe_components/mock/**/*.json': 'http://res.wisedu.com/',
      '/xsxx/**/*.do': 'http://172.20.6.12:8080'
    }
  }
}
