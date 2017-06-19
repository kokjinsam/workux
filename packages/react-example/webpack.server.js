const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config.dev");

const server = new WebpackDevServer(webpack(webpackConfig), {
  stats: {
    assets: false,
    cached: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false,
    source: false,
    version: true,
    errors: true,
    errorDetails: true,
    timings: true,
    warnings: true,
  },
  overlay: {
    warnings: true,
    errors: true,
  },
  hot: true,
  inline: true,
  historyApiFallback: true,
  publicPath: "/",
  contentBase: path.join(__dirname, "build"),
});

server.listen(4000, "localhost", err => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  console.log("Webpack dev server started at http://localhost:4000/");
});
