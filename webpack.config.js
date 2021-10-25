// Vars
const NODE_ENV = process.env.NODE_ENV || "development";
const rootPath = ".";

// Commons
const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

// Plugins
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let $env = false;

if (NODE_ENV == "production") {
  $env = true;
}

//

const entry = {
  app: "./src/assets/js/app.js",
  guideline: "./src/assets/js/guideline.js",
};

const output = {
  filename: "assets/js/[name].js",
  path: path.resolve(__dirname, "dist"),
  libraryTarget: "umd",
  library: "app",
};

const devServer = {
  port: 8080,
  static: path.join(__dirname, "dist"),
  // open: 'Chrome',
  // writeToDisk: false,
  // hot: true
};

const _module = {
  rules: [
    // HTML
    {
      test: /\.html$/,
      use: [
        {
          loader: "html-loader",
        },
        {
          loader: "liquid-loader",
          options: {
            data: {
              dev_evn: NODE_ENV == "development",
            },
          },
        },
      ],
    },
    // Images
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        {
          loader: "file-loader", // Or `url-loader` or your other loader
        },
      ],
    },
    // Stylus
    {
      test: /\.styl$/,
      use: [
        MiniCssExtractPlugin.loader,
        "css-loader",
        "postcss-loader",
        "stylus-loader",
      ],
    },
  ],
};

const plugins = [
  new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: $env,
    },
    hash: true,
    excludeChunks: ["guideline"],
    template: __dirname + "/src/index.html",
  }),
  new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: $env,
    },
    hash: true,
    chunks: ["guideline"],
    filename: rootPath + "/guideline/" + "index.html",
    template: __dirname + "/src/guideline/index.html",
  }),
  new MiniCssExtractPlugin({
    filename: rootPath + "/assets/css/[name].css",
    chunkFilename: rootPath + "/assets/css/[id].css",
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
        [
          "svgo",
          {
            plugins: [
              {
                removeViewBox: false,
              },
            ],
          },
        ],
      ],
    },
  }),
  new webpack.HotModuleReplacementPlugin(),
//   new webpack.NamedModulesPlugin(),
];

module.exports = {
  mode: 'development',
  entry,
  devServer,
  output,
  module: _module,
  plugins,
};
