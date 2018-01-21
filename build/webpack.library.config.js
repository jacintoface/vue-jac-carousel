const path = require('path');
const webpack = require('webpack');
const npmCfg = require('../package.json');
// const baseWebpackConfig = require('./webpack.base.conf')
const projectRoot = path.resolve(__dirname, '../');
const merge = require('webpack-merge')
const vueLoaderConfig = require('./vue-loader.conf')
const utils = require('./utils')
const config = require('../config')
var banner = [
  'vue-jac-carousel v' + npmCfg.version,
  '(c) ' + (new Date().getFullYear()) + ' ' + npmCfg.author,
].join('\n')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
let configs = {
  entry: path.join(__dirname,'../library'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'vue-jac-carousel.js',
    library: 'VueJacCarousel',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      ...utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    ]
  },
  plugins: [
  ]
}

module.exports = configs

