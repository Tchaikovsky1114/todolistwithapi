const path = require('path');
const HtmlPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.mjs',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true
  },
  resolve:{
    modules: ['node_modules'],
    extensions: ['.js']
  },
  module: {
    rules: {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: '> 1%, not dead',
                useBuiltIns: 'usage',
                corejs: {version: '3.16'}
              }
            ]
          ]
        }
      },
      exclude: /(node_modules)/ 
    }
    
  },
  module: {
    rules: [
      {
        //.css로 확장자를 찾게 해준다.
        test:/\.css$/,
        // js에서 css를 해석할 수 있게 해주는 css-loader
        // 해석된 내용을 삽입해주는 style-loader
        use:[
          'style-loader',
          'css-loader',
          'postcss-loader',
        ]
      }
    ]
  },
  optimization:{
    minimize:true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console:true
          }
        }
      })
    ],
  },

  plugins: [
    new HtmlPlugin({
      template: './index.html'
    }),
    new CompressionPlugin()
  ],

  devServer: {
    host: 'localhost'
  }
}