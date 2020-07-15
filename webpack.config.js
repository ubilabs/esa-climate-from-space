const path = require('path');
const webpack = require('webpack');
const gitState = require('git-state');
const packageJson = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, {mode} = {}) => {
  const isProduction = mode === 'production';
  const gitHash =
    (gitState.isGitSync(__dirname) && gitState.commitSync(__dirname)) || '-';

  const config = {
    entry: './src/scripts/index.tsx',
    devtool: isProduction ? undefined : 'inline-source-map', // eslint-disable-line no-undefined
    optimization: {
      minimizer: [
        new TerserJSPlugin({extractComments: false}),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    target: 'web',
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.styl'],
      alias: {
        // use an empty mock module for web
        electronHelpers: path.resolve(
          __dirname,
          './src/scripts/libs/electron-helpers-mock.ts'
        )
      }
    },
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.(png|gif|jpg|jpeg)$/,
          loader: 'file-loader'
        },
        {
          test: /\.css$/,
          use: [{loader: 'style-loader'}, {loader: 'css-loader'}]
        },
        {
          test: /\.styl$/,
          use: [
            {
              loader: isProduction
                ? MiniCssExtractPlugin.loader
                : 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]'
                }
              }
            },
            {loader: 'stylus-loader'}
          ]
        },
        {
          test: /\.(woff(2)?|ttf|otf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        },
        {
          test: /\.(svg)?$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/'
            }
          }
        }
      ]
    },
    output: {
      filename: 'bundle.[hash].js',
      path: path.resolve(__dirname, 'dist'),
      hashDigestLength: 8,
      sourcePrefix: ''
    },
    devServer: {
      contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'storage')],
      contentBasePublicPath: ['/', '/storage'],
      port: 8080,
      watchContentBase: true
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        favicon: 'assets/images/favicon.svg'
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.[hash].css'
      }),
      new webpack.DefinePlugin({
        INFO_BUILD_TIME: JSON.stringify(new Date().toISOString()),
        INFO_GIT_HASH: JSON.stringify(gitHash),
        INFO_VERSION: JSON.stringify(packageJson.version),
        CESIUM_BASE_URL: JSON.stringify('./cesium/'),
        PRODUCTION: JSON.stringify(isProduction)
      }),
      new CopyPlugin([
        {
          from: './node_modules/cesium/Build/Cesium/Assets',
          to: './cesium/Assets'
        },
        {
          from: './node_modules/cesium/Build/Cesium/ThirdParty',
          to: './cesium/ThirdParty'
        },
        {
          from: './node_modules/cesium/Build/Cesium/Widgets',
          to: './cesium/Widgets'
        },
        {
          from: './node_modules/cesium/Build/Cesium/Workers',
          to: './cesium/Workers'
        }
      ])
    ]
  };

  // Remove debug code in Cesium - see https://github.com/CesiumGS/cesium-webpack-example
  if (isProduction) {
    config.module.rules.push({
      test: /\.js$/,
      enforce: 'pre',
      include: path.resolve(__dirname, 'node_modules/cesium/Source'),
      sideEffects: false,
      use: [
        {
          loader: 'strip-pragma-loader',
          options: {
            pragmas: {
              debug: false
            }
          }
        }
      ]
    });
  }

  return config;
};
