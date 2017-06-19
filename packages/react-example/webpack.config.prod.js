const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",
  target: "web",
  entry: {
    main: [path.join(__dirname, "./source/main/index.js")],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "build"),
    publicPath: "/",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: {
        screw_ie8: true,
      },
      compress: {
        dead_code: true,
        drop_console: true,
        pure_getters: true,
        screw_ie8: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false, // Suppress uglification warnings
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
      exclude: [/\.min\.js$/gi], // skip pre-minified libs
    }),
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
      filename: "index.html",
      template: path.join(__dirname, "templates/index.html"),
      chunks: ["main"],
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    noParse: /\.min\.js/,
    rules: [
      {
        test: /\.jsx?$/,
        include: /source/,
        use: [{ loader: "babel-loader" }],
      },
    ],
  },
};
