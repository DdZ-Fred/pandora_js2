const path = require('path');
const webpack = require('webpack');

const excludedPaths = [
  path.resolve(__dirname, 'node_modules'),
];

module.exports = {
  entry: [
    './client/app.js',
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    hot: true,
    inline: true,
    port: 5005,
    progress: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: excludedPaths
      },
      // Non-Moduled CSS
      {
        test: /^(?!.*?\.module).*\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true,
            }
          }
        ]
      },
      // CSS Modules
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              module: true,.
            }
          }
        ]
      }
    ],
  },
  plugins: [
  ],
};
