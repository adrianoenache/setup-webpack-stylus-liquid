// Vars
const NODE_ENV = process.env.NODE_ENV || 'development';
const rootPath = '.';

// Commons
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

// Plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let $env = false;

if (NODE_ENV == 'production') {
    $env = true;
}

//

const entry = {
    app: './src/assets/js/app.js',
    guideline: './src/assets/js/guideline.js'
}

const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/js/[name].js',
    libraryTarget: 'umd',
    library: 'app'
}

const devServer = {
    port: 8080,
    contentBase: path.join(__dirname, 'dist'),
    //open: 'Chrome',
    //writeToDisk: false,
    //hot: true
}

const _module = {
    rules: [
        // HTML
        {
            test: /\.html$/,
            use: [{
                loader: "html-loader"
            }, {
                loader: "liquid-loader",
                options: {
                    data: {
                        dev_evn: NODE_ENV == 'development'
                    }
                }
            }]
        },
        // Images
        {
            test: /\.(gif|png|jpe?g|svg)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        esModule: false,
                        name: '[name].[hash:5].[ext]',
                        outputPath: '/assets/img/'
                    }
                },
                {
                    loader: 'image-webpack-loader',
                    options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        optipng: {
                            enabled: false,
                        },
                        pngquant: {
                            quality: [0.65, 0.90],
                            speed: 4
                        },
                        gifsicle: {
                            interlaced: false,
                        },
                        webp: {
                            quality: 75
                        }
                    }
                }
            ]
        },
        // Stylus
        {
            test: /\.styl$/,
            use: [
                 MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'stylus-loader'
            ]
        }
    ]
}


const plugins = [
    new HtmlWebpackPlugin({
        minify: {
            collapseWhitespace: $env
        },
        hash: true,
        excludeChunks: [
            'guideline'
        ],
        template: __dirname + '/src/index.html'
    }),
    new HtmlWebpackPlugin({
        minify: {
            collapseWhitespace: $env
        },
        hash: true,
        chunks: [
            'guideline'
        ],
        filename: rootPath + '/guideline/' + 'index.html',
        template: __dirname + '/src/guideline/index.html'
    }),
    new MiniCssExtractPlugin({
        filename: rootPath + '/assets/css/[name].css',
        chunkFilename: rootPath + '/assets/css/[id].css',
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [
                autoprefixer(),
                cssnano({
                    preset: 'advanced',
                })
            ]
        }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
]

module.exports = {
    entry,
    output,
    devServer,
    module: _module,
    plugins
}
