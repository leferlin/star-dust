const merge = require('webpack-merge');
const common = require('./webpack.common');
// const server = require('../index')

const dev = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        noInfo: true,
        port: 8082
        // before
    }
};

module.exports = merge(common, dev);
