const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// const {CopyWebpackPlugin} = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TenserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const optimization = () => {
    const config = {
        splitChunks: {chunks: "all"}
    }
    if (isProd) config.minimizer = [
        new TenserWebpackPlugin(),
        new OptimizeCssWebpackPlugin()
    ]
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            }
        },
        'css-loader']
    if (extra) loaders.push(extra)
    return loaders
}


module.exports = {
    // Указывает отправную точку для расчета относительных путей
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: ['@babel/polyfill', './index.js'],
        secondary: './secondary.js'
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'build')
    },
    mode: "development",
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        // Псевдонимы путей
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    plugins: [
        // Автоматическое подключение бандлов в html
        new HtmlWebpackPlugin({
            //Генерирует index.html в папке со сборкой, если не указан template
            //title: 'Webpack',
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        // Автоматически чистит папку со сборкой
        new CleanWebpackPlugin,
        // Позволяет делать копирование файлов
        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, 'some_path'),
        //         to: path.resolve(__dirname, 'some_path')
        //     }
        // ]),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
    ],
    module: {
        rules: [
            // Собирает стили в тег style
            // {
            //     test: /\.css$/,
            //     use: ['style-loader', 'css-loader']
            // },
            // Подключает стили как отдельный файл
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
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
                loader: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ],
                        plugins: [
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            }
        ]
    },
}