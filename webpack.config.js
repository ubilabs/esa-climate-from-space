const path = require('path');
const webpack = require('webpack');
const gitState = require('git-state');
const packageJson = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, {mode} = {}) => {
  const isProduction = mode === 'production';
  const gitHash =
    (gitState.isGitSync(__dirname) && gitState.commitSync(__dirname)) || '-';

  return {
    entry: './src/scripts/index.tsx',
    devtool: isProduction ? undefined : 'inline-source-map',
    optimization: {
      minimizer: [
        new TerserJSPlugin({extractComments: false}),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
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
                modules: true
              }
            },
            {loader: 'stylus-loader'}
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.styl']
    },
    output: {
      filename: 'bundle.[hash].js',
      path: path.resolve(__dirname, 'dist'),
      hashDigestLength: 8
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 9000
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.[hash].css'
      }),
      new webpack.DefinePlugin({
        INFO_BUILD_TIME: JSON.stringify(new Date().toISOString()),
        INFO_GIT_HASH: JSON.stringify(gitHash),
        INFO_VERSION: JSON.stringify(packageJson.version)
      })
    ]
  };
};
