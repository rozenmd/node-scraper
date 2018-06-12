import path from 'path'
import webpack from 'webpack'
import zip from 'zip-webpack-plugin'

export default {
  entry: path.resolve(__dirname),
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: 'index.js',
    library: 'index',
    libraryTarget: 'umd'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, '..'),
        exclude: path.resolve(__dirname, '..', 'node_modules'),
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new zip({
      filename: 'index.zip'
    })
  ]
}
