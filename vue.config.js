const webpack = require('webpack');
const path = require('path');

module.exports = {
  // proxy API requests to Valet during development
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.BASE_URL,
        changeOrigin: true,
      },
    },
  },

  assetsDir: 'admin',

  outputDir: (process.env.VUE_APP_NODE_ENV === 'local')
    ? `../${process.env.VUE_APP_BACKEND_FOLDER}/public`
    : '../public',

  indexPath:
    process.env.VUE_APP_NODE_ENV === 'production'
      ? '../resources/views/index-admin.blade.php'
      : '../resources/views/dev-admin.blade.php',
  
  publicPath: ['local'].includes(process.env.VUE_APP_NODE_ENV) ? '/' : `${process.env.ASSET_URL}/`,

  transpileDependencies: [
    'vuetify'
  ],

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery',
      }),
    ]
  },
  chainWebpack: config => config.resolve.symlinks(false)
}
