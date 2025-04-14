// Vars
const NODE_ENV = process.env.NODE_ENV || 'development';
const rootPath = '.';

console.log('#### process.env.NODE_ENV = ', process.env.NODE_ENV);
console.log('#### NODE_ENV = ', NODE_ENV);

// Commons
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const svgToMiniDataURI = require('mini-svg-data-uri');

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

let $envProd = false;
let $sourceMap = 'source-map';
let $buildFolder = 'dev';
let $compress = false;
let $port = 4000;

// Caminho para a pasta de dados
const dataDir = path.resolve(__dirname, 'src/data');

// Função para carregar todos os arquivos JSON da pasta
const loadJsonFiles = (dir) => {
  const files = fs.readdirSync(dir);
  const data = {};

  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(dir, file);
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const fileName = path.basename(file, '.json'); // Nome do arquivo sem extensão
      data[fileName] = fileData; // Adiciona os dados ao objeto com o nome do arquivo como chave
    }
  });

  return data;
};

// Carregar todos os arquivos JSON
const jsonData = loadJsonFiles(dataDir);

if (NODE_ENV === 'production') {
  $envProd = true;
  $sourceMap = false;
  $buildFolder = 'prod';
	$compress = true;
	$port = 4001;
}

const mode = NODE_ENV;

const devtool = $sourceMap;

const stats = {
  children: true,
};

const optimization = {
  splitChunks: {
    chunks: 'all',
  },
};

const entry = {
  main: './src/assets/js/app/main.js',
  guideline: './src/assets/js/app/guideline.js',
};

const output = {
  filename: 'assets/js/[name]-[contenthash:6].js',
  path: path.resolve(__dirname, $buildFolder),
};

const devServer = {
  compress: $compress,
  port: $port,
  static: `${rootPath}/${$buildFolder}`,
};

const watchOptions = {
  aggregateTimeout: 300,
  followSymlinks: true,
  ignored: /node_modules/,
  poll: 1000,
  stdin: true,
};

const _module = {
  rules: [
    // HTML
    {
      test: /\.html|liquid$/i,
      use: [
        {
          loader: 'html-loader',
        },
        {
          loader: 'liquidjs-loader',
          options: {
            extname: '.liquid',
            data: {
              dev_evn: NODE_ENV,
							...jsonData,
            },
          },
        },
      ],
    },
    // Images
    {
      test: /\.(jpe?g|png|gif)$/i,
      type: 'asset/resource',
      generator: {
        filename: './assets/img/[name]-[hash:6][ext]',
      },
    },
    {
      test: /\.(ico)$/i,
      type: 'asset/resource',
      generator: {
        filename: './assets/favicon/[name]-[hash:6][ext]',
      },
    },
    {
      test: /\.(svg)$/i,
      type: 'asset/inline',
      generator: {
        dataUrl: (content) => {
          content = content.toString();
          return svgToMiniDataURI(content);
        },
      },
    },
    // Fonts
    {
      test: /\.(woff?2|eot|ttf|otf)$/i,
      type: 'asset/resource',
      generator: {
        filename: './assets/fonts/[name]-[hash:6][ext]',
      },
    },
    // Stylus
    {
      test: /\.styl$/i,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'stylus-loader',
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
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    // JS
		{
			test: /\.m?js$/,
			type: 'javascript/auto',
			resolve: {
				fullySpecified: false,
			},
		},
		// Json
		{
			test: /\.json$/,
			type: 'json'
		},
		// Babel
    {
      test: /\.m?js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
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
    chunks: ['main'],
    filename: 'index.html',
    inject: 'body',
    template: __dirname + '/src/index.html',
  }),
  new HtmlWebpackPlugin({
    minify: {
      collapseWhitespace: $envProd,
    },
    hash: $envProd,
    chunks: ['guideline'],
    filename: rootPath + '/guideline/' + 'index.html',
    inject: 'body',
    template: __dirname + '/src/guideline/index.html',
  }),
  new MiniCssExtractPlugin({
    filename: rootPath + '/assets/css/[name]-[contenthash:6].css',
    chunkFilename: rootPath + '/assets/css/[id]-[contenthash:6].css',
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        autoprefixer(),
        cssnano({
          preset: 'advanced',
        }),
      ],
    },
  }),
  new ESLintPlugin({
    cache: true,
    configType: 'flat',
    exclude: 'node_modules'
  }),
];

module.exports = {
  mode,
  devtool,
  stats,
  optimization,
  entry,
  devServer,
  watchOptions,
  output,
  module: _module,
  plugins,
};
