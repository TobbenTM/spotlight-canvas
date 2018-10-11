const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    spotlight: './src/spotlight.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'Spotlight',
    umdNamedDefine: true,
  },
  devtool: 'source-map'
};
