// Global imports
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// Paths
const includePath = path.join(__dirname, 'src');
const nodeModulesPath = path.join(__dirname, 'node_modules');
const outputPath = path.join(__dirname, `/build/js`);

module.exports = env => {
  // Dev environment
  let devtool = 'eval';
  let mode = 'development';
  let stats = 'minimal';
  const plugins = [
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(env.NODE_ENV)
    })
  ];

  // Prod environment
  if (env.NODE_ENV === 'prod') {
    devtool = 'hidden-source-map';
    mode = 'production';
    stats = 'none';
  }

  console.log('Webpack build -');
  console.log(`    - ENV: ${env.NODE_ENV}`);
  console.log(`    - outputPath  ${outputPath}`);
  console.log(`    - includePath ${includePath}`);
  console.log(`    - nodeModulesPath: ${nodeModulesPath}`);

  return {
    entry: [path.join(__dirname, 'src/app.js')],

    // options related to how webpack emits results
    output: {
      // the target directory for all output files
      // must be an absolute path (use the Node.js path module)
      path: outputPath,
      // the url to the output directory resolved relative to the HTML page
      publicPath: 'js',
      // the filename template for entry chunks
      filename: 'app.js'
    },

    // Webpack 4 mode helper
    mode,
    module: {
      rules: [
        {
          test: /\.js?$/,
          use: {
            loader: 'babel-loader',
          },
          exclude: nodeModulesPath,
        },
        {
          test: /\.(s*)css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: 'css'
              }
            },
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        }
      ]
    },
    resolve: {
      modules: [
        'node_modules',
        path.resolve(__dirname, 'src')
      ],

      // extensions that are used
      extensions: ['.js', '.json'],
    },

    performance: {
      hints: 'warning'
    },
    stats,
    devtool,
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      port: 3000,
      host: '0.0.0.0'
    },

    plugins: plugins.concat(
      new HtmlWebpackPlugin({
        title: 'Three.js Webpack ES6 Boilerplate',
        template: path.join(__dirname, 'src/html/index.html'),
        filename: '../index.html',
        env: env.NODE_ENV,
      }),
      new MiniCssExtractPlugin({
        filename: '../css/[name].css',
        chunkFilename: '../css/[id].css'
      })
    ),

    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\\/]node_modules[\\\/]/,
            name: 'vendors',
            chunks: 'all'
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    }
  };
};
