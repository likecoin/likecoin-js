const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'like-pay.js',
    library: 'likePay',
    libraryTarget: 'umd',
  },
};
