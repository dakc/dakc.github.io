const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AutoPrefixer = require('autoprefixer');

module.exports = [{
    mode: 'development',
    entry: {
        merodb: [
            './src/merodb/js/index.js',
            './src/merodb/sass/index.scss',
        ],
        majidai: [
            './src/majidai/js/index.js',
            './src/majidai/sass/index.scss',
        ],
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'js/[name].js',
        publicPath: '/',
    },
    devServer: {
        contentBase: './',
        watchContentBase: true,
        port: 3000,
        open: true,
    },
    module: {
        rules: [{
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env'],
                },
            },
            {
                test: /\.scss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                AutoPrefixer({
                                    browsers: ['last 2 versions', 'Android >= 4'],
                                }, ),
                            ],
                        },
                    }, {
                        loader: 'sass-loader',
                    }
                ],
            }
        ],
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
            new UglifyJsPlugin(),
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
    ],
}, ];