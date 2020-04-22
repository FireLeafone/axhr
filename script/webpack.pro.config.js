"use strict";

/**
 * webpack build config
 */

var webpack = require("webpack");
var CONFIG = require("./config");
var utils = require("./utils");

var baseConfig = {
  mode: "production",
  entry: utils.resolve("src/index"),
  output: {
    filename: "axhr.js",
    path: CONFIG.buildPath,
    library: "axhr",
    libraryTarget: "umd",
    libraryExport: "default"
  },
  resolve: {
    modules: [
      utils.resolve("node_modules")
    ],
    extensions: [".js"],
    alias: {}
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader", // 缓存loader执行结果
        exclude: /(node_modules)/
      }
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(), // 2.x以上；编译时出错，跳过，编译后保错
  ],
  externals: {
    axios: "axios",
    lodash: "lodash"
  }
};

module.exports = baseConfig;
