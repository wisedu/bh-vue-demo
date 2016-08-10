module.exports = {
    // 'devtool': 'source-map',
    'entry': {
        'app1': './entry1.js',
        'app2': './entry2.js'
    },
    'output': {
        'path': '../../static/widgets/',
        'filename': '[name].js',
        'publicPath': ''
    },
    'resolve': {
        'extensions': ['', '.js', '.vue']
    },
    'module': {
        'loaders': [{
            'test': /\.vue$/,
            'loader': 'vue'
        },
        {
            'test': /\.js$/,
            'loader': 'babel',
            'include': '../'
        },
        {
            'test': /\.json$/,
            'loader': 'json'
        }, {
            'test': /\.html$/,
            'loader': 'vue-html'
        }, {
            'test': /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            'loader': 'url',
            'query': {
                'limit': 10000,
                'name': './resources/imgs/[name].[hash:7].[ext]'
            }
        }]
    }
};
