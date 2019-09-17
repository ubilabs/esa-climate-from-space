const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, {mode} = {}) => {
  const isProduction = mode === 'production';
  return {
    entry: './src/scripts/index.tsx',
    devtool: 'inline-source-map',
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
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
                modules: false
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
      })
    ]
  };
};
