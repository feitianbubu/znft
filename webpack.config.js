const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OfflinePlugin = require('offline-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const binPath = 'build/';

process.noDeprecation = true;

let postcss_plugins = [
  require('postcss-simple-vars'),
  require('postcss-cssnext')({
    compress: true
  }),
  require('postcss-sprites')({
    retina: true,
    spritePath: binPath+'assets/temp/images',
    filterBy: (image) =>{
      if (image.url.indexOf('/sprites/') === -1){
        return Promise.reject();
      }
      return Promise.resolve();
    }
  }),
  // require("cssnano")({ 
  //   autoprefixer: false 
  // })
];

module.exports = {
  mode: 'development',
  entry: ['@babel/polyfill', './src/index.js'],
  devtool: 'source-map',
  devServer: { 
    // inline: true,
    static: {
      directory: path.join(__dirname, binPath),
    },
    compress: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, binPath, 'assets'),
    publicPath: "/assets/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use:[
          'babel-loader'
        ]
      },
      {
        test: /\.(pcss|css)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1
          }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['postcss-simple-vars'],
                  ['postcss-cssnext', {compress:true}],
                  ['postcss-sprites', {
                    retina: true,
                    spritePath: binPath+'assets/temp/images',
                    filterBy: (image) =>{
                      if (image.url.indexOf('/sprites/') === -1){
                        return Promise.reject();
                      }
                      return Promise.resolve();
                    }
                  }]
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: /(node_modules|bower_components)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            // options: {
            //   minimize: {autoprefixer: false}
            // }
          },
        ]
      },
      {
        test: /\.(woff|woff2|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options:{
              limit: 10000,
              name: 'fonts/[sha1:hash:hex:7].[ext]',
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options:{
              limit: 10000,
              name: 'images/[sha1:hash:hex:7].[ext]',
            }
          }
        ]
      }
    ]
  },
  plugins:[
    // new OfflinePlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    new MiniCssExtractPlugin({
      filename: "stylesheets/styles.css"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'index.html', to: '..' }
      ]
    })
  ]
};
