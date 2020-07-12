'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TenserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// build mode definition
const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

// for optimization section
const optimization = () => {
    const config = {
        splitChunks: {chunks: "all"}
    }
    if (isProd) config.minimizer = [
        new TenserWebpackPlugin(),
        new OptimizeCssWebpackPlugin()
    ]
}

// to generate bundle file name
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

// loaders for css and css preprocess tools (less, sass etc.)
// for use with the preprocess tool, you need pass the name of the desired loader
const cssLoaders = (extra, isModule = false) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        },
        'css-modules-typescript-loader',
    ]
    if (!isModule) loaders.push('css-loader')
    else loaders.push(
        {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                modules: true
            }
        }
    )

    if (extra) loaders.push(extra)
    return loaders
}

// loaders for js files
const jsLoaders = (...presets) => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: [
                    '@babel/preset-env',
                    ...presets
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties'
                ]
            }
        }
    ]
    if (isDev) loaders.push('eslint-loader')
    return loaders
}

// for plugins section
const plugins = () => {
    const base = [
        // plugin for connecting scripts to html template
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        // plugin for clears the build folder
        new CleanWebpackPlugin,
        // file copy plugin
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, ''),
        //             to: path.resolve(__dirname, '')
        //         },
        //     ],
        // }),
        // plugin for connecting css as separate file
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
    ]
    if (isProd) base.push(new BundleAnalyzer())
    return base
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "development",
    entry: {
        main: ['@babel/polyfill', './index.tsx']
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.css', '.scss'],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders(),
                exclude: /\.module\.css$/
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader'),
                exclude: /\.module\.less$/
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader'),
                exclude: /\.module\.s[ac]ss$/
            },
            {
                test: /\.css$/,
                use: cssLoaders(null, true),
                include: /\.module\.css$/
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader', true),
                include: /\.module\.less$/
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader', true),
                include: /\.module\.s[ac]ss$/
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: jsLoaders('@babel/preset-typescript')
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: jsLoaders('@babel/preset-react')
            },
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: jsLoaders('@babel/preset-react', '@babel/preset-typescript')
            }
        ]
    },
}