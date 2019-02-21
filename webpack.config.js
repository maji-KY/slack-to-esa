const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const env = process.env.NODE_ENV;
const distDir = "scripts";

const config = {

  "mode": env,

  "entry": [
    path.resolve(__dirname, "src/main/index.ts")
  ],

  "output": {
    "path": path.join(__dirname, distDir),
    "filename": "bundle.js",
    "library": "ste",
    "libraryTarget": "commonjs2"
  },

  "target": "node",
  "externals": [nodeExternals()],

  "resolve": {
    "extensions": [".tsx", ".ts", ".js"],
    "modules": [
      path.join(__dirname, "src/main"),
      "node_modules"
    ]
  },

  "plugins": [
    new CleanWebpackPlugin([distDir])
  ],

  "module": {
    "rules": [
      {
        "test": /\.tsx?$/,
        "use": ["ts-loader"],
        "exclude": /node_modules/
      }
    ]
  }
};

if (env === "production") {
  config.plugins.push(new UglifyJsPlugin({
    "uglifyOptions": {
      "ecma": 8
    }
  }));
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
  config.plugins.push(new webpack.LoaderOptionsPlugin({"minimize": true}));
} else {
  config.plugins.push(new webpack.NamedModulesPlugin());
  config.devtool = "eval-source-map";
  config.externals = {};
}

module.exports = config;
