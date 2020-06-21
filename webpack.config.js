const path = require('path');
// this plugin is required to output css file
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: [
            './src/js/index.js',
            './src/sass/index.scss',
    ],
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'js/script.js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.(s)?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/style.css'
        }),
    ],
};