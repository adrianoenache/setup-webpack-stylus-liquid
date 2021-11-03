// Vars
const NODE_ENV = process.env.NODE_ENV || "development";
const rootPath = ".";

// Commons
const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// Plugins
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

let $envProd = false;
let $sourceMap = "source-map";
let $buildFolder = "dist";

if (NODE_ENV === "production") {
  $envProd = true;
  $sourceMap = false;
  $buildFolder = "prod";
}

const entry = {
  app: "./src/assets/js/app.js",
  guideline: "./src/assets/js/guideline.js",
};

const output = {
  filename: "assets/js/[name]-[contenthash:6].js",
  path: path.resolve(__dirname, $buildFolder),
  libraryTarget: "umd",
  library: "app",
};

const devServer = {
  port: 4000,
  static: path.join(__dirname, $buildFolder),
  // open: 'Chrome',
  // writeToDisk: false
};

const _module = {
  rules: [
    // HTML
    {
      test: /\.html|liquid$/i,
      use: [
        {
          loader: "liquidjs-loader",
          options: {
            extname: ".liquid",
            data: {
              dev_evn: NODE_ENV,
            },
          },
        },
        {
          loader: "html-loader",
        },
      ],
    },
    // Images
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      type: "asset",
    },
    // Stylus
    {
      test: /\.styl$/i,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
          },
        },
        {
          loader: "stylus-loader",
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    // Critical CSS
    {
      test: /\.css$/i,
      use: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
      ],
    },
    // JS
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
      },
    },
  ],
};

const plugins = [
  new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: $envProd,
    },
    hash: $envProd,
    chunks: ["app"],
    filename: "index.html",
    inject: "body",
    template: __dirname + "/src/index.html",
  }),
  new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: $envProd,
    },
    hash: $envProd,
    chunks: ["guideline"],
    filename: rootPath + "/guideline/" + "index.html",
    inject: "body",
    template: __dirname + "/src/guideline/index.html",
  }),
  new MiniCssExtractPlugin({
    filename: rootPath + "/assets/css/[name]-[contenthash:6].css",
    chunkFilename: rootPath + "/assets/css/[id]-[contenthash:6].css",
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer(),
        cssnano({
          preset: "advanced",
        }),
      ],
    },
  }),
  new ImageMinimizerPlugin({
    minimizerOptions: {
      // Lossless optimization with custom option
      // Feel free to experiment with options for better result for you
      plugins: [
        ["gifsicle", { interlaced: true }],
        ["jpegtran", { progressive: true }],
        ["optipng", { optimizationLevel: 5 }],
      ],
    },
  }),
  new webpack.HotModuleReplacementPlugin(),
];

module.exports = {
  mode: NODE_ENV,
  devtool: $sourceMap,
  stats: {
    children: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  entry,
  devServer,
  output,
  module: _module,
  plugins,
};
