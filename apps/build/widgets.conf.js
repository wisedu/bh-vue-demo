var path = require('path');

module.exports = {
    prefix: 'demo',
    paths: [
        '../hello/hello.vue',
        '../hello/a.vue'
    ],
    out: '../../static/apps/',
    alias: {
        'bh-vue': path.resolve(__dirname, '../../node_modules/bh-vue')
    }
};
