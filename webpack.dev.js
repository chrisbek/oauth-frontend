const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');


module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: '[name].dev.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        inline: true,
        host: '0.0.0.0',
        port: 8080,
        stats: 'minimal',
        // writeToDisk: true
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: "style-loader",
                        options: {
                            esModule: true,
                            modules: {
                                namedExport: false,
                            },
                        }
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
            // {
            //     test: /\.(gif|png|jpe?g|svg)$/i,
            //     use: [
            //         {
            //             loader: 'url-loader'
            //         },
            //     ]
            // }
        ]
    },
}
);