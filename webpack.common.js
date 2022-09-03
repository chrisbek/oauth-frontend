const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");


module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src', 'index.html'),
            filename: 'index.html',
            favicon: path.join(__dirname, 'src', 'resources', 'favicon.svg'),
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            }
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            process: "process/browser"
        },
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "buffer": require.resolve("buffer"),
            "stream": require.resolve("stream-browserify"),
        }
    }
};