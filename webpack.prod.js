const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = merge(common,
    {
        mode: 'production',
        output: {
            path: path.join(__dirname, 'public'),
            filename: 'bundle.js'
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.s?css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: ''
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1, // set it to 1 if specifying more loaders
                                sourceMap: true,
                                modules: {
                                    localIdentName: "[path]__[name]__[local]__[hash:base64:5]",
                                },
                                url: true
                            }
                        },
                        {
                            // compiles Sass to CSS
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        }
                    ]
                },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                // The filename need to be equal to the css file that is imported by the public/index.html
                filename: 'styles.css',
            })
        ]
    }
);