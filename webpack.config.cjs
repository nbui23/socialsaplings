const path = require('path');

module.exports = {
  mode: 'development', // Use 'production' for production builds
  entry: './src/firebase/firebase.js', // Your entry point
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file
  },
  devtool: 'eval-source-map', // Source maps for development
  module: {
    rules: [
      {
        test: /\.js$/, // Target .js files for babel-loader
        exclude: /node_modules/, // Skip node_modules directory
        use: {
          loader: 'babel-loader', // Use babel-loader
          options: {
            presets: ['@babel/preset-env'], // Preset for compiling ES2015+ syntax
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Resolve these extensions
  },
};
