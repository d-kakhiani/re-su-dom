const path = require('path');

module.exports = {
  mode: 'production',
  // watch: true,
  entry: {
    app: './public/components/library.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
  },
  resolve: {
    modules: ['node_modules'],
  },
};