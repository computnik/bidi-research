const path = require('path')
const fs = require('fs')
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// const outputDirectory = 'dist'

const KEY_PATH = path.resolve('certs/key.pem')
const CERT_PATH = path.resolve('certs/server.crt')
const STATIC_FILES_PATH = path.resolve('dist')


module.exports = {
  entry: ['./src/client/index.tsx'],
  output: {
    path: STATIC_FILES_PATH,
    filename: './js/[name].bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  devServer: {
    port: 8000,
    open: true,
    hot: true,
    historyApiFallback: true, //setting devserver to serve on all routes
    http2: true,
    server: {
      type: 'https',
      options: {
        minVersion: 'TLSv1.1',
        key: fs.readFileSync(KEY_PATH),
        cert: fs.readFileSync(CERT_PATH),
      },
    },
    proxy: {
      '/api': {
        target: 'https://localhost:8001',
        secure: false,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      PUBLIC_URL: '/',
      NODE_ENV: process.env.NODE_ENV,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      favicon: './public/favicons/favicon.ico',
      title: 'express-typescript-react',
    }),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
      chunkFilename: './css/[id].css',
    }),
  ],
}
