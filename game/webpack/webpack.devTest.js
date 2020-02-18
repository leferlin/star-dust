const merge = require('webpack-merge');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const common = require('./webpack.common');
// const server = require('../index')

const devTest = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        open: true,
        noInfo: true,
        port: 8082
        // before
    },
    plugins:[
    
        new CopyWebpackPlugin([{
                from: 'client/assets',
                to: 'assets'
            },
            {
                from: 'client/audio',
                to: 'audio'
            },
            // Progressive Web App Configuration
            { from: 'pwa/debug', to: '' }
        ]),
    ]
};

module.exports = merge(common, devTest);
