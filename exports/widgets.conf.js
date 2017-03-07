var path = require('path');

module.exports = {
    prefix: 'demo',
    paths: [
        '../apps/hello/hello.vue',
        '../apps/hello/a.vue'
    ],
    out: '../static/apps/',
    alias: {
        'bh-vue': path.resolve(__dirname, '../node_modules/bh-vue')
    }
};
