const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
    entry: ['./client/src/game.js', './webpack/credits.js'],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            CONSTANTS: path.resolve(__dirname, 'src/constants')
        }
    },
    module: {
        rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                    filename: '[name].bundle.js'
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({ gameName: 'Projeto 437', template: 'client/index.html' }),
        new CopyWebpackPlugin([
            { from: 'client/assets', to: 'assets' },
            { from: 'client/audio', to: 'audio' },
            // Progressive Web App Configuration
            { from: 'pwa', to: '' }
        ]),
        // Web Progressive App
        new InjectManifest({
            swSrc: path.resolve(__dirname, '../pwa/sw.js')
        })
    ]
};
