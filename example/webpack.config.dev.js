const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "eval",
  target: "web",
  entry: {
    main: [
      "react-hot-loader/patch",
      "webpack-dev-server/client?http://localhost:4000",
      "webpack/hot/only-dev-server",
      path.join(__dirname, "./source/main/index.js"),
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.join(__dirname, "build"),
    publicPath: "/",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
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
        use: [
          { loader: "babel-loader" },
        ],
      },
    ],
  }
};
