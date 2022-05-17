const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: 'src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    clean: true
  },
  module: {
    rules: {
      test: /\.js$/,
      use:[
        'babel-loader' 
    ]
  }
  },
  module: {
    rules: [
      {
        // .scss .css로 확장자를 찾게 해준다.
        test:/\.s?css$/,
        // js에서 css를 해석할 수 있게 해주는 css-loader
        // 해석된 내용을 삽입해주는 style-loader
        use:[
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      }
    ]
  },

  plugins: [
    new HtmlPlugin({
      template: './index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'static' }
      ]
    })
  ],

  devServer: {
    host: 'localhost'
  }
}